import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { VerificationService } from '../../verification/verification.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PartnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly verificationService: VerificationService,
  ) {}

  /** Helper to generate informative Partner ID: PTN-CAT-YYMM-SEQ */
  private async generatePartnerId(category?: string): Promise<string> {
    const date = new Date();
    const yy = date.getFullYear().toString().slice(-2);
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const yymm = `${yy}${mm}`;

    // Normalize category to 3-4 chars
    let catCode = 'GEN';
    const cat = (category || '').toUpperCase();
    if (cat.includes('CSR')) catCode = 'CSR';
    else if (cat.includes('INSTITUTIONAL')) catCode = 'INST';
    else if (cat.includes('STRATEGIC')) catCode = 'STRT';
    else if (cat.includes('GRANT')) catCode = 'GRNT';
    else if (cat.length >= 3) catCode = cat.slice(0, 4).replace(/[^A-Z]/g, '');

    // Get sequential number for this category and month
    const count = await this.prisma.partner.count({
      where: {
        partnerId: {
          startsWith: `PTN-${catCode}-${yymm}`,
        },
      },
    });

    const seq = (count + 1).toString().padStart(3, '0');
    return `PTN-${catCode}-${yymm}-${seq}`;
  }

  /** Self-signup for partner after OTP verification */
  async signup(data: {
    organizationName: string;
    contactPerson: string;
    email: string;
    mobile: string;
    password: string;
    panNumber?: string;
    csrCategory?: string;
  }) {
    const existing = await this.prisma.partner.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Partner with this email already exists');

    const partnerId = await this.generatePartnerId(data.csrCategory);
    const hashedPassword = await bcrypt.hash(data.password, 12);

    try {
      const partner = await this.prisma.partner.create({
        data: {
          partnerId,
          organizationName: data.organizationName,
          contactPerson: data.contactPerson,
          email: data.email,
          mobile: data.mobile,
          password: hashedPassword,
          panNumber: data.panNumber,
          csrCategory: data.csrCategory,
          isActive: true, 
        },
      });

      return {
        success: true,
        message: 'Account created successfully!',
        partnerId: partner.partnerId,
        id: partner.id,
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new BadRequestException('This email or partner ID is already registered');
        }
      }
      throw err;
    }
  }

  async sendSignupEmailOtp(email: string) {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hash = await bcrypt.hash(otp, 10);
    
    await this.verificationService.sendEmailOtp(email, otp);
    return { success: true, hash, message: 'OTP sent to email' };
  }

  async sendSignupMobileOtp(mobile: string) {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hash = await bcrypt.hash(otp, 10);
    
    await this.verificationService.sendMobileOtp(mobile, otp);
    return { success: true, hash, message: 'OTP sent to mobile' };
  }

  async verifySignupOtp(type: 'email' | 'mobile', hash: string, otp: string) {
    const isValid = await bcrypt.compare(otp, hash);
    if (!isValid) throw new BadRequestException('Invalid OTP');
    return { success: true, message: 'OTP verified' };
  }

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

    const partnerId = await this.generatePartnerId(data.csrCategory);
    const hashedPassword = await bcrypt.hash(data.password, 12);

    return this.prisma.partner.create({
      data: {
        partnerId,
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
        referrals: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    const referrals = partner.referrals;
    const totalReferrals = referrals.length;
    const donatedReferrals = referrals.filter(r => r.status === 'DONATED');
    const joiningReferrals = referrals.filter(r => r.status === 'JOINED' || r.status === 'DONATED');
    
    const referralDonations = donatedReferrals.reduce((sum, r) => sum + (r.paymentAmount || 0), 0);
    const totalImpact = (partner.totalSponsored || 0) + referralDonations;

    // ADVANCED METRIC CALCULATIONS
    const conversionRate = totalReferrals > 0 ? (donatedReferrals.length / totalReferrals) * 100 : 0;
    const trustScore = totalReferrals > 0 ? (joiningReferrals.length / totalReferrals) * 100 : 100; // Default 100
    const livesImpacted = Math.floor(totalImpact / 500); 

    // Partner Score (0-100 weighted)
    let partnerScore = Math.min(100, (totalImpact / 100000) * 70 + (totalReferrals / 50) * 30);
    if (totalImpact === 0 && totalReferrals === 0) partnerScore = 0;

    // Status & ESG
    let status = 'BRONZE';
    if (totalImpact > 200000) status = 'PLATINUM';
    else if (totalImpact > 100000) status = 'GOLD';
    else if (totalImpact > 25000) status = 'SILVER';

    let esgRating = 'B';
    if (totalImpact > 100000 || totalReferrals > 50) esgRating = 'A+';
    else if (totalImpact > 50000 || totalReferrals > 25) esgRating = 'A';

    // Monthly Trend (Last 6 Months)
    const monthlyImpact = Array(6).fill(0);
    const now = new Date();
    referrals.forEach(r => {
      const rDate = new Date(r.createdAt);
      const monthsDiff = (now.getFullYear() - rDate.getFullYear()) * 12 + (now.getMonth() - rDate.getMonth());
      if (monthsDiff >= 0 && monthsDiff < 6) {
        monthlyImpact[5 - monthsDiff] += (r.paymentAmount || 0);
      }
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
        status,
        esgRating,
        partnerScore: parseFloat(partnerScore.toFixed(1)),
        trustScore: parseFloat(trustScore.toFixed(1)),
        livesImpacted,
      },
      stats: {
        totalSponsored: partner.totalSponsored,
        totalReferrals,
        referralDonations,
        totalImpact,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        avgYield: donatedReferrals.length > 0 ? referralDonations / donatedReferrals.length : 0,
        pendingAuth: referrals.filter(r => r.status === 'PENDING').length,
      },
      trends: {
        monthlyImpact,
        labels: Array.from({ length: 6 }, (_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - (5 - i));
          return d.toLocaleString('default', { month: 'short' });
        }),
      },
      recentReferrals: referrals.slice(0, 10),
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
