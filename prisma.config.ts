import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    // Generation does not connect. Deploys must override this with a real DATABASE_URL.
    url: process.env.DATABASE_URL || "postgresql://tag08:tag08@localhost:5432/tag08"
  }
});
