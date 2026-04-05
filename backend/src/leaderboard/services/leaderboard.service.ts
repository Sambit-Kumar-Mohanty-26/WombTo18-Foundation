import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  /** Global donor leaderboard ranked by total donations */
  async getDonorLeaderboard(limit = 50) {
    const donors = await this.prisma.donor.findMany({
      where: { totalDonated: { gt: 0 } },
      orderBy: { totalDonated: 'desc' },
      take: limit,
      select: {
        donorId: true,
        name: true,
        totalDonated: true,
        tier: true,
        showOnLeaderboard: true,
        isVolunteer: true,
      },
    });

    return donors.map((d, i) => ({
      rank: i + 1,
      donorId: d.donorId,
      name: d.showOnLeaderboard ? (d.name || 'Anonymous Donor') : 'Anonymous Donor',
      totalDonated: d.totalDonated,
      tier: d.tier,
      isVolunteer: d.isVolunteer,
    }));
  }

  /** Volunteer leaderboard ranked by coins */
  async getVolunteerLeaderboard(limit = 50) {
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
        campParticipations: { select: { id: true } },
        referrals: { select: { id: true } },
      },
    });

    return volunteers.map((v, i) => ({
      rank: i + 1,
      volunteerId: v.volunteerId,
      name: v.showOnLeaderboard ? v.name : 'Anonymous Volunteer',
      totalCoins: v.totalCoins,
      city: v.showOnLeaderboard ? v.city : null,
      campsAttended: v.campParticipations.length,
      referralsCount: v.referrals.length,
    }));
  }
  async getPartnerLeaderboard(limit = 50) {
    const partners = await this.prisma.partner.findMany({
      where: { isActive: true },
      include: {
        referrals: {
          where: { status: 'DONATED' },
          select: { paymentAmount: true }
        }
      },
      take: limit,
    });

    const ranked = partners.map(p => {
      const referralDonations = p.referrals.reduce((sum, r) => sum + (r.paymentAmount || 0), 0);
      const totalImpact = (p.totalSponsored || 0) + referralDonations;
      
      // Masking logic: Global CSR Corp -> Glo***orp
      const name = p.organizationName;
      let maskedName = name;
      if (name.length > 5) {
        maskedName = name.slice(0, 3) + '***' + name.slice(-3);
      } else if (name.length > 2) {
         maskedName = name.slice(0, 1) + '***' + name.slice(-1);
      }

      return {
        partnerId: p.partnerId,
        name: maskedName,
        totalImpact,
        livesImpacted: Math.floor(totalImpact / 500), // Calculation logic for Lives Impacted
        category: p.csrCategory || 'Partner',
      };
    });

    return ranked
      .filter(r => r.totalImpact > 0)
      .sort((a, b) => b.totalImpact - a.totalImpact)
      .map((r, i) => ({ ...r, rank: i + 1 }));
  }

  /** Get a specific donor's rank */
  async getDonorRank(donorId: string) {
    const donor = await this.prisma.donor.findFirst({
      where: { OR: [{ donorId }, { email: donorId }] },
    });
    if (!donor) return { rank: null };

    const rank = await this.prisma.donor.count({
      where: { totalDonated: { gt: donor.totalDonated } },
    });
    return { rank: rank + 1, totalDonated: donor.totalDonated };
  }

  /** Get a specific volunteer's rank */
  async getVolunteerRank(volunteerId: string) {
    const vol = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId }, { email: volunteerId }] },
    });
    if (!vol) return { rank: null };

    const rank = await this.prisma.volunteer.count({
      where: { totalCoins: { gt: vol.totalCoins }, isActive: true },
    });
    return { rank: rank + 1, totalCoins: vol.totalCoins };
  }
}
