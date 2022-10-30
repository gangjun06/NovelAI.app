/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Software" AS ENUM ('NOVEL_AI', 'WEB_UI');

-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('PUBLIC', 'UNLISTED');

-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "refresh_token_expires_in" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "authorId" TEXT NOT NULL,
    "status" "ImageStatus" NOT NULL,
    "rootId" TEXT,
    "originalTitle" TEXT,
    "originalURL" TEXT,
    "imageSoftware" "Software" NOT NULL,
    "imagePrompt" TEXT NOT NULL,
    "imageUCPrompt" TEXT NOT NULL,
    "imageSteps" INTEGER NOT NULL,
    "imageScale" INTEGER NOT NULL,
    "imageStrength" DOUBLE PRECISION NOT NULL,
    "imageNoise" DOUBLE PRECISION,
    "imageSeed" INTEGER NOT NULL,
    "imageSampler" TEXT NOT NULL,
    "imageWidth" INTEGER NOT NULL,
    "imageHeight" INTEGER NOT NULL,
    "imageClipSkip" INTEGER,
    "imageModelHash" TEXT,
    "imageSource" TEXT,
    "other" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "tagId" TEXT NOT NULL,
    "mean" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tagId")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "CollectionStatus" NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "readAble" "UserRole" NOT NULL,
    "writeAble" "UserRole" NOT NULL,
    "commentAble" "UserRole" NOT NULL,

    CONSTRAINT "PostCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "postCategoryId" TEXT NOT NULL,
    "readAble" "UserRole" NOT NULL,
    "writeAble" "UserRole" NOT NULL,
    "commentAble" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GeneralTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UCTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CollectionToImage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GeneralTags_AB_unique" ON "_GeneralTags"("A", "B");

-- CreateIndex
CREATE INDEX "_GeneralTags_B_index" ON "_GeneralTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UCTags_AB_unique" ON "_UCTags"("A", "B");

-- CreateIndex
CREATE INDEX "_UCTags_B_index" ON "_UCTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionToImage_AB_unique" ON "_CollectionToImage"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionToImage_B_index" ON "_CollectionToImage"("B");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_rootId_fkey" FOREIGN KEY ("rootId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_postCategoryId_fkey" FOREIGN KEY ("postCategoryId") REFERENCES "PostCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GeneralTags" ADD CONSTRAINT "_GeneralTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GeneralTags" ADD CONSTRAINT "_GeneralTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("tagId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UCTags" ADD CONSTRAINT "_UCTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UCTags" ADD CONSTRAINT "_UCTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("tagId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToImage" ADD CONSTRAINT "_CollectionToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionToImage" ADD CONSTRAINT "_CollectionToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
