-- CreateTable
CREATE TABLE "activity_documents" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activityId" INTEGER NOT NULL,
    "uploadedById" INTEGER,

    CONSTRAINT "activity_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_documents_activityId_idx" ON "activity_documents"("activityId");

-- CreateIndex
CREATE INDEX "activity_documents_uploadedById_idx" ON "activity_documents"("uploadedById");

-- AddForeignKey
ALTER TABLE "activity_documents" ADD CONSTRAINT "activity_documents_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_documents" ADD CONSTRAINT "activity_documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

