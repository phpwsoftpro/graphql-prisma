/*
  Warnings:

  - You are about to drop the `Checklist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_taskId_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "checklist" JSONB;

-- DropTable
DROP TABLE "Checklist";
