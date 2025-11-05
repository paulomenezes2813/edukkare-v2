-- AlterTable
ALTER TABLE "classes" ADD COLUMN "teacherProfileId" INTEGER;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

