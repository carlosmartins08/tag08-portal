import { config as loadDotenv } from "dotenv";
import { getOnboardingPrisma, createOnboardingJourneyWithLink, reissueOnboardingMagicLink, revokeOnboardingAccess } from "../server/onboardingAccess";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isOnboardingEnabled } from "../server/onboardingAvailability.mjs";

const args = process.argv.slice(2);
const action = args[0];
const options = new Map<string, string>();
for (let index = 1; index < args.length; index += 2) {
  const key = args[index];
  const value = args[index + 1];
  if (!key?.startsWith("--") || !value || value.startsWith("--")) {
    process.stderr.write("Uso inválido. Consulte a documentação P1.2E para os comandos administrativos.\n");
    process.exit(2);
  }
  options.set(key.slice(2), value);
}

const required = (key: string) => {
  const value = options.get(key)?.trim();
  if (!value || value.length > 200 || /[\r\n\u0000-\u001f\u007f]/.test(value)) throw new Error(`missing_or_invalid_${key}`);
  return value;
};

const makeLink = (origin: string, token: string) => {
  const base = new URL(origin);
  if (base.username || base.password || base.pathname !== "/" || base.search || base.hash) throw new Error("invalid_origin");
  if (base.protocol !== "https:" && !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname))) {
    throw new Error("invalid_origin");
  }
  return `${base.origin}/cliente/onboarding#access_token=${encodeURIComponent(token)}`;
};

const ciEnvironmentKeys = [
  "CI",
  "GITHUB_ACTIONS",
  "GITLAB_CI",
  "BUILDKITE",
  "JENKINS_URL",
  "TF_BUILD",
  "TEAMCITY_VERSION",
  "CIRCLECI",
  "CODEBUILD_BUILD_ID"
] as const;

export type LinkOutputContext = {
  stdinIsTTY: boolean;
  stdoutIsTTY: boolean;
  env: Record<string, string | undefined>;
};

export type TrustedDatabaseIdentity = {
  databaseName: string;
  systemIdentifier: string;
};

export type DatabaseIdentityClient = {
  $queryRaw<T = unknown>(query: TemplateStringsArray, ...values: unknown[]): Promise<T>;
};

const isCi = (env: Record<string, string | undefined>) => ciEnvironmentKeys.some((key) => {
  const value = env[key]?.trim().toLowerCase();
  return Boolean(value && !["0", "false", "no", "off"].includes(value));
});

export const assertInteractiveLinkOutput = (context: LinkOutputContext) => {
  if (!context.stdinIsTTY || !context.stdoutIsTTY || isCi(context.env)) {
    throw new Error("interactive_terminal_required");
  }
};

export const writeMagicLinkToTerminal = (
  output: (text: string) => void,
  text: string,
  context: LinkOutputContext
) => {
  assertInteractiveLinkOutput(context);
  output(text);
};

export const readTrustedDatabaseIdentity = (env: Record<string, string | undefined>): TrustedDatabaseIdentity => {
  const databaseName = env.ONBOARDING_ADMIN_EXPECTED_DATABASE_NAME?.trim();
  const systemIdentifier = env.ONBOARDING_ADMIN_EXPECTED_PG_SYSTEM_IDENTIFIER?.trim();
  if (!databaseName || !/^[A-Za-z0-9_][A-Za-z0-9_$-]{0,62}$/.test(databaseName)) {
    throw new Error("database_identity_unverified");
  }
  if (!systemIdentifier || !/^\d{1,20}$/.test(systemIdentifier) || /^0+$/.test(systemIdentifier)) {
    throw new Error("database_identity_unverified");
  }
  return { databaseName, systemIdentifier };
};

