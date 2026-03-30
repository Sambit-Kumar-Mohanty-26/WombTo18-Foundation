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
      include: { donations: { where: { status: 'SUCCESS' } } },
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
        name: donor.name || 'Anonymous Donor',
        donorId: donor.donorId,
        tier: donor.tier,
        totalDonated: donor.totalDonated,
        isVolunteer: (donor as any).isVolunteer || false,
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
      amount: d.amount,
      program: d.program.name,
      date: d.createdAt.toISOString().split('T')[0],
      status: d.status,
    }));
  }

  async getLeaderboard() {
    return this.prisma.donor.findMany({
      where: { totalDonated: { gt: 0 } },
      orderBy: { totalDonated: 'desc' },
      take: 10,
      select: {
        name: true,
        donorId: true,
        totalDonated: true,
        tier: true,
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
}

