-- Add unique constraint on providerEventId
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_providerEventId_unique" UNIQUE ("providerEventId");

-- If there are existing duplicate non-null providerEventId values this will fail; ensure uniqueness before applying.
