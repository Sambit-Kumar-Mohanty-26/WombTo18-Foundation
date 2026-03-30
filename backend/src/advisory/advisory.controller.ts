import { Controller, Post, Body, UseInterceptors, UploadedFiles, HttpException, HttpStatus } from '@nestjs/common';
import { AdvisoryService } from './advisory.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

import { join } from 'path';

const uploadPath = join(process.cwd(), '..', 'uploads', 'advisory');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

@Controller('advisory-applications')
export class AdvisoryController {
  constructor(private readonly advisoryService: AdvisoryService) {}

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
      storage: diskStorage({
        destination: uploadPath,
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        }
      })
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
