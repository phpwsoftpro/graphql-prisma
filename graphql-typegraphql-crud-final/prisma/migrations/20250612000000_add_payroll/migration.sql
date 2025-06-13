-- CreateTable
CREATE TABLE "Payroll" (
  "id" TEXT NOT NULL DEFAULT concat('c', substr(md5(random()::text), 1, 24)),
  "employeeId" TEXT NOT NULL,
  "workedHours" DOUBLE PRECISION NOT NULL,
  "periodStart" TIMESTAMP(3) NOT NULL,
  "periodEnd" TIMESTAMP(3) NOT NULL,
  "approvedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);
