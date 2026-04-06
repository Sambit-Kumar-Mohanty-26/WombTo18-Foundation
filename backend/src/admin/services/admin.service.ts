import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllDonors() {
    const donors = await this.prisma.donor.findMany({
      include: { 
        donations: {
          where: { status: 'SUCCESS' },
          orderBy: { createdAt: 'desc' }
        } 
      },
    });

    return donors.map(donor => {
      const totalAmount = donor.donations.reduce((sum, d) => sum + d.amount, 0);
      const lastDonation = donor.donations[0]?.createdAt;
      
      return {
        id: donor.id,
        name: donor.name || donor.email.split('@')[0],
        email: donor.email,
        totalAmount: totalAmount.toLocaleString(),
        category: donor.tier || 'DONOR',
        lastDonation: lastDonation ? this.timeAgo(lastDonation) : 'No donations'
      };
    });
  }

  private timeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
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

  async getStats(range: string = '30D') {
    const startDate = this.getStartDate(range);

    const [totalDonationsSum, donorCount, programCount, recentDonations, historicalDonations] = await Promise.all([
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
      this.prisma.donation.findMany({
        where: { 
          status: 'SUCCESS',
          createdAt: { gte: startDate }
        },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    const chartData = this.aggregateChartData(historicalDonations, range);
    const mappingStats = await this.getMappingStats();

    return {
      totalDonations: totalDonationsSum._sum.amount || 0,
      totalDonors: donorCount,
      totalPrograms: programCount,
      recentDonations: recentDonations,
      chartData: chartData,
      mappingStats: mappingStats
    };
  }

  private getStartDate(range: string): Date {
    const now = new Date();
    if (range === '7D') return new Date(now.setDate(now.getDate() - 7));
    if (range === '1Y') return new Date(now.setFullYear(now.getFullYear() - 1));
    return new Date(now.setDate(now.getDate() - 30));
  }

  private aggregateChartData(donations: any[], range: string) {
    const data: any[] = [];
    const now = new Date();

    if (range === '1Y') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthLabel = d.toLocaleString('default', { month: 'short' });
        const amount = donations
          .filter(don => {
            const donDate = new Date(don.createdAt);
            return donDate.getMonth() === d.getMonth() && donDate.getFullYear() === d.getFullYear();
          })
          .reduce((sum, don) => sum + don.amount, 0);
        data.push({ month: monthLabel, amount });
      }
    } else {
      const days = range === '7D' ? 7 : 30;
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateLabel = d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
        const amount = donations
          .filter(don => {
            const donDate = new Date(don.createdAt);
            return donDate.toDateString() === d.toDateString();
          })
          .reduce((sum, don) => sum + don.amount, 0);
        data.push({ month: dateLabel, amount });
      }
    }
    return data;
  }

  private async getMappingStats() {
    // Treat donors with more than 1 successful donation as 'recurring' for the UI stats
    const donorDonationCounts = await this.prisma.donation.groupBy({
      by: ['donorId'],
      where: { status: 'SUCCESS' },
      _count: { id: true },
    });

    const recurring = donorDonationCounts.filter(d => d._count.id > 1).length;
    const oneTime = donorDonationCounts.length - recurring;

    return {
      oneTime,
      recurring
    };
  }

  async findAllDonations(filters: { startDate?: string, endDate?: string, programId?: string, donorSearch?: string, status?: string }) {
    const where: any = {};

    if (filters.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }

    if (filters.programId) {
      where.programId = filters.programId;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    if (filters.donorSearch) {
      where.OR = [
        { donor: { name: { contains: filters.donorSearch, mode: 'insensitive' } } },
        { donor: { email: { contains: filters.donorSearch, mode: 'insensitive' } } }
      ];
    }

    return this.prisma.donation.findMany({
      where,
      include: { donor: true, program: true },
      orderBy: { createdAt: 'desc' },
      take: 200, // Safety limit for ledger
    });
  }
}
