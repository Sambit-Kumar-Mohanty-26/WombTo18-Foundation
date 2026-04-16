import { Controller, Post, Get, Body, Param, UseInterceptors, UploadedFiles, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AdvisoryService } from './advisory.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('advisory-applications')
export class AdvisoryController {
  constructor(private readonly advisoryService: AdvisoryService) {}

  @Post('draft')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
      { name: 'bio', maxCount: 1 },
      { name: 'idProof', maxCount: 1 },
      { name: 'qualificationProof', maxCount: 1 },
      { name: 'registration', maxCount: 1 },
    ], {
      storage: memoryStorage(),
    })
  )
  async saveDraft(
    @Body() body: any,
    @UploadedFiles() files: any
  ) {
    try {
      return await this.advisoryService.saveDraft(body, files);
    } catch (e) {
      throw new HttpException(e.message || 'Draft saving failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('draft/:token')
  async getDraft(@Param('token') token: string) {
    try {
      return await this.advisoryService.getDraft(token);
    } catch (e) {
      throw new HttpException(e.message || 'Draft retrieval failed', HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
      { name: 'bio', maxCount: 1 },
      { name: 'idProof', maxCount: 1 },
      { name: 'qualificationProof', maxCount: 1 },
      { name: 'registration', maxCount: 1 },
    ], {
      storage: memoryStorage(),
    })
  )
  async createApplication(
    @Body() body: any, 
    @UploadedFiles() files: {
      photo?: Express.Multer.File[],
      cv?: Express.Multer.File[],
      bio?: Express.Multer.File[],
      idProof?: Express.Multer.File[],
      qualificationProof?: Express.Multer.File[],
      registration?: Express.Multer.File[]
    }
  ) {
    try {
      return await this.advisoryService.createApplication(body, files);
    } catch (e) {
      throw new HttpException(e.message || 'Submission failed', HttpStatus.BAD_REQUEST);
    }
  }
}

