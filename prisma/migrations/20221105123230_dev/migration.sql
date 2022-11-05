/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GeneralTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UCTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GeneralTags" DROP CONSTRAINT "_GeneralTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_GeneralTags" DROP CONSTRAINT "_GeneralTags_B_fkey";

-- DropForeignKey
ALTER TABLE "_UCTags" DROP CONSTRAINT "_UCTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_UCTags" DROP CONSTRAINT "_UCTags_B_fkey";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "ucTags" TEXT[];

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_GeneralTags";

-- DropTable
DROP TABLE "_UCTags";

-- CreateIndex
CREATE INDEX "Image_createdAt_idx" ON "Image"("createdAt");
