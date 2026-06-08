import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient() {
  const sql = neon(process.env.DATABASE_URL!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(sql as any);
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
