import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}

  /** Admin creates a partner account */
  async createPartner(data: {
    organizationName: string;
    contactPerson: string;
    email: string;
    mobile?: string;
    password: string;
    panNumber?: string;
    csrCategory?: string;
  }) {
    const existing = await this.prisma.partner.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Partner with this email already exists');

    const lastPartner = await this.prisma.partner.findFirst({ orderBy: { createdAt: 'desc' } });
    const nextId = lastPartner ? parseInt(lastPartner.partnerId.replace('PTR', '')) + 1 : 1001;

    const hashedPassword = await bcrypt.hash(data.password, 12);

    return this.prisma.partner.create({
      data: {
        partnerId: `PTR${nextId}`,
        organizationName: data.organizationName,
        contactPerson: data.contactPerson,
        email: data.email,
        mobile: data.mobile,
        password: hashedPassword,
        panNumber: data.panNumber,
        csrCategory: data.csrCategory,
      },
    });
  }

  /** Partner login */
  async login(email: string, password: string) {
    const partner = await this.prisma.partner.findUnique({ where: { email } });
    if (!partner) throw new NotFoundException('No partner account found with this email');

    const valid = await bcrypt.compare(password, partner.password);
    if (!valid) throw new BadRequestException('Invalid credentials');

    return {
      success: true,
      partnerId: partner.partnerId,
      name: partner.contactPerson,
      organizationName: partner.organizationName,
      role: 'PARTNER',
    };
  }

  /** Get partner dashboard */
  async getDashboard(partnerId: string) {
    const partner = await this.prisma.partner.findFirst({
      where: { OR: [{ partnerId }, { email: partnerId }] },
      include: {
        referrals: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    const totalReferrals = await this.prisma.referral.count({
      where: { partnerId: partner.id },
    });
    const referralDonations = await this.prisma.referral.aggregate({
      where: { partnerId: partner.id, status: 'DONATED' },
      _sum: { paymentAmount: true },
    });

    return {
      partner: {
        id: partner.id,
        partnerId: partner.partnerId,
        organizationName: partner.organizationName,
        contactPerson: partner.contactPerson,
        email: partner.email,
        csrCategory: partner.csrCategory,
        totalSponsored: partner.totalSponsored,
      },
      stats: {
        totalSponsored: partner.totalSponsored,
        totalReferrals,
        referralDonations: referralDonations._sum.paymentAmount || 0,
      },
      recentReferrals: partner.referrals,
    };
  }

  /** Get all referrals for a partner */
  async getReferrals(partnerId: string) {
    const partner = await this.prisma.partner.findFirst({
      where: { OR: [{ partnerId }, { email: partnerId }] },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    return this.prisma.referral.findMany({
      where: { partnerId: partner.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** List all partners (admin) */
  async listAll() {
    return this.prisma.partner.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        partnerId: true,
        organizationName: true,
        contactPerson: true,
        email: true,
        csrCategory: true,
        totalSponsored: true,
        isActive: true,
        createdAt: true,
      },
    });
  }
}
