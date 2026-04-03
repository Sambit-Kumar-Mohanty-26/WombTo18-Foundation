-- AlterTable
ALTER TABLE "Camp" ADD COLUMN     "activeQrExpiry" TIMESTAMP(3),
ADD COLUMN     "activeQrRotatedAt" TIMESTAMP(3),
ADD COLUMN     "normalQrExpiry" TIMESTAMP(3),
ADD COLUMN     "normalQrRotatedAt" TIMESTAMP(3);
