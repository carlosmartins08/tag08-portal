import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const getPrisma = () => {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error("persistence_unavailable");
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  }

  return globalForPrisma.prisma;
};

export const getSafePersistenceErrorDetails = (error: unknown) => {
  if (!(error instanceof Error)) return { code: "database_operation_failed" };

  return {
    code: error.name || "database_operation_failed",
    message: error.message.replace(/postgres(?:ql)?:\/\/[^@\s]+@/gi, "postgresql://[redacted]@").slice(0, 180)
  };
};
