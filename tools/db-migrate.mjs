import "dotenv/config";
import { spawn } from "node:child_process";

if (!process.env.DATABASE_URL?.trim()) {
  console.error("DATABASE_URL is required before running Prisma migrations. Configure it in the application environment or .env file.");
  process.exit(1);
}

const isWindows = process.platform === "win32";
const child = isWindows
  ? spawn(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", "npx prisma migrate deploy"], {
      stdio: "inherit",
      env: process.env
    })
  : spawn("npx", ["prisma", "migrate", "deploy"], {
      stdio: "inherit",
      env: process.env
    });

child.on("exit", (code) => process.exit(code ?? 1));
