import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { CoinService } from '../../coin/services/coin.service';

@Injectable()
export class ReferralService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly coinService: CoinService,
  ) {}

  /** Create a referral when someone uses a referral link/QR */
  async createReferral(data: {
    referrerType: 'VOLUNTEER' | 'PARTNER';
    referrerId: string; // volunteerId or partnerId
    referredEmail: string;
    referredName?: string;
    referredPhone?: string;
  }) {
    let volunteerId: string | null = null;
    let partnerId: string | null = null;

    if (data.referrerType === 'VOLUNTEER') {
      const vol = await this.prisma.volunteer.findFirst({
        where: { OR: [{ volunteerId: data.referrerId }, { id: data.referrerId }] },
      });
      if (!vol) throw new NotFoundException('Volunteer referrer not found');
      volunteerId = vol.id;
    } else {
      const partner = await this.prisma.partner.findFirst({
        where: { OR: [{ partnerId: data.referrerId }, { id: data.referrerId }] },
      });
      if (!partner) throw new NotFoundException('Partner referrer not found');
      partnerId = partner.id;
    }

    return this.prisma.referral.create({
      data: {
        referrerType: data.referrerType,
        volunteerId,
        partnerId,
        referredEmail: data.referredEmail,
        referredName: data.referredName,
        referredPhone: data.referredPhone,
        status: 'JOINED',
      },
    });
  }

  /** Process a payment from a referred person - award coins to referrer */
  async processReferralPayment(referralId: string, paymentAmount: number, joinedDonorId?: string) {
    const referral = await this.prisma.referral.findUnique({ where: { id: referralId } });
    if (!referral) throw new NotFoundException('Referral not found');

    // Update referral with payment info
    await this.prisma.referral.update({
      where: { id: referralId },
      data: {
        paymentAmount,
        status: 'DONATED',
        joinedDonorId: joinedDonorId || null,
      },
    });

    // Award coins to volunteer referrer (partners don't get coins)
    if (referral.referrerType === 'VOLUNTEER' && referral.volunteerId) {
      return this.coinService.awardReferralCoins(referral.volunteerId, referralId, paymentAmount);
    }

    return { success: true, paymentAmount };
  }

  /** Find referral by referred email (used during registration) */
  async findByReferredEmail(email: string) {
    return this.prisma.referral.findFirst({
      where: { referredEmail: email, status: { in: ['PENDING', 'JOINED'] } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Get referral stats for a referrer */
  async getStats(referrerType: 'VOLUNTEER' | 'PARTNER', referrerId: string) {
    const where: any = { referrerType };
    if (referrerType === 'VOLUNTEER') {
      const vol = await this.prisma.volunteer.findFirst({
        where: { OR: [{ volunteerId: referrerId }, { id: referrerId }] },
      });
      if (!vol) throw new NotFoundException('Volunteer not found');
      where.volunteerId = vol.id;
    } else {
      const partner = await this.prisma.partner.findFirst({
        where: { OR: [{ partnerId: referrerId }, { id: referrerId }] },
      });
      if (!partner) throw new NotFoundException('Partner not found');
      where.partnerId = partner.id;
    }

    const total = await this.prisma.referral.count({ where });
    const donated = await this.prisma.referral.count({ where: { ...where, status: 'DONATED' } });
    const totalAmount = await this.prisma.referral.aggregate({
      where: { ...where, status: 'DONATED' },
      _sum: { paymentAmount: true },
    });

    return {
      totalReferrals: total,
      donatedReferrals: donated,
      totalReferralAmount: totalAmount._sum.paymentAmount || 0,
    };
  }
}
