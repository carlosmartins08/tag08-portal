import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import {
  assertInteractiveLinkOutput,
  assertTrustedDatabaseIdentity,
  type DatabaseIdentityClient,
  readTrustedDatabaseIdentity,
  writeMagicLinkToTerminal
} from "../tools/onboarding-access";

const safeTerminal = { stdinIsTTY: true, stdoutIsTTY: true, env: {} };
assert.doesNotThrow(() => assertInteractiveLinkOutput(safeTerminal));
assert.throws(() => assertInteractiveLinkOutput({ ...safeTerminal, stdinIsTTY: false }), /interactive_terminal_required/);
assert.throws(() => assertInteractiveLinkOutput({ ...safeTerminal, stdoutIsTTY: false }), /interactive_terminal_required/);
assert.throws(() => assertInteractiveLinkOutput({ ...safeTerminal, env: { CI: "true" } }), /interactive_terminal_required/);
assert.doesNotThrow(() => assertInteractiveLinkOutput({ ...safeTerminal, env: { CI: "false" } }));

let output = "";
const write = (text: string) => { output += text; };
const bearer = "https://tag08.test/cliente/onboarding#access_token=synthetic-bearer";
assert.throws(
  () => writeMagicLinkToTerminal(write, bearer, { ...safeTerminal, stdoutIsTTY: false }),
  /interactive_terminal_required/
);
assert.equal(output, "");
assert.doesNotThrow(() => writeMagicLinkToTerminal(write, "safe output", safeTerminal));
assert.equal(output, "safe output");

const trusted = readTrustedDatabaseIdentity({
  ONBOARDING_ADMIN_EXPECTED_DATABASE_NAME: "tag08_onboarding_staging",
  ONBOARDING_ADMIN_EXPECTED_PG_SYSTEM_IDENTIFIER: "7348291047382910473"
});
assert.deepEqual(trusted, {
  databaseName: "tag08_onboarding_staging",
  systemIdentifier: "7348291047382910473"
});
for (const env of [
  {},
  { ONBOARDING_ADMIN_EXPECTED_DATABASE_NAME: "tag08_onboarding_staging" },
  { ONBOARDING_ADMIN_EXPECTED_DATABASE_NAME: "bad/name", ONBOARDING_ADMIN_EXPECTED_PG_SYSTEM_IDENTIFIER: "42" },
  { ONBOARDING_ADMIN_EXPECTED_DATABASE_NAME: "tag08_onboarding_staging", ONBOARDING_ADMIN_EXPECTED_PG_SYSTEM_IDENTIFIER: "0" }
]) {
  assert.throws(() => readTrustedDatabaseIdentity(env), /database_identity_unverified/);
}

const queryClient = (rows: unknown[], fail = false) => ({
  $queryRaw: async <T>() => {
    if (fail) throw new Error("database error containing private details");
    return rows as T;
  }
}) as DatabaseIdentityClient;
await assert.doesNotReject(() => assertTrustedDatabaseIdentity(queryClient([{
  database_name: trusted.databaseName,
  system_identifier: trusted.systemIdentifier
}]), trusted));
await assert.rejects(
  () => assertTrustedDatabaseIdentity(queryClient([{ database_name: "other", system_identifier: "42" }]), trusted),
  /database_identity_mismatch/
);
await assert.rejects(
  () => assertTrustedDatabaseIdentity(queryClient([], true), trusted),
  (error: unknown) => error instanceof Error && error.message === "database_identity_unverified" && !error.message.includes("private details")
);

const cliPath = resolve("tools/onboarding-access.ts");
const refused = spawnSync(process.execPath, ["--import", "tsx", cliPath, "create", "--operator", "synthetic", "--commercial-reference", "synthetic", "--reason", "synthetic", "--origin", "https://tag08.test"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    CI: "true",
    NODE_ENV: "test",
    ONBOARDING_ADMIN_ENV: "local",
    DATABASE_URL: "postgresql://synthetic:synthetic@invalid.example:5432/synthetic"
  },
  encoding: "utf8"
});
assert.equal(refused.status, 1);
assert.equal(refused.stdout, "");
assert.match(refused.stderr, /interactive_terminal_required/);
assert.doesNotMatch(refused.stderr, /access_token|synthetic-bearer|DATABASE_URL|postgresql:/i);

const missingIdentity = spawnSync(process.execPath, ["--import", "tsx", cliPath, "revoke", "--operator", "synthetic", "--commercial-reference", "synthetic", "--reason", "synthetic", "--journey-id", "synthetic-journey"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    CI: "",
    NODE_ENV: "test",
    ONBOARDING_ADMIN_ENV: "local",
    DATABASE_URL: "postgresql://synthetic:synthetic@invalid.example:5432/synthetic",
    ONBOARDING_ADMIN_EXPECTED_DATABASE_NAME: "",
    ONBOARDING_ADMIN_EXPECTED_PG_SYSTEM_IDENTIFIER: ""
  },
  encoding: "utf8"
});
assert.equal(missingIdentity.status, 1);
assert.match(missingIdentity.stderr, /database_identity_unverified/);
assert.doesNotMatch(missingIdentity.stdout + missingIdentity.stderr, /postgresql:|invalid\.example/);
