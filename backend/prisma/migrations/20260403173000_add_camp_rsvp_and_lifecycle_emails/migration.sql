-- Add volunteer RSVP tracking for camp participation
ALTER TABLE "CampParticipation"
ADD COLUMN "volunteerResponse" TEXT NOT NULL DEFAULT 'UNRESPONDED',
ADD COLUMN "responseAt" TIMESTAMP(3);
