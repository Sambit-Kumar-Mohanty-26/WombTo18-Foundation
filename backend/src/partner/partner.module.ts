import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PartnerService } from './services/partner.service';
import { PartnerController } from './controllers/partner.controller';
import { VerificationModule } from '../verification/verification.module';
import { MailerService } from '../auth/services/mailer.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule, 
    VerificationModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'secretKey',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [PartnerController],
  providers: [PartnerService, MailerService],
  exports: [PartnerService],
})
export class PartnerMgmtModule {}
