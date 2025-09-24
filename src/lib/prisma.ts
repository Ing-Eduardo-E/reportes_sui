import { PrismaClient } from '../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Sin logs en producción para mejor performance
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;