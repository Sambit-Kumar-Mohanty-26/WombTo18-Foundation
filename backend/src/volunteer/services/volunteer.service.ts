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

  /** Find volunteer by volunteerId or email */
  private async findByIdOrEmail(identifier: string) {
    const vol = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId: identifier }, { email: identifier }] },
    });
    if (!vol) throw new NotFoundException('Volunteer not found');
    return vol;
  }
}
