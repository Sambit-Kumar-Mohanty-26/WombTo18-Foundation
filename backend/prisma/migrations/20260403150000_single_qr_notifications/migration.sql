-- Add share selection for camp attendance and in-app notifications
ALTER TABLE "CampParticipation"
ADD COLUMN "shareSelected" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'CAMP_UPDATE',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Notification_volunteerId_createdAt_idx" ON "Notification"("volunteerId", "createdAt" DESC);

ALTER TABLE "Notification"
ADD CONSTRAINT "Notification_volunteerId_fkey"
FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
