import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import * as path from 'path';
import * as fs from 'fs';
import type { Response } from 'express';

@Controller('api/demo')
export class DemoController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getDemoPage(@Res() res: Response) {
    const htmlPath = path.join(__dirname, '..', 'views', 'demo.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    res.type('text/html').send(html);
  }

  @Post('donate')
  async donateDummy(@Body() body: any) {
    const { name, email, mobile, pan, address, amount } = body;
    
    // Create or Update donor directly in the DB
    const donor = await this.prisma.donor.upsert({
      where: { email },
      update: { name, mobile, pan, address },
      create: { 
        donorId: `DNR${Date.now()}`,
        email, 
        name, 
        mobile, 
        pan, 
        address,
      }
    });

    const program = await this.prisma.program.findFirst() || await this.prisma.program.create({
      data: { name: 'General Fund', description: 'General Fund', targetAmount: 100000 }
    });

    // Directly create the successful donation linking the user inputs
    const donation = await this.prisma.donation.create({
      data: {
        amount: Number(amount),
        currency: 'INR',
        status: 'SUCCESS',
        razorpayOrderId: `dummy_order_${Date.now()}`,
        razorpayPaymentId: `dummy_pay_${Date.now()}`,
        donorId: donor.id,
        programId: program.id,
        displayName: true,
        receiptNumber: `REC-${Date.now()}`
      }
    });
    
    return { success: true, donationId: donation.id };
  }
}
