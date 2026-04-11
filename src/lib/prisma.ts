import { PrismaClient } from '../generated/prisma/client';

// Use a global variable to prevent creating multiple instances
// of Prisma Client in development mode due to hot reloading.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
