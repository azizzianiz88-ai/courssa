import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Use a global variable to prevent creating multiple instances
// in development mode due to hot reloading.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn('[Prisma] No DATABASE_URL found. DB operations will fail.');
    // Return a client that will fail gracefully at runtime (not at build time)
    const adapter = new PrismaPg({ connectionString: 'postgresql://localhost/fake' });
    return new PrismaClient({ adapter } as any);
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
