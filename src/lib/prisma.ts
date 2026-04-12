import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Use a global variable to prevent creating multiple instances
// in development mode due to hot reloading.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  // Vercel-Supabase integration can set several env var names.
  // Try them all in priority order.
  const connectionString =
    process.env.POSTGRES_PRISMA_URL ||   // Vercel-Supabase integration (pooled, Prisma-friendly)
    process.env.POSTGRES_URL ||           // Vercel-Supabase generic pooled
    process.env.DATABASE_URL ||           // Manual / custom
    process.env.POSTGRES_URL_NON_POOLING; // Direct (fallback)

  if (!connectionString) {
    console.warn('[Prisma] No database URL found. DB operations will fail at runtime.');
    const adapter = new PrismaPg({ connectionString: 'postgresql://localhost/fake' });
    return new PrismaClient({ adapter } as any);
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

