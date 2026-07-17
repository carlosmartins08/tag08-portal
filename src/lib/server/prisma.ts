import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const getPrisma = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("persistence_unavailable");
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) });
  }

  return globalForPrisma.prisma;
};
