-- DropForeignKey
ALTER TABLE "Dependency" DROP CONSTRAINT "Dependency_dependeeId_fkey";

-- DropForeignKey
ALTER TABLE "Dependency" DROP CONSTRAINT "Dependency_dependentId_fkey";

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_dependeeId_fkey" FOREIGN KEY ("dependeeId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dependency" ADD CONSTRAINT "Dependency_dependentId_fkey" FOREIGN KEY ("dependentId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
