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

    return {
      donor: {
        id: donor.id,
        name: donor.name || 'Anonymous Donor',
        donorId: donor.donorId,
        email: donor.email,
        tier: donor.tier,
        totalDonated: donor.totalDonated,
        isVolunteer: donor.isVolunteer,
        showOnLeaderboard: donor.showOnLeaderboard,
        volunteerId: donor.volunteer?.volunteerId || null,
        volunteerCoins: donor.volunteer?.totalCoins || 0,
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

  async getLeaderboard() {
    return this.prisma.donor.findMany({
      where: { totalDonated: { gt: 0 } },
      orderBy: { totalDonated: 'desc' },
      take: 50,
      select: {
        name: true,
        donorId: true,
        totalDonated: true,
        tier: true,
        showOnLeaderboard: true,
      },
    });
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
    const donor = await this.prisma.donor.findUnique({
      where: { donorId },
    });
    if (!donor) throw new NotFoundException('Donor not found');

    return this.prisma.donor.update({
      where: { id: donor.id },
      data: { isVolunteer: true } as any,
    });
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

    return {
      donorId: donor.donorId,
      name: donor.name,
      email: donor.email,
      tier: donor.tier,
      totalDonated: donor.totalDonated,
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
