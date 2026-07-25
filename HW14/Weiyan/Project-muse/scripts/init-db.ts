process.env.DATABASE_URL ||= "file:./dev.db";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const statements = [
  `PRAGMA foreign_keys = ON`,
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `DROP INDEX IF EXISTS "User_name_key"`,
  `CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId")`,
  `CREATE INDEX IF NOT EXISTS "Account_userId_idx" ON "Account"("userId")`,
  `CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken")`,
  `CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId")`,
  `CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token")`,
  `CREATE TABLE IF NOT EXISTS "AppSetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS "InspirationImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "imageUrl" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL DEFAULT 'upload',
    "sourceUrl" TEXT,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "designerId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Ready-to-wear',
    "garmentType" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT '',
    "gender" TEXT NOT NULL DEFAULT 'neutral',
    "style" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "colorPalette" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "occasion" TEXT NOT NULL,
    "consumerProfile" TEXT NOT NULL,
    "trendNotes" TEXT NOT NULL,
    "locationContinent" TEXT,
    "locationCountry" TEXT,
    "locationCity" TEXT,
    "capturedAt" DATETIME,
    "capturedYear" INTEGER,
    "capturedMonth" INTEGER,
    "capturedSeason" TEXT,
    "aiRawOutput" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InspirationImage_designerId_fkey" FOREIGN KEY ("designerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "InspirationImage_designerId_idx" ON "InspirationImage"("designerId")`,
  `CREATE INDEX IF NOT EXISTS "InspirationImage_garmentType_idx" ON "InspirationImage"("garmentType")`,
  `CREATE INDEX IF NOT EXISTS "InspirationImage_style_idx" ON "InspirationImage"("style")`,
  `CREATE INDEX IF NOT EXISTS "InspirationImage_material_idx" ON "InspirationImage"("material")`,
  `CREATE INDEX IF NOT EXISTS "InspirationImage_occasion_idx" ON "InspirationImage"("occasion")`,
  `CREATE INDEX IF NOT EXISTS "InspirationImage_capturedYear_idx" ON "InspirationImage"("capturedYear")`,
  `CREATE INDEX IF NOT EXISTS "InspirationImage_capturedMonth_idx" ON "InspirationImage"("capturedMonth")`,
  `CREATE TABLE IF NOT EXISTS "Annotation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Annotation_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "InspirationImage" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Annotation_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
  )`,
  `CREATE INDEX IF NOT EXISTS "Annotation_imageId_idx" ON "Annotation"("imageId")`,
  `CREATE INDEX IF NOT EXISTS "Annotation_authorId_idx" ON "Annotation"("authorId")`,
  `CREATE TABLE IF NOT EXISTS "ImageSearchIndex" (
    "imageId" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ImageSearchIndex_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "InspirationImage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`
];

const migrations = [
  `ALTER TABLE "User" ADD COLUMN "email" TEXT`,
  `ALTER TABLE "User" ADD COLUMN "emailVerified" DATETIME`,
  `ALTER TABLE "User" ADD COLUMN "image" TEXT`,
  `ALTER TABLE "InspirationImage" ADD COLUMN "sourceType" TEXT NOT NULL DEFAULT 'upload'`,
  `ALTER TABLE "InspirationImage" ADD COLUMN "sourceUrl" TEXT`,
  `ALTER TABLE "InspirationImage" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Ready-to-wear'`,
  `ALTER TABLE "InspirationImage" ADD COLUMN "brand" TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE "InspirationImage" ADD COLUMN "gender" TEXT NOT NULL DEFAULT 'neutral'`
];

const postMigrationStatements = [
  `DROP INDEX IF EXISTS "User_name_key"`,
  `UPDATE "User"
    SET "email" = "id" || '@legacy.local'
    WHERE "email" IS NOT NULL
      AND "email" IN (
        SELECT "email" FROM "User"
        WHERE "email" IS NOT NULL
        GROUP BY "email"
        HAVING COUNT(*) > 1
      )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
  `CREATE INDEX IF NOT EXISTS "InspirationImage_category_idx" ON "InspirationImage"("category")`,
  `CREATE INDEX IF NOT EXISTS "InspirationImage_brand_idx" ON "InspirationImage"("brand")`,
  `CREATE INDEX IF NOT EXISTS "InspirationImage_gender_idx" ON "InspirationImage"("gender")`,
  `REINDEX`
];

async function main() {
  try {
    for (const statement of statements) {
      await prisma.$executeRawUnsafe(statement);
    }

    for (const statement of migrations) {
      try {
        await prisma.$executeRawUnsafe(statement);
      } catch (error) {
        if (!String(error).includes("duplicate column name")) {
          throw error;
        }
      }
    }

    for (const statement of postMigrationStatements) {
      await prisma.$executeRawUnsafe(statement);
    }

    console.log(`Initialized SQLite database at ${process.env.DATABASE_URL}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
