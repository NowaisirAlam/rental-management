-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TenantProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "apartmentOrUnitNumber" TEXT NOT NULL,
    "buildingOrInvitationCode" TEXT NOT NULL,
    "moveInDate" TEXT NOT NULL,
    "emergencyContactName" TEXT NOT NULL,
    "emergencyContactPhone" TEXT NOT NULL,
    "agreeToTerms" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TenantProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LandlordProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "companyOrLandlordName" TEXT NOT NULL,
    "numberOfUnitsManaged" TEXT NOT NULL,
    "primaryPropertyStreetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalOrZipCode" TEXT NOT NULL,
    "propertyOwnerType" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "confirmOwnershipOrAuthorization" BOOLEAN NOT NULL,
    "agreeToTerms" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LandlordProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TenantProfile_userId_key" ON "TenantProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LandlordProfile_userId_key" ON "LandlordProfile"("userId");
