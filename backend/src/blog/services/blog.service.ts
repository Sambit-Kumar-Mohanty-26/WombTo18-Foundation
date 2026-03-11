import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.blog.findMany();
  }

  async findBySlug(slug: string) {
    return this.prisma.blog.findUnique({ where: { slug } });
  }
}
