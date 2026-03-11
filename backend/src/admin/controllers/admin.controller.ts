import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from '../services/admin.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Panel')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('donors')
  @ApiOperation({ summary: 'List all donors' })
  async getDonors() {
    return this.adminService.findAllDonors();
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
