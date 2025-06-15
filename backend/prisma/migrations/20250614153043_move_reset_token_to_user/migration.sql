/*
  Warnings:

  - You are about to drop the column `resetToken` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpires` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpires";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" VARCHAR(255),
ADD COLUMN     "resetTokenExpires" TIMESTAMP(3);
