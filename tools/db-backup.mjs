import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const container = process.env.TAG08_POSTGRES_CONTAINER || "tag08-postgres";
const database = process.env.TAG08_POSTGRES_DB || "tag08";
const user = process.env.TAG08_POSTGRES_USER || "tag08";
const backupDirectory = resolve(process.env.TAG08_BACKUP_DIR || "backups");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputPath = join(backupDirectory, `tag08-${timestamp}.dump`);

mkdirSync(backupDirectory, { recursive: true });
const result = spawnSync("docker", ["exec", container, "pg_dump", "-U", user, "-Fc", database], { encoding: null });
if (result.status !== 0) {
  throw new Error(result.stderr?.toString() || "Postgres backup failed.");
}

writeFileSync(outputPath, result.stdout);
console.log(JSON.stringify({ event: "database_backup_created", outputPath }));
