import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllDonors() {
    return this.prisma.donor.findMany({
      include: { donations: true },
    });
  }

  async findAllPrograms() {
    return this.prisma.program.findMany();
  }

  async createProgram(data: any) {
    return this.prisma.program.create({
      data: {
        name: data.name,
        description: data.description,
        targetAmount: data.targetAmount,
      },
    });
  }

  async getStats() {
    const [totalDonations, donorCount, programCount, recentDonations] = await Promise.all([
      this.prisma.donation.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
      }),
      this.prisma.donor.count(),
      this.prisma.program.count(),
      this.prisma.donation.findMany({
        where: { status: 'SUCCESS' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { donor: true, program: true },
      }),
    ]);

    return {
      totalDonations: totalDonations._sum.amount || 0,
      totalDonors: donorCount,
      totalPrograms: programCount,
      recentDonations: recentDonations,
    };
  }
}
