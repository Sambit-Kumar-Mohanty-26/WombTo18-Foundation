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
}
