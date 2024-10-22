/*
  Warnings:

  - The `studentAnswers` column on the `StudentScore` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `correctAnswers` to the `StudentScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `StudentScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentScore" ADD COLUMN     "correctAnswers" INTEGER NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL,
DROP COLUMN "studentAnswers",
ADD COLUMN     "studentAnswers" TEXT[];
