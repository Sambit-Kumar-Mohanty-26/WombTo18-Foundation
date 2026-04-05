import { Controller, Get, Post, Body, Res, Query } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
import type { Response } from 'express';

@ApiTags('Admin Panel')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('panel')
  @ApiOperation({ summary: 'Admin panel (demo HTML)' })
  getAdminPanel(@Res() res: Response) {
    const htmlPath = path.join(__dirname, '..', 'views', 'admin.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    res.type('text/html').send(html);
  }

  @Get('donors')
  @ApiOperation({ summary: 'List all donors' })
  async getDonors() {
    return this.adminService.findAllDonors();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get administrative metrics' })
  async getStats(@Query('range') range: string) {
    return this.adminService.getStats(range);
  }

  @Get('programs')
  @ApiOperation({ summary: 'List all programs' })
  async getPrograms() {
    return this.adminService.findAllPrograms();
  }

  @Post('programs')
  @ApiOperation({ summary: 'Create a new donation program' })
  async createProgram(@Body() body: any) {
    return this.adminService.createProgram(body);
  }

  @Post('reports')
  @ApiOperation({ summary: 'Post a progress report' })
  async postReport(@Body() body: any) {
    return { success: true, message: 'Report posted successfully' };
  }
}
