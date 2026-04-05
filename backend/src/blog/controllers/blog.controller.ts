import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Blogs')
@Controller('blogs')
@UseInterceptors(CacheInterceptor)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @CacheTTL(600) // Cache for 10 minutes
  @ApiOperation({ summary: 'Get all blog posts' })
  async findAll() {
    return this.blogService.findAll();
  }

  @Get(':slug')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({ summary: 'Get blog post by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }
}

