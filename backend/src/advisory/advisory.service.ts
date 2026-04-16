import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/services/prisma.service';
import { StorageService } from '../storage/storage.service';
import { VerificationService } from '../verification/verification.service';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdvisoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly verification: VerificationService,
  ) {}

  private async uploadFile(file: Express.Multer.File | undefined, folder: string): Promise<string> {
    if (!file) return '';
    const ext = extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const remotePath = `advisory/${folder}/${uniqueName}`;
    return this.storage.upload(file.buffer, remotePath, file.mimetype);
  }

  async saveDraft(body: any, files: any) {
    const email = body.email;
    if (!email) throw new BadRequestException('Email is required to save a draft.');

    // Upload any files provided during draft save (Step 4)
    const [photoUrl, cvUrl, bioUrl, idProofUrl, qualificationProofUrl, registrationUrl] = await Promise.all([
      this.uploadFile(files.photo?.[0], 'drafts/photos'),
      this.uploadFile(files.cv?.[0], 'drafts/cv'),
      this.uploadFile(files.bio?.[0], 'drafts/bio'),
      this.uploadFile(files.idProof?.[0], 'drafts/id-proof'),
      this.uploadFile(files.qualificationProof?.[0], 'drafts/qualification'),
      this.uploadFile(files.registration?.[0], 'drafts/registration'),
    ]);

    // Parse existing data to merge uploaded file URLs
    const formData = JSON.parse(body.formData || '{}');
    if (photoUrl) formData.documents.photoUrl = photoUrl;
    if (cvUrl) formData.documents.cvUrl = cvUrl;
    if (bioUrl) formData.documents.bioUrl = bioUrl;
    if (idProofUrl) formData.documents.idProofUrl = idProofUrl;
    if (qualificationProofUrl) formData.documents.qualificationProofUrl = qualificationProofUrl;
    if (registrationUrl) formData.documents.registrationUrl = registrationUrl;

    const token = uuidv4();
    
    // Upsert draft
    const draft = await this.prisma.advisoryDraft.upsert({
      where: { email },
      update: {
        data: JSON.stringify(formData),
        currentStep: parseInt(body.currentStep) || 4,
        token: token,
      },
      create: {
        email,
        data: JSON.stringify(formData),
        currentStep: parseInt(body.currentStep) || 4,
        token: token,
      }
    });

    // Send Email
    const resumeUrl = `${body.origin || 'http://localhost:5173'}/advisory-board/apply?draft=${token}`;
    await this.verification.sendAdvisoryDraftLink(email, resumeUrl, formData.firstName);

    return { success: true, message: 'Draft saved and link sent to your email.', token: draft.token };
  }

  async getDraft(token: string) {
    const draft = await this.prisma.advisoryDraft.findUnique({
      where: { token }
    });

    if (!draft) throw new NotFoundException('Draft not found or expired.');

    return {
      success: true,
      data: JSON.parse(draft.data),
      currentStep: draft.currentStep
    };
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

    // Upload all documents via StorageService
    // We also check if URLs are already present (from a resumed draft)
    const [photoUrl, cvUrl, bioUrl, idProofUrl, qualificationProofUrl, registrationUrl] = await Promise.all([
      files.photo?.[0] ? this.uploadFile(files.photo?.[0], 'photos') : Promise.resolve(body.photoUrl || ''),
      files.cv?.[0] ? this.uploadFile(files.cv?.[0], 'cv') : Promise.resolve(body.cvUrl || ''),
      files.bio?.[0] ? this.uploadFile(files.bio?.[0], 'bio') : Promise.resolve(body.bioUrl || ''),
      files.idProof?.[0] ? this.uploadFile(files.idProof?.[0], 'id-proof') : Promise.resolve(body.idProofUrl || ''),
      files.qualificationProof?.[0] ? this.uploadFile(files.qualificationProof?.[0], 'qualification') : Promise.resolve(body.qualificationProofUrl || ''),
      files.registration?.[0] ? this.uploadFile(files.registration?.[0], 'registration') : Promise.resolve(body.registrationUrl || ''),
    ]);

    if (!photoUrl || !cvUrl || !bioUrl || !idProofUrl || !qualificationProofUrl || !registrationUrl) {
      throw new BadRequestException('All 6 documents are mandatory for submission.');
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

    // Clean up draft if it exists
    try {
      await this.prisma.advisoryDraft.delete({ where: { email: body.email } });
    } catch (e) {
      // Ignore if draft doesn't exist
    }

    return { success: true, applicationId: application.id };
  }
}

