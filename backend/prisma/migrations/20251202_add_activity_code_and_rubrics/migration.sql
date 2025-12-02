-- AlterTable
ALTER TABLE "activities" ADD COLUMN "activityCode" TEXT;
ALTER TABLE "activities" ADD COLUMN "content" TEXT;

-- CreateTable
CREATE TABLE "rubrics" (
    "id" SERIAL NOT NULL,
    "rubricCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "activityCode" TEXT NOT NULL,
    "levels" TEXT NOT NULL,
    "criteria" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activityId" INTEGER NOT NULL,

    CONSTRAINT "rubrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rubrics_rubricCode_key" ON "rubrics"("rubricCode");

-- CreateIndex
CREATE UNIQUE INDEX "activities_activityCode_key" ON "activities"("activityCode");

-- AddForeignKey
ALTER TABLE "rubrics" ADD CONSTRAINT "rubrics_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

