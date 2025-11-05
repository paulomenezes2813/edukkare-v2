-- AlterTable: Remove teacherProfileId (não é mais necessário)
ALTER TABLE "classes" DROP COLUMN IF EXISTS "teacherProfileId";

-- AddForeignKey: Recria a foreign key de teacherId para apontar para teachers
ALTER TABLE "classes" DROP CONSTRAINT IF EXISTS "classes_teacherId_fkey";
ALTER TABLE "classes" ADD CONSTRAINT "classes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

