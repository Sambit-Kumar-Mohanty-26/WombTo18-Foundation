-- CreateEnum
CREATE TYPE "DonorTier" AS ENUM ('DONOR', 'PATRON', 'CHAMPION');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "mobile" TEXT,
    "pan" TEXT,
    "address" TEXT,
    "tier" "DonorTier" NOT NULL DEFAULT 'DONOR',
    "totalDonated" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otpHash" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "isEligible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "donorId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "displayName" BOOLEAN NOT NULL DEFAULT true,
    "receiptNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetAmount" DOUBLE PRECISION NOT NULL,
    "raisedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpactMetrics" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "totalRaised" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalUtilized" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "childrenImpacted" INTEGER NOT NULL DEFAULT 0,
    "schoolsReached" INTEGER NOT NULL DEFAULT 0,
    "healthCheckups" INTEGER NOT NULL DEFAULT 0,
    "programsSupported" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ImpactMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donor_donorId_key" ON "Donor"("donorId");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_email_key" ON "Donor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_razorpayOrderId_key" ON "Donation"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_razorpayPaymentId_key" ON "Donation"("razorpayPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_receiptNumber_key" ON "Donation"("receiptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
