import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AdvisoryService {
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

    const photoUrl = files.photo?.[0]?.filename ? `/uploads/advisory/${files.photo[0].filename}` : '';
    const cvUrl = files.cv?.[0]?.filename ? `/uploads/advisory/${files.cv[0].filename}` : '';
    const bioUrl = files.bio?.[0]?.filename ? `/uploads/advisory/${files.bio[0].filename}` : '';
    const idProofUrl = files.idProof?.[0]?.filename ? `/uploads/advisory/${files.idProof[0].filename}` : '';
    const qualificationProofUrl = files.qualificationProof?.[0]?.filename ? `/uploads/advisory/${files.qualificationProof[0].filename}` : '';
    const registrationUrl = files.registration?.[0]?.filename ? `/uploads/advisory/${files.registration[0].filename}` : '';

    if (!photoUrl || !cvUrl || !bioUrl || !idProofUrl || !qualificationProofUrl || !registrationUrl) {
      throw new BadRequestException('All 6 documents (Photo, CV, Bio, ID, Qualification & Registration) are mandatory for submission.');
    }

    const application = await prisma.advisoryApplication.create({
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
