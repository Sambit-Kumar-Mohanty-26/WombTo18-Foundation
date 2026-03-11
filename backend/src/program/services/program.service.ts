import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class ProgramService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.program.findMany();
  }
}
