-- AlterTable
ALTER TABLE "public"."Eastborder" ALTER COLUMN "space" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "public"."easternborderasset@gmail.com";

-- CreateTable
CREATE TABLE "public"."EastborderImage" (
    "id" SERIAL NOT NULL,
    "secure_url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "eastborderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EastborderImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EastborderImage" ADD CONSTRAINT "EastborderImage_eastborderId_fkey" FOREIGN KEY ("eastborderId") REFERENCES "public"."Eastborder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

