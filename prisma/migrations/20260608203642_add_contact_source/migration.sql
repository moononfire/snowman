-- CreateEnum
CREATE TYPE "ContactSource" AS ENUM ('MANUAL', 'CSV_IMPORT', 'GOOGLE_SCRAPE');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "source" "ContactSource" NOT NULL DEFAULT 'MANUAL';
