import { Controller, Get, Param } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Blogs')
@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  async findAll() {
    return this.blogService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get blog post by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }
}