export const assertTrustedDatabaseIdentity = async (
  client: DatabaseIdentityClient,
  expected: TrustedDatabaseIdentity
) => {
  let rows: Array<{ database_name: string; system_identifier: string }>;
  try {
    rows = await client.$queryRaw<Array<{ database_name: string; system_identifier: string }>>`
      SELECT current_database() AS database_name,
             system_identifier::text AS system_identifier
      FROM pg_control_system()
    `;
  } catch {
    throw new Error("database_identity_unverified");
  }

  if (rows.length !== 1 || rows[0]?.database_name !== expected.databaseName || rows[0]?.system_identifier !== expected.systemIdentifier) {
    throw new Error("database_identity_mismatch");
  }
};

const getLinkOutputContext = (): LinkOutputContext => ({
  stdinIsTTY: Boolean(process.stdin.isTTY),
  stdoutIsTTY: Boolean(process.stdout.isTTY),
  env: process.env
});

const main = async () => {
  // Trust pins must come from the parent process / secret manager, never from dotenv.
  const trustedDatabaseIdentityEnv = {
    ONBOARDING_ADMIN_EXPECTED_DATABASE_NAME: process.env.ONBOARDING_ADMIN_EXPECTED_DATABASE_NAME,
    ONBOARDING_ADMIN_EXPECTED_PG_SYSTEM_IDENTIFIER: process.env.ONBOARDING_ADMIN_EXPECTED_PG_SYSTEM_IDENTIFIER
  };

  if (!["create", "reissue", "revoke"].includes(action || "")) throw new Error("unknown_action");
  if (action === "create" || action === "reissue") assertInteractiveLinkOutput(getLinkOutputContext());
  loadDotenv();

  if (!isOnboardingEnabled()) throw new Error("onboarding_disabled");

  if (process.env.NODE_ENV === "production" || !["local", "staging"].includes(process.env.ONBOARDING_ADMIN_ENV || "")) {
    throw new Error("authorized_nonproduction_environment_required");
  }
  const operator = required("operator");
  const commercialReference = required("commercial-reference");
  const reason = required("reason");
  if (!process.env.DATABASE_URL?.trim()) throw new Error("database_unavailable");
  const trustedDatabaseIdentity = readTrustedDatabaseIdentity(trustedDatabaseIdentityEnv);
  const journeyId = action === "create" ? undefined : required("journey-id");
  const origin = action === "create" || action === "reissue" ? required("origin") : undefined;
  if (origin) makeLink(origin, "placeholder");
  const prisma = getOnboardingPrisma();

  try {
    await assertTrustedDatabaseIdentity(prisma, trustedDatabaseIdentity);

    if (action === "create") {
      const result = await createOnboardingJourneyWithLink(prisma, { operator, commercialReference, reason });
      writeMagicLinkToTerminal(
        (text) => { process.stdout.write(text); },
        `Jornada criada: ${result.journeyId}\nExpira em: ${result.expiresAt.toISOString()}\nLINK DE ACESSO — EXIBIDO UMA ÚNICA VEZ; NÃO COPIAR PARA LOGS:\n${makeLink(origin, result.token)}\n`,
        getLinkOutputContext()
      );
      return;
    }

    if (action === "reissue") {
      const result = await reissueOnboardingMagicLink(prisma, { journeyId, operator, commercialReference, reason });
      writeMagicLinkToTerminal(
        (text) => { process.stdout.write(text); },
        `Magic link reemitido para a jornada ${journeyId}. Expira em: ${result.expiresAt.toISOString()}\nLINK DE ACESSO — EXIBIDO UMA ÚNICA VEZ; NÃO COPIAR PARA LOGS:\n${makeLink(origin, result.token)}\n`,
        getLinkOutputContext()
      );
      return;
    }

    await revokeOnboardingAccess(prisma, { journeyId, operator, commercialReference, reason });
    process.stdout.write(`Acesso da jornada ${journeyId} revogado; links e sessões ativos invalidados.\n`);
  } finally {
    await prisma.$disconnect();
  }
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
    .catch((error: unknown) => {
      const code = error instanceof Error && /^[a-z_]+$/.test(error.message) ? error.message : "administrative_operation_failed";
      process.stderr.write(`Operação administrativa de onboarding não concluída (${code}). Nenhum segredo foi impresso.\n`);
      process.exitCode = 1;
    });
}
