import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class DonorService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(identifier: string) {
    const donor = await this.prisma.donor.findFirst({
      where: {
        OR: [{ email: identifier }, { donorId: identifier }],
      },
      include: {
        donations: { where: { status: 'SUCCESS' } },
        volunteer: { select: { volunteerId: true, totalCoins: true } },
      },
    });

    if (!donor) throw new NotFoundException('Donor not found');

    const impact = (await this.prisma.impactMetrics.findUnique({
      where: { id: 'global' },
    })) || {
      childrenImpacted: 150,
      schoolsReached: 12,
      healthCheckups: 89,
      programsSupported: 3,
    };

    const totalDonated = donor.totalDonated;
    const tier = donor.tier;
    const volunteerCoins = donor.volunteer?.totalCoins || 0;
    const impactScore = Math.floor(totalDonated / 100) + (tier === 'CHAMPION' ? 1000 : tier === 'PATRON' ? 250 : 0) + volunteerCoins;

    const rank = await this.prisma.donor.count({
      where: { totalDonated: { gt: totalDonated } },
    }) + 1;

    return {
      donor: {
        id: donor.id,
        name: donor.name || 'Anonymous Donor',
        donorId: donor.donorId,
        email: donor.email,
        tier: donor.tier,
        totalDonated: donor.totalDonated,
        impactScore,
        leaderboardRank: rank,
        isVolunteer: donor.isVolunteer,
        showOnLeaderboard: donor.showOnLeaderboard,
        volunteerId: donor.volunteer?.volunteerId || null,
        volunteerCoins: donor.volunteer?.totalCoins || 0,
        mobile: donor.mobile,
        createdAt: donor.createdAt,
      },
      impact,
    };
  }

  async getDonations(identifier: string) {
    const donor = await this.prisma.donor.findFirst({
      where: {
        OR: [{ email: identifier }, { donorId: identifier }],
      },
    });
    if (!donor) throw new NotFoundException('Donor not found');

    const donations = await this.prisma.donation.findMany({
      where: { donorId: donor.id, status: 'SUCCESS' },
      include: { program: true },
      orderBy: { createdAt: 'desc' },
    });

    return donations.map((d) => ({
      id: d.id,
      amount: d.amount,
      program: d.program.name,
      date: d.createdAt.toISOString().split('T')[0],
      status: d.status,
      receiptNumber: d.receiptNumber,
    }));
  }

  async getLeaderboard(options: { page: number; limit: number; timeframe: string }) {
    const { page, limit, timeframe } = options;
    const skip = (page - 1) * limit;

    let startDate: Date | null = null;
    const now = new Date();

    if (timeframe === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeframe === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else if (timeframe === 'recent') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    }

    if (startDate) {
      // Filtered leaderboard: aggregate donations within timeframe
      const aggregations = await this.prisma.donation.groupBy({
        by: ['donorId'],
        _sum: { amount: true },
        where: {
          status: 'SUCCESS',
          createdAt: { gte: startDate },
        },
        orderBy: {
          _sum: { amount: 'desc' },
        },
        take: limit,
        skip: skip,
      });

      const donorIds = aggregations.map(a => a.donorId);
      const donors = await this.prisma.donor.findMany({
        where: { id: { in: donorIds }, showOnLeaderboard: true },
        select: {
          id: true,
          name: true,
          donorId: true,
          tier: true,
        },
      });

      // Map back to maintain order and include aggregated amount
      const result = aggregations.map((a, index) => {
        const donor = donors.find(d => d.id === a.donorId);
        return {
          rank: skip + index + 1,
          name: donor?.name || 'Anonymous Donor',
          donorId: donor?.donorId || 'N/A',
          totalDonated: a._sum.amount || 0,
          tier: donor?.tier || 'DONOR',
        };
      }).filter(r => r.donorId !== 'N/A');

      const totalCount = await this.prisma.donation.groupBy({
        by: ['donorId'],
        where: {
          status: 'SUCCESS',
          createdAt: { gte: startDate },
        },
      });

      return {
        data: result,
        meta: {
          total: totalCount.length,
          page,
          limit,
          totalPages: Math.ceil(totalCount.length / limit),
        },
      };
    } else {
      // All-time leaderboard (default)
      const donors = await this.prisma.donor.findMany({
        where: { totalDonated: { gt: 0 }, showOnLeaderboard: true },
        orderBy: { totalDonated: 'desc' },
        take: limit,
        skip: skip,
        select: {
          name: true,
          donorId: true,
          totalDonated: true,
          tier: true,
        },
      });

      const totalCount = await this.prisma.donor.count({
        where: { totalDonated: { gt: 0 }, showOnLeaderboard: true },
      });

      return {
        data: donors.map((d, index) => ({
          rank: skip + index + 1,
          ...d,
        })),
        meta: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }
  }

  async getRecruits(donorId: string) {
    return this.prisma.donor.findMany({
      where: { referredById: donorId } as any,
      select: {
        name: true,
        donorId: true,
        email: true,
        totalDonated: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleLeaderboard(donorId: string, show: boolean) {
    const donor = await this.prisma.donor.findUnique({ where: { donorId } });
    if (!donor) throw new NotFoundException('Donor not found');
    return this.prisma.donor.update({
      where: { id: donor.id },
      data: { showOnLeaderboard: show },
    });
  }

  async becomeVolunteer(donorId: string) {
    const donor = await this.prisma.donor.findFirst({
      where: {
        OR: [
          { donorId },
          { id: donorId },
          { email: donorId },
        ],
      },
    });
    if (!donor) throw new NotFoundException('Donor not found');

    await this.prisma.donor.update({
      where: { id: donor.id },
      data: { isVolunteer: true } as any,
    });

    const volunteer = await this.prisma.volunteer.findFirst({
      where: { donorId: donor.id },
      select: { volunteerId: true, city: true, profession: true },
    });

    return {
      success: true,
      donorId: donor.donorId,
      role: 'VOLUNTEER',
      profileCompleted: !!(volunteer?.city && volunteer?.profession),
      volunteerId: volunteer?.volunteerId || null,
      redirect: '/volunteer-onboarding',
    };
  }

  async getProfile(identifier: string) {
    const donor = await this.prisma.donor.findFirst({
      where: { OR: [{ email: identifier }, { donorId: identifier }] },
      include: {
        volunteer: { select: { volunteerId: true, totalCoins: true, showOnLeaderboard: true } },
        donations: {
          where: { status: 'SUCCESS' },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { program: { select: { name: true } } },
        },
      },
    });
    if (!donor) throw new NotFoundException('Donor not found');

    const totalDonated = donor.totalDonated;
    const tier = donor.tier;
    const volunteerCoins = donor.volunteer?.totalCoins || 0;
    const impactScore = Math.floor(totalDonated / 100) + (tier === 'CHAMPION' ? 1000 : tier === 'PATRON' ? 250 : 0) + volunteerCoins;

    return {
      id: donor.id,
      donorId: donor.donorId,
      name: donor.name,
      email: donor.email,
      mobile: donor.mobile,
      pan: donor.pan,
      address: donor.address,
      tier: donor.tier,
      totalDonated: donor.totalDonated,
      impactScore,
      isVolunteer: donor.isVolunteer,
      showOnLeaderboard: donor.showOnLeaderboard,
      volunteerId: donor.volunteer?.volunteerId || null,
      recentDonations: donor.donations.map(d => ({
        id: d.id,
        amount: d.amount,
        program: d.program.name,
        date: d.createdAt.toISOString().split('T')[0],
      })),
      createdAt: donor.createdAt,
    };
  }

  /** Look up donor by email — used for guest donation → dashboard flow */
  async lookupByEmail(email: string) {
    if (!email) throw new NotFoundException('Email is required');
    
    const donor = await this.prisma.donor.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: {
        donations: {
          where: { status: 'SUCCESS' },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        certificates: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!donor) throw new NotFoundException('No donations found for this email');

    const totalDonated = donor.totalDonated;
    const tier = donor.tier;
    const impactScore = Math.floor(totalDonated / 100) + (tier === 'CHAMPION' ? 1000 : tier === 'PATRON' ? 250 : 0);

    return {
      donorId: donor.donorId,
      name: donor.name,
      email: donor.email,
      tier: donor.tier,
      totalDonated: donor.totalDonated,
      impactScore,
      isEligible: donor.isEligible,
      emailVerified: donor.emailVerified,
      mobileVerified: donor.mobileVerified,
      donationCount: donor.donations.length,
      certificateCount: donor.certificates.length,
      donations: donor.donations.map(d => ({
        id: d.id,
        amount: d.amount,
        date: d.createdAt.toISOString().split('T')[0],
        receiptNumber: d.receiptNumber,
      })),
      certificates: donor.certificates.map(c => ({
        id: c.id,
        type: c.type,
        title: c.title,
        fileUrl: c.fileUrl,
        createdAt: c.createdAt,
      })),
    };
  }
}
