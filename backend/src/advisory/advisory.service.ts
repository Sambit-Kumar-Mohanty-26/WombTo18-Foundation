import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/services/prisma.service';
import { StorageService } from '../storage/storage.service';
import { extname } from 'path';

@Injectable()
export class AdvisoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  private async uploadFile(file: Express.Multer.File | undefined, folder: string): Promise<string> {
    if (!file) return '';
    const ext = extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const remotePath = `advisory/${folder}/${uniqueName}`;
    return this.storage.upload(file.buffer, remotePath, file.mimetype);
  }

  async createApplication(body: any, files: any) {
    const parseArray = (field: any) => {
      if (!field) return [];
      try {
        return JSON.parse(field);
      } catch (e) {
        return Array.isArray(field) ? field : [field];
      }
    };

    const primaryDomains = parseArray(body.primaryDomains);
    const secondaryDomains = parseArray(body.secondaryDomains);

    // Upload all documents via StorageService (Supabase in prod, local in dev)
    const [photoUrl, cvUrl, bioUrl, idProofUrl, qualificationProofUrl, registrationUrl] = await Promise.all([
      this.uploadFile(files.photo?.[0], 'photos'),
      this.uploadFile(files.cv?.[0], 'cv'),
      this.uploadFile(files.bio?.[0], 'bio'),
      this.uploadFile(files.idProof?.[0], 'id-proof'),
      this.uploadFile(files.qualificationProof?.[0], 'qualification'),
      this.uploadFile(files.registration?.[0], 'registration'),
    ]);

    if (!photoUrl || !cvUrl || !bioUrl || !idProofUrl || !qualificationProofUrl || !registrationUrl) {
      throw new BadRequestException('All 6 documents (Photo, CV, Bio, ID, Qualification & Registration) are mandatory for submission.');
    }

    const application = await this.prisma.advisoryApplication.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        mobile: body.mobile,
        email: body.email,
        state: body.state,
        city: body.city,
        linkedInUrl: body.linkedInUrl || null,
        designation: body.designation,
        organization: body.organization,
        
        primaryDomains,
        secondaryDomains,
        customDomain: body.customDomain || null,
        
        experienceYears: body.experienceYears,
        qualification: body.qualification,
        expertiseSummary: body.expertiseSummary,
        majorAchievements: body.majorAchievements,
        
        photoUrl,
        cvUrl,
        bioUrl,
        idProofUrl,
        qualificationProofUrl,
        registrationUrl,
        
        whyJoin: body.whyJoin || '',
        valueProposition: body.contributions6Months || body.valueProposition || '',
        expectations: body.availability || body.expectations || '',
      }
    });

    return { success: true, applicationId: application.id };
  }
}

