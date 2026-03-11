import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Transparency & Reports')
@Controller('')
export class TransparencyController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('transparency')
  @ApiOperation({ summary: 'Get global transparency metrics' })
  async getTransparency() {
    const metrics = await this.prisma.impactMetrics.findUnique({
      where: { id: 'global' },
    }) || {
      totalRaised: 1000000,
      totalUtilized: 700000,
      programs: [],
      expenses: [],
    };
    return metrics;
  }

  @Get('reports/:donationId')
  @ApiOperation({ summary: 'Get progress reports for a specific donation' })
  async getReports(@Param('donationId') donationId: string) {
    // Simulated reports
    return [
      {
        reportNumber: 1,
        title: 'Week 1 Update',
        description: 'Health camp completed',
        metrics: { childrenServed: 50 },
      },
    ];
  }
}
