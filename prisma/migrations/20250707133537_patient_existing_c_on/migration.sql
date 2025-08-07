/*
  Warnings:

  - You are about to drop the column `currentCondition` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `existingCondition` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "currentCondition",
DROP COLUMN "existingCondition",
ADD COLUMN     "currentMedications" TEXT,
ADD COLUMN     "existingConditions" TEXT;
