import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DonorModule } from './donor/donor.module';
import { DonationModule } from './donation/donation.module';
import { CertificateModule } from './certificate/certificate.module';
import { ProgramModule } from './program/program.module';
import { BlogModule } from './blog/blog.module';
import { AdminModule } from './admin/admin.module';
import { DemoModule } from './demo/demo.module';
import { BhashiniModule } from './bhashini/bhashini.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DonorModule,
    DonationModule,
    CertificateModule,
    ProgramModule,
    BlogModule,
    AdminModule,
    DemoModule,
    BhashiniModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
