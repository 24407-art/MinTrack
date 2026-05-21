-- AlterTable
ALTER TABLE "Personnel" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'ouvrier',
ADD COLUMN     "teamId" INTEGER;

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "siteId" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "shiftId" INTEGER,
    "chefId" INTEGER,
    "adjointId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "matricule" TEXT NOT NULL,
    "poste" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'non-pointe',
    "heureArrivee" TEXT,
    "heureDepart" TEXT,
    "pauseDebut" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_code_key" ON "Team"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_matricule_key" ON "TeamMember"("matricule");

-- AddForeignKey
ALTER TABLE "Personnel" ADD CONSTRAINT "Personnel_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
