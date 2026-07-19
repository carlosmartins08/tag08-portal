import assert from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";

const container = process.env.TAG08_POSTGRES_CONTAINER || "tag08-postgres";
const user = process.env.TAG08_POSTGRES_USER || "tag08";
const database = process.env.TAG08_POSTGRES_DB || "tag08";
const restoreDatabase = `tag08_restore_${randomUUID().replaceAll("-", "").slice(0, 16)}`;

const docker = (args, options = {}) => {
  const result = spawnSync("docker", args, { encoding: "utf8", ...options });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `docker ${args.join(" ")} failed`);
  return result.stdout;
};

const backupOutput = docker(["exec", container, "pg_dump", "-U", user, "-Fc", database], { encoding: null });
const tempBackupPath = `.tmp-restore-${Date.now()}.dump`;

try {
  // The temporary database is the only restore target; the primary database is read-only for this check.
  docker(["exec", container, "createdb", "-U", user, restoreDatabase]);
  const restore = spawnSync(
    "docker",
    ["exec", "-i", container, "pg_restore", "-U", user, "-d", restoreDatabase, "--exit-on-error"],
    { input: backupOutput, encoding: null }
  );
  if (restore.status !== 0) throw new Error(restore.stderr?.toString() || "Database restore failed.");

  const tables = docker([
    "exec", container, "psql", "-U", user, "-d", restoreDatabase, "-Atc",
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
  ]).trim().split(/\r?\n/).filter(Boolean);
  for (const table of ["contact_leads", "talent_applications", "onboarding_submissions", "integration_deliveries", "retention_audits"]) {
    assert.ok(tables.includes(table), `missing restored table: ${table}`);
  }

  const outboxColumns = docker([
    "exec", container, "psql", "-U", user, "-d", restoreDatabase, "-Atc",
    "SELECT column_name FROM information_schema.columns WHERE table_name = 'integration_deliveries' ORDER BY column_name"
  ]).trim().split(/\r?\n/).filter(Boolean);
  assert.ok(outboxColumns.includes("processing_started_at"), "restored outbox lease column is missing");
  console.log(JSON.stringify({ event: "database_restore_verification_passed", restoreDatabase }));
} finally {
  // Drop only the generated isolated database, even when verification fails.
  spawnSync("docker", ["exec", container, "dropdb", "-U", user, "--if-exists", restoreDatabase], { encoding: "utf8" });
  rmSync(tempBackupPath, { force: true });
}
