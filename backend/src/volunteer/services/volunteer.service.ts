import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class VolunteerService {
  constructor(private readonly prisma: PrismaService) {}

  /** Upgrade a donor to volunteer */
  async registerVolunteer(data: {
    donorId: string;
    city?: string;
    profession?: string;
    skills?: string[];
    availability?: string;
    linkedIn?: string;
    motivation?: string;
  }) {
    // Find donor by donorId (e.g. DNR1023)
    const donor = await this.prisma.donor.findUnique({
      where: { donorId: data.donorId },
      include: { volunteer: true },
    });
    if (!donor) throw new NotFoundException('Donor not found');
    if (donor.volunteer) throw new BadRequestException('Already registered as a volunteer');

    // Generate volunteer ID
    const lastVol = await this.prisma.volunteer.findFirst({ orderBy: { createdAt: 'desc' } });
    const nextId = lastVol ? parseInt(lastVol.volunteerId.replace('VOL', '')) + 1 : 1001;

    const volunteer = await this.prisma.volunteer.create({
      data: {
        volunteerId: `VOL${nextId}`,
        donorId: donor.id,
        email: donor.email,
        name: donor.name || 'Volunteer',
        mobile: donor.mobile || '',
        city: data.city,
        profession: data.profession,
        skills: data.skills || [],
        availability: data.availability,
        linkedIn: data.linkedIn,
        motivation: data.motivation,
      },
    });

    // Mark donor as volunteer
    await this.prisma.donor.update({
      where: { id: donor.id },
      data: { isVolunteer: true },
    });

    return volunteer;
  }

  /** Get full volunteer dashboard data */
  async getDashboard(volunteerId: string) {
    const volunteer = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId }, { email: volunteerId }] },
      include: {
        donor: { select: { donorId: true, totalDonated: true, tier: true } },
        referrals: { orderBy: { createdAt: 'desc' }, take: 5 },
        coinTransactions: { orderBy: { createdAt: 'desc' }, take: 10 },
        campParticipations: {
          include: { camp: { select: { name: true, date: true, location: true, activeQrExpiry: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
    if (!volunteer) throw new NotFoundException('Volunteer not found');
    const notifications = await (this.prisma as any).notification.findMany({
      where: { volunteerId: volunteer.id },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    const totalReferrals = await this.prisma.referral.count({
      where: { volunteerId: volunteer.id },
    });
    const totalReferralDonations = await this.prisma.referral.aggregate({
      where: { volunteerId: volunteer.id, status: 'DONATED' },
      _sum: { paymentAmount: true },
    });
    const campsAttended = await this.prisma.campParticipation.count({
      where: { volunteerId: volunteer.id },
    });

    // Leaderboard rank
    const rank = await this.prisma.volunteer.count({
      where: { totalCoins: { gt: volunteer.totalCoins } },
    });

    return {
      volunteer: {
        id: volunteer.id,
        volunteerId: volunteer.volunteerId,
        name: volunteer.name,
        email: volunteer.email,
        city: volunteer.city,
        profession: volunteer.profession,
        skills: volunteer.skills,
        totalCoins: volunteer.totalCoins,
        showOnLeaderboard: volunteer.showOnLeaderboard,
        hasClaimedLoginCoin: volunteer.hasClaimedLoginCoin,
        donorId: volunteer.donor.donorId,
        totalDonated: volunteer.donor.totalDonated,
        tier: volunteer.donor.tier,
      },
      stats: {
        totalCoins: volunteer.totalCoins,
        totalReferrals,
        totalReferralDonations: totalReferralDonations._sum.paymentAmount || 0,
        campsAttended,
        leaderboardRank: rank + 1,
      },
      recentReferrals: volunteer.referrals,
      recentTransactions: volunteer.coinTransactions,
      recentCamps: volunteer.campParticipations,
      notifications,
    };
  }

  /** Get all referrals for a volunteer */
  async getReferrals(volunteerId: string) {
    const vol = await this.findByIdOrEmail(volunteerId);
    return this.prisma.referral.findMany({
      where: { volunteerId: vol.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Get coin transaction history */
  async getCoinHistory(volunteerId: string) {
    const vol = await this.findByIdOrEmail(volunteerId);
    return this.prisma.coinTransaction.findMany({
      where: { volunteerId: vol.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Get camp participation history */
  async getCampHistory(volunteerId: string) {
    const vol = await this.findByIdOrEmail(volunteerId);
    return this.prisma.campParticipation.findMany({
      where: { volunteerId: vol.id },
      include: { camp: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Toggle leaderboard visibility */
  async toggleLeaderboard(volunteerId: string, show: boolean) {
    const vol = await this.findByIdOrEmail(volunteerId);
    return this.prisma.volunteer.update({
      where: { id: vol.id },
      data: { showOnLeaderboard: show },
    });
  }

  /** Get volunteer leaderboard */
  async getLeaderboard(limit = 50) {
    const volunteers = await this.prisma.volunteer.findMany({
      where: { isActive: true },
      orderBy: { totalCoins: 'desc' },
      take: limit,
      select: {
        volunteerId: true,
        name: true,
        totalCoins: true,
        showOnLeaderboard: true,
        city: true,
      },
    });
    return volunteers.map((v, i) => ({
      rank: i + 1,
      volunteerId: v.volunteerId,
      name: v.showOnLeaderboard ? v.name : 'Anonymous Volunteer',
      totalCoins: v.totalCoins,
      city: v.showOnLeaderboard ? v.city : null,
    }));
  }

  /** Get 6-month impact history for the graph */
  async getImpactHistory(volunteerId: string) {
    const vol = await this.findByIdOrEmail(volunteerId);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [transactions, referrals] = await Promise.all([
      this.prisma.coinTransaction.findMany({
        where: { volunteerId: vol.id, createdAt: { gte: sixMonthsAgo } },
        select: { amount: true, createdAt: true },
      }),
      this.prisma.referral.findMany({
        where: { volunteerId: vol.id, status: 'DONATED', createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const historyMap: Record<string, { month: string, coins: number, impact: number, sortKey: number }> = {};

    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = months[d.getMonth()];
      const year = d.getFullYear();
      const key = `${year}-${d.getMonth()}`;
      historyMap[key] = { month: m, coins: 0, impact: 0, sortKey: d.getTime() };
    }

    // Aggregate transactions
    transactions.forEach(tx => {
      const d = new Date(tx.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (historyMap[key]) historyMap[key].coins += tx.amount;
    });

    // Aggregate impact (referrals)
    referrals.forEach(ref => {
      const d = new Date(ref.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (historyMap[key]) historyMap[key].impact += 1;
    });

    return Object.values(historyMap)
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ month, coins, impact }) => ({ month, coins, impact }));
  }

  /** Update volunteer profile data */
  async updateProfile(volunteerId: string, data: {
    name?: string;
    mobile?: string;
    city?: string;
    profession?: string;
    skills?: string[];
    availability?: string;
    linkedIn?: string;
    motivation?: string;
  }) {
    const vol = await this.findByIdOrEmail(volunteerId);
    
    // Update volunteer
    const updated = await this.prisma.volunteer.update({
      where: { id: vol.id },
      data: {
        name: data.name,
        mobile: data.mobile,
        city: data.city,
        profession: data.profession,
        skills: data.skills,
        availability: data.availability,
        linkedIn: data.linkedIn,
        motivation: data.motivation,
      },
    });

    // Sync to donor record
    if (data.name || data.mobile) {
      await this.prisma.donor.update({
        where: { id: vol.donorId },
        data: {
          name: data.name,
          mobile: data.mobile,
        },
      });
    }

    return updated;
  }

  /** Find volunteer by volunteerId or email */
  private async findByIdOrEmail(identifier: string) {
    const vol = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId: identifier }, { email: identifier }] },
    });
    if (!vol) throw new NotFoundException('Volunteer not found');
    return vol;
  }

  /** Get commission overview for a volunteer */
  async getCommissionsData(volunteerId: string) {
    const vol = await this.findByIdOrEmail(volunteerId);
    
    // As TypeScript might not know about the new fields yet due to Prisma generate issue, cast to any
    const volAny = vol as any;

    const requests = await (this.prisma as any).withdrawalRequest.findMany({
      where: { volunteerId: vol.id },
      orderBy: { createdAt: 'desc' },
    });

    const totalCoins = vol.totalCoins;
    const withdrawnThreshold = volAny.withdrawnThreshold || 0;
    const availableGap = totalCoins - withdrawnThreshold;
    const isEligible = availableGap >= 100000;

    return {
      totalCoins,
      withdrawnThreshold,
      availableGap,
      isEligible,
      eligibleAmountInr: isEligible ? availableGap / 10 : 0,
      bankDetails: volAny.bankDetails ? JSON.parse(volAny.bankDetails) : null,
      history: requests,
    };
  }

  /** Update bank details */
  async updateBankDetails(volunteerId: string, bankData: any) {
    const vol = await this.findByIdOrEmail(volunteerId);
    return (this.prisma as any).volunteer.update({
      where: { id: vol.id },
      data: { bankDetails: JSON.stringify(bankData) },
    });
  }

  /** Process a withdrawal request */
  async requestWithdrawal(volunteerId: string) {
    const vol = await this.findByIdOrEmail(volunteerId);
    const volAny = vol as any;

    const totalCoins = vol.totalCoins;
    const withdrawnThreshold = volAny.withdrawnThreshold || 0;
    const availableGap = totalCoins - withdrawnThreshold;

    if (availableGap < 100000) {
      throw new BadRequestException(`Insufficient milestone gap. You need at least 1,00,000 unwithdrawn coins. Gap is only ${availableGap}.`);
    }

    if (!volAny.bankDetails) {
      throw new BadRequestException('Please update your bank details before requesting a withdrawal.');
    }

    const amountInr = availableGap / 10;

    return this.prisma.$transaction(async (tx) => {
      // 1. Create Request
      const request = await (tx as any).withdrawalRequest.create({
        data: {
          volunteerId: vol.id,
          amountCoins: availableGap,
          amountInr: amountInr,
          status: 'PENDING',
          bankDetailsSnapshot: volAny.bankDetails,
        },
      });

      // 2. Update Threshold
      await (tx as any).volunteer.update({
        where: { id: vol.id },
        data: { withdrawnThreshold: withdrawnThreshold + availableGap },
      });

      return request;
    });
  }
}

