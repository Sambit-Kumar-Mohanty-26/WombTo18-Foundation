/*
  Warnings:

  - The `status` column on the `Donation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tier` column on the `Donor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "referralCode" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "emailOtpHash" TEXT,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNonDonor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVolunteer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mobileOtpHash" TEXT,
ADD COLUMN     "mobileVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "referredById" TEXT,
ADD COLUMN     "showOnLeaderboard" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "tier",
ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'DONOR';

-- DropEnum
DROP TYPE "DonationStatus";

-- DropEnum
DROP TYPE "DonorTier";

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "city" TEXT,
    "profession" TEXT,
    "skills" TEXT[],
    "availability" TEXT,
    "linkedIn" TEXT,
    "motivation" TEXT,
    "totalCoins" INTEGER NOT NULL DEFAULT 0,
    "showOnLeaderboard" BOOLEAN NOT NULL DEFAULT true,
    "hasClaimedLoginCoin" BOOLEAN NOT NULL DEFAULT false,
    "emailOtpHash" TEXT,
    "mobileOtpHash" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "mobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "organizationName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT,
    "password" TEXT NOT NULL,
    "panNumber" TEXT,
    "csrCategory" TEXT,
    "emailOtpHash" TEXT,
    "mobileOtpHash" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "mobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "totalSponsored" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerType" TEXT NOT NULL,
    "volunteerId" TEXT,
    "partnerId" TEXT,
    "referredName" TEXT,
    "referredEmail" TEXT NOT NULL,
    "referredPhone" TEXT,
    "paymentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "coinsAwarded" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "joinedDonorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinTransaction" (
    "id" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoinTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinConfig" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "firstLogin" INTEGER NOT NULL DEFAULT 50,
    "campJoin" INTEGER NOT NULL DEFAULT 30,
    "campActive" INTEGER NOT NULL DEFAULT 100,
    "referralTiers" TEXT NOT NULL DEFAULT '[{"min":0,"max":999,"coins":25},{"min":1000,"max":4999,"coins":50},{"min":5000,"max":99999999,"coins":100}]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoinConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Camp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "assignedAdminId" TEXT,
    "normalQrToken" TEXT NOT NULL,
    "activeQrToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Camp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampParticipation" (
    "id" TEXT NOT NULL,
    "campId" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "participationType" TEXT NOT NULL DEFAULT 'NORMAL',
    "coinsAwarded" INTEGER NOT NULL DEFAULT 0,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientType" TEXT NOT NULL,
    "donorId" TEXT,
    "volunteerId" TEXT,
    "partnerId" TEXT,
    "fileUrl" TEXT,
    "shareText" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvisoryApplication" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "linkedInUrl" TEXT,
    "designation" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "primaryDomains" TEXT[],
    "secondaryDomains" TEXT[],
    "customDomain" TEXT,
    "experienceYears" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "expertiseSummary" TEXT NOT NULL,
    "majorAchievements" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "cvUrl" TEXT NOT NULL,
    "bioUrl" TEXT NOT NULL,
    "idProofUrl" TEXT NOT NULL,
    "qualificationProofUrl" TEXT NOT NULL,
    "registrationUrl" TEXT NOT NULL,
    "whyJoin" TEXT NOT NULL,
    "valueProposition" TEXT NOT NULL,
    "expectations" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdvisoryApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_volunteerId_key" ON "Volunteer"("volunteerId");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_donorId_key" ON "Volunteer"("donorId");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_email_key" ON "Volunteer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_partnerId_key" ON "Partner"("partnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_email_key" ON "Partner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Camp_normalQrToken_key" ON "Camp"("normalQrToken");

-- CreateIndex
CREATE UNIQUE INDEX "Camp_activeQrToken_key" ON "Camp"("activeQrToken");

-- CreateIndex
CREATE UNIQUE INDEX "CampParticipation_campId_volunteerId_key" ON "CampParticipation"("campId", "volunteerId");

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "Donor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoinTransaction" ADD CONSTRAINT "CoinTransaction_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampParticipation" ADD CONSTRAINT "CampParticipation_campId_fkey" FOREIGN KEY ("campId") REFERENCES "Camp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampParticipation" ADD CONSTRAINT "CampParticipation_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
