/*
  Warnings:

  - You are about to drop the column `score` on the `StudentScore` table. All the data in the column will be lost.
  - Added the required column `studentAnswers` to the `StudentScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentScore" DROP COLUMN "score",
ADD COLUMN     "studentAnswers" TEXT NOT NULL;
