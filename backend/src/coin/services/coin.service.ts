import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

interface CoinTier {
  min: number;
  max: number;
  coins: number;
}

@Injectable()
export class CoinService {
  constructor(private readonly prisma: PrismaService) {}

  /** Get or create coin config */
  private async getConfig() {
    let config = await this.prisma.coinConfig.findUnique({ where: { id: 'global' } });
    if (!config) {
      config = await this.prisma.coinConfig.create({
        data: { id: 'global' },
      });
    }
    return config;
  }

  /** Get admin-configurable coin config */
  async getCoinConfig() {
    return this.getConfig();
  }

  /** Update coin config (admin only) */
  async updateCoinConfig(data: {
    firstLogin?: number;
    campJoin?: number;
    campActive?: number;
    referralTiers?: CoinTier[];
  }) {
    return this.prisma.coinConfig.update({
      where: { id: 'global' },
      data: {
        ...(data.firstLogin !== undefined && { firstLogin: data.firstLogin }),
        ...(data.campJoin !== undefined && { campJoin: data.campJoin }),
        ...(data.campActive !== undefined && { campActive: data.campActive }),
        ...(data.referralTiers && { referralTiers: JSON.stringify(data.referralTiers) }),
      },
    });
  }

  /** Award one-time first-login coins */
  async awardFirstLoginCoins(volunteerId: string) {
    const volunteer = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId }, { email: volunteerId }] },
    });
    if (!volunteer) throw new NotFoundException('Volunteer not found');
    
    // First login bonus has been retired
    return { alreadyClaimed: true, totalCoins: volunteer.totalCoins };
  }

  /** Award referral coins based on payment amount (1:1 ratio) */
  async awardReferralCoins(volunteerId: string, referralId: string, paymentAmount: number) {
    const volunteer = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId }, { id: volunteerId }] },
    });
    if (!volunteer) throw new NotFoundException('Volunteer not found');

    const coins = Math.floor(paymentAmount); // 1:1 ratio

    await this.prisma.$transaction([
      this.prisma.coinTransaction.create({
        data: {
          volunteerId: volunteer.id,
          amount: coins,
          type: 'REFERRAL',
          description: `Referral bonus: ${coins} coins for ₹${paymentAmount} donation by referral`,
          metadata: JSON.stringify({ referralId, paymentAmount }),
        },
      }),
      this.prisma.volunteer.update({
        where: { id: volunteer.id },
        data: { totalCoins: { increment: coins } },
      }),
      this.prisma.referral.update({
        where: { id: referralId },
        data: { coinsAwarded: coins },
      }),
    ]);

    return { awarded: coins, paymentAmount, totalCoins: volunteer.totalCoins + coins };
  }

  /** Award coins to a volunteer for their own donation (1:1 ratio) */
  async awardSelfDonationCoins(volunteerId: string, donationId: string, paymentAmount: number) {
    const volunteer = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId }, { id: volunteerId }, { email: volunteerId }] },
    });
    if (!volunteer) return null; // Not all donors are volunteers

    const coins = Math.floor(paymentAmount); // 1:1 ratio

    // Check if already awarded for this donation (idempotency)
    const existing = await this.prisma.coinTransaction.findFirst({
      where: {
        volunteerId: volunteer.id,
        type: 'DONATION',
        metadata: { contains: donationId },
      },
    });
    if (existing) return { alreadyAwarded: true, totalCoins: volunteer.totalCoins };

    await this.prisma.$transaction([
      this.prisma.coinTransaction.create({
        data: {
          volunteerId: volunteer.id,
          amount: coins,
          type: 'DONATION',
          description: `Donation reward: ${coins} coins for ₹${paymentAmount} contribution`,
          metadata: JSON.stringify({ donationId, paymentAmount }),
        },
      }),
      this.prisma.volunteer.update({
        where: { id: volunteer.id },
        data: { totalCoins: { increment: coins } },
      }),
    ]);

    return { awarded: coins, paymentAmount, totalCoins: volunteer.totalCoins + coins };
  }

  /** Award welcome bonus for volunteer onboarding */
  async awardWelcomeBonus(volunteerEmail: string, donationId: string, paymentAmount: number) {
    const volunteer = await this.prisma.volunteer.findUnique({
      where: { email: volunteerEmail },
    });
    if (!volunteer) return null;

    const coins = Math.floor(paymentAmount);

    // Check idempotency
    const existing = await this.prisma.coinTransaction.findFirst({
      where: {
        volunteerId: volunteer.id,
        type: 'WELCOME_BONUS',
      },
    });
    if (existing) return { alreadyAwarded: true, totalCoins: volunteer.totalCoins };

    await this.prisma.$transaction([
      this.prisma.coinTransaction.create({
        data: {
          volunteerId: volunteer.id,
          amount: coins,
          type: 'WELCOME_BONUS',
          description: `Welcome bonus: ${coins} coins for ₹${paymentAmount} membership payment`,
          metadata: JSON.stringify({ donationId, paymentAmount }),
        },
      }),
      this.prisma.volunteer.update({
        where: { id: volunteer.id },
        data: { totalCoins: { increment: coins } },
      }),
    ]);

    return { awarded: coins, totalCoins: volunteer.totalCoins + coins };
  }

  /** Award camp join coins (normal participation via QR scan) */
  async awardCampJoinCoins(volunteerId: string, campId: string) {
    const volunteer = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId }, { id: volunteerId }] },
    });
    if (!volunteer) throw new NotFoundException('Volunteer not found');

    // Check if already participated
    const existing = await this.prisma.campParticipation.findUnique({
      where: { campId_volunteerId: { campId, volunteerId: volunteer.id } },
    });
    if (existing) throw new BadRequestException('Already registered for this camp');

    const config = await this.getConfig();

    const [participation] = await this.prisma.$transaction([
      this.prisma.campParticipation.create({
        data: {
          campId,
          volunteerId: volunteer.id,
          participationType: 'NORMAL',
          coinsAwarded: config.campJoin,
        },
      }),
      this.prisma.coinTransaction.create({
        data: {
          volunteerId: volunteer.id,
          amount: config.campJoin,
          type: 'CAMP_JOIN',
          description: `Camp participation: ${config.campJoin} coins for joining`,
          metadata: JSON.stringify({ campId }),
        },
      }),
      this.prisma.volunteer.update({
        where: { id: volunteer.id },
        data: { totalCoins: { increment: config.campJoin } },
      }),
    ]);

    return { awarded: config.campJoin, participation };
  }

  /** Award active participation coins — dynamic pool or fixed fallback */
  async awardCampActiveCoins(volunteerId: string, campId: string) {
    const volunteer = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId }, { id: volunteerId }] },
    });
    if (!volunteer) throw new NotFoundException('Volunteer not found');

    // Fetch camp to check for dynamic pool
    const camp = await this.prisma.camp.findUnique({
      where: { id: campId },
      select: {
        totalCoinPool: true,
        _count: {
          select: { participations: true },
        },
      },
    });
    if (!camp) throw new NotFoundException('Camp not found');

    let coinsToAward: number;
    let description: string;

    if (camp.totalCoinPool > 0) {
      // Dynamic pool: divide by JOINING count
      const joiningCount = await this.prisma.campParticipation.count({
        where: {
          campId,
          volunteerResponse: 'JOINING',
          status: { in: ['APPROVED', 'ATTENDED'] },
        },
      });

      // Fallback to approved count if no one RSVP'd JOINING
      const approvedCount = joiningCount > 0 ? joiningCount : await this.prisma.campParticipation.count({
        where: {
          campId,
          status: { in: ['APPROVED', 'ATTENDED'] },
        },
      });

      const divisor = approvedCount > 0 ? approvedCount : 1;
      coinsToAward = Math.floor(camp.totalCoinPool / divisor);
      description = `Camp reward: ${coinsToAward} coins (pool of ${camp.totalCoinPool} ÷ ${divisor} volunteers)`;
    } else {
      // Fixed fallback from global config
      const config = await this.getConfig();
      coinsToAward = config.campActive;
      description = `Active participation bonus: ${coinsToAward} coins`;
    }

    // Check existing participation
    const existing = await this.prisma.campParticipation.findUnique({
      where: { campId_volunteerId: { campId, volunteerId: volunteer.id } },
    });

    if (existing && existing.participationType === 'ACTIVE') {
      throw new BadRequestException('Already verified as active participant');
    }

    const additionalCoins = existing
      ? coinsToAward - existing.coinsAwarded
      : coinsToAward;

    const txns: any[] = [
      this.prisma.coinTransaction.create({
        data: {
          volunteerId: volunteer.id,
          amount: additionalCoins,
          type: 'CAMP_ACTIVE',
          description,
          metadata: JSON.stringify({ campId, pool: camp.totalCoinPool }),
        },
      }),
      this.prisma.volunteer.update({
        where: { id: volunteer.id },
        data: { totalCoins: { increment: additionalCoins } },
      }),
    ];

    if (existing) {
      txns.push(
        this.prisma.campParticipation.update({
          where: { id: existing.id },
          data: { participationType: 'ACTIVE', coinsAwarded: coinsToAward },
        }),
      );
    } else {
      txns.push(
        this.prisma.campParticipation.create({
          data: {
            campId,
            volunteerId: volunteer.id,
            participationType: 'ACTIVE',
            coinsAwarded: coinsToAward,
          },
        }),
      );
    }

    await this.prisma.$transaction(txns);
    return { awarded: additionalCoins, totalCoins: volunteer.totalCoins + additionalCoins };
  }

  /** Get coin balance and breakdown */
  async getBalance(volunteerId: string) {
    const volunteer = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId }, { email: volunteerId }] },
    });
    if (!volunteer) throw new NotFoundException('Volunteer not found');

    // Get breakdown by type
    const transactions = await this.prisma.coinTransaction.groupBy({
      by: ['type'],
      where: { volunteerId: volunteer.id },
      _sum: { amount: true },
      _count: true,
    });

    return {
      totalCoins: volunteer.totalCoins,
      breakdown: transactions.map(t => ({
        type: t.type,
        totalEarned: t._sum.amount || 0,
        count: t._count,
      })),
    };
  }
}
