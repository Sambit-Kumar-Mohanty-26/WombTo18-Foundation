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
    if (volunteer.hasClaimedLoginCoin) {
      return { alreadyClaimed: true, totalCoins: volunteer.totalCoins };
    }

    const config = await this.getConfig();

    await this.prisma.$transaction([
      this.prisma.coinTransaction.create({
        data: {
          volunteerId: volunteer.id,
          amount: config.firstLogin,
          type: 'FIRST_LOGIN',
          description: `Welcome bonus: ${config.firstLogin} coins for your first login`,
        },
      }),
      this.prisma.volunteer.update({
        where: { id: volunteer.id },
        data: {
          totalCoins: { increment: config.firstLogin },
          hasClaimedLoginCoin: true,
        },
      }),
    ]);

    return {
      awarded: config.firstLogin,
      totalCoins: volunteer.totalCoins + config.firstLogin,
      type: 'FIRST_LOGIN',
    };
  }

  /** Award referral coins based on payment amount */
  async awardReferralCoins(volunteerId: string, referralId: string, paymentAmount: number) {
    const volunteer = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId }, { id: volunteerId }] },
    });
    if (!volunteer) throw new NotFoundException('Volunteer not found');

    const config = await this.getConfig();
    const tiers: CoinTier[] = JSON.parse(config.referralTiers);

    // Find matching tier
    const tier = tiers.find(t => paymentAmount >= t.min && paymentAmount <= t.max);
    const coins = tier ? tier.coins : tiers[tiers.length - 1].coins; // Default to highest tier

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

  /** Award active participation coins (admin-verified via QR scan) */
  async awardCampActiveCoins(volunteerId: string, campId: string) {
    const volunteer = await this.prisma.volunteer.findFirst({
      where: { OR: [{ volunteerId }, { id: volunteerId }] },
    });
    if (!volunteer) throw new NotFoundException('Volunteer not found');

    const config = await this.getConfig();

    // Check existing participation
    const existing = await this.prisma.campParticipation.findUnique({
      where: { campId_volunteerId: { campId, volunteerId: volunteer.id } },
    });

    if (existing && existing.participationType === 'ACTIVE') {
      throw new BadRequestException('Already verified as active participant');
    }

    const additionalCoins = existing
      ? config.campActive - existing.coinsAwarded // Upgrade: give difference
      : config.campActive; // Fresh entry

    const txns: any[] = [
      this.prisma.coinTransaction.create({
        data: {
          volunteerId: volunteer.id,
          amount: additionalCoins,
          type: 'CAMP_ACTIVE',
          description: `Active participation bonus: ${additionalCoins} additional coins`,
          metadata: JSON.stringify({ campId }),
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
          data: { participationType: 'ACTIVE', coinsAwarded: config.campActive },
        }),
      );
    } else {
      txns.push(
        this.prisma.campParticipation.create({
          data: {
            campId,
            volunteerId: volunteer.id,
            participationType: 'ACTIVE',
            coinsAwarded: config.campActive,
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
