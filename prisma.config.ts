import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    // Generation does not connect. Migrations are guarded by tools/db-migrate.mjs.
    url: process.env.DATABASE_URL || "postgresql://database_url_required:database_url_required@127.0.0.1:5432/database_url_required"
  }
});
