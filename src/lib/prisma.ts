import { PrismaClient } from '../generated/prisma/client';

// Use a global variable to prevent creating multiple instances
// of Prisma Client in development mode due to hot reloading.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prisma 7: requires accelerateUrl for direct DB connections
function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // No DB configured — return a mock-safe client (won't crash at build time)
    return new PrismaClient({ accelerateUrl: 'prisma://localhost' } as any);
  }
  return new PrismaClient({ accelerateUrl: url } as any);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

