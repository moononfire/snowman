-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('NOT_CALLED', 'INTERESTED', 'NOT_INTERESTED', 'NO_ANSWER', 'CALLBACK', 'VOICEMAIL', 'WRONG_NUMBER');

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "position" TEXT,
    "email" TEXT,
    "preCallNote" TEXT,
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListContact" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "CallStatus" NOT NULL DEFAULT 'NOT_CALLED',
    "notes" TEXT,
    "followUpAt" TIMESTAMP(3),
    "calledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListContact_listId_order_idx" ON "ListContact"("listId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ListContact_listId_contactId_key" ON "ListContact"("listId", "contactId");

-- AddForeignKey
ALTER TABLE "ListContact" ADD CONSTRAINT "ListContact_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListContact" ADD CONSTRAINT "ListContact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
