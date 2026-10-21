import "dotenv/config";
import { getOnboardingPrisma, createOnboardingJourneyWithLink, reissueOnboardingMagicLink, revokeOnboardingAccess } from "../server/onboardingAccess";

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

const main = async () => {
  if (process.env.NODE_ENV === "production" || !["local", "staging"].includes(process.env.ONBOARDING_ADMIN_ENV || "")) {
    throw new Error("authorized_nonproduction_environment_required");
  }
  const operator = required("operator");
  const commercialReference = required("commercial-reference");
  const reason = required("reason");
  if (!process.env.DATABASE_URL?.trim()) throw new Error("database_unavailable");
  const prisma = getOnboardingPrisma();

  if (action === "create") {
    const origin = required("origin");
    makeLink(origin, "placeholder");
    const result = await createOnboardingJourneyWithLink(prisma, { operator, commercialReference, reason });
    process.stdout.write(`Jornada criada: ${result.journeyId}\nExpira em: ${result.expiresAt.toISOString()}\nLINK DE ACESSO — EXIBIDO UMA ÚNICA VEZ; NÃO COPIAR PARA LOGS:\n${makeLink(origin, result.token)}\n`);
    return;
  }

  const journeyId = required("journey-id");
  if (action === "reissue") {
    const origin = required("origin");
    makeLink(origin, "placeholder");
    const result = await reissueOnboardingMagicLink(prisma, { journeyId, operator, commercialReference, reason });
    process.stdout.write(`Magic link reemitido para a jornada ${journeyId}. Expira em: ${result.expiresAt.toISOString()}\nLINK DE ACESSO — EXIBIDO UMA ÚNICA VEZ; NÃO COPIAR PARA LOGS:\n${makeLink(origin, result.token)}\n`);
    return;
  }
  if (action === "revoke") {
    await revokeOnboardingAccess(prisma, { journeyId, operator, commercialReference, reason });
    process.stdout.write(`Acesso da jornada ${journeyId} revogado; links e sessões ativos invalidados.\n`);
    return;
  }
  throw new Error("unknown_action");
};

main()
  .catch((error: unknown) => {
    const code = error instanceof Error && /^[a-z_]+$/.test(error.message) ? error.message : "administrative_operation_failed";
    process.stderr.write(`Operação administrativa de onboarding não concluída (${code}). Nenhum segredo foi impresso.\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await getOnboardingPrisma().$disconnect();
    } catch {
      // A execução pode falhar antes de abrir a conexão.
    }
  });
