-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "stage" TEXT;

-- AlterTable
ALTER TABLE "_EventParticipants" ADD CONSTRAINT "_EventParticipants_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_EventParticipants_AB_unique";

-- AlterTable
ALTER TABLE "_TaskUsers" ADD CONSTRAINT "_TaskUsers_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_TaskUsers_AB_unique";
