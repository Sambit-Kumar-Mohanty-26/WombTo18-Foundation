import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class DonorService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(donorId: string) {
    const donor = await this.prisma.donor.findUnique({
      where: { donorId },
      include: { donations: { where: { status: 'SUCCESS' } } },
    });

    if (!donor) throw new NotFoundException('Donor not found');

    const impact = await this.prisma.impactMetrics.findUnique({
      where: { id: 'global' },
    }) || {
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
      },
      impact,
    };
  }

  async getDonations(donorId: string) {
    const donor = await this.prisma.donor.findUnique({
      where: { donorId },
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
}
