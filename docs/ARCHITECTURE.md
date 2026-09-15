# TAG08 Web Architecture

## Base ativa

- Next.js 16 com App Router e `output: "standalone"`.
- Paginas publicas resolvidas por `src/app/[locale]/[[...segments]]/page.tsx` e pregeradas a partir de `src/config/routeRegistry.ts`.
- PT-BR usa URLs sem prefixo e e reescrito internamente para `/pt` por `src/proxy.ts`; EN e ES usam `/en` e `/es`.
- Alias sao redirecionamentos permanentes. O registry continua sendo a unica fonte de verdade para canonicos, alias, casos e sitemap.
- Cases dependem de `src/content/publicEvidence.ts`: um item pendente nao pode resolver rota, ser pregerado ou entrar no sitemap, mesmo que seus dados permaneçam em `src/data.ts` para revisão.
- Metadata, canonical, hreflang, Open Graph e JSON-LD sao gerados no servidor em `src/lib/seo.ts`.
- `src/features/site/SiteShell.tsx` contem apenas a experiencia cliente: navegacao, animacao, analytics, Lenis, formularios e normalizacao temporaria de hashes legados.
- Publicacao multilingue e controlada por rota em `routeRegistry.ts`. Uma lingua so e publicada quando a pagina completa, seus fluxos de conversao e a revisao editorial existem naquele idioma. PT-BR e a lingua segura por padrao; o onboarding e a excecao atual com PT, EN e ES completos.
- URLs de idiomas ainda nao publicados redirecionam para a pagina PT-BR canonica. Isso elimina paginas resumidas, evita conteudo enganoso e protege a paridade funcional.
- `src/i18n/localizationReadiness.ts` e o segundo gate: registra o componente-fonte, o estado editorial e uma assinatura SHA-256. Uma mudanca no conteudo-fonte invalida a revisao EN/ES no CI ate que a traducoes sejam atualizadas e aprovadas.

## API e contratos

- Route Handlers preservam os paths atuais: `/api/onboarding`, `/api/onboarding/health`, `/api/onboarding/metrics` e `/api/official-content`.
- A validacao e os formatos de resposta continuam centralizados em `server/onboardingContract.ts` e `server/officialContent.ts`.
- A fila local do onboarding continua no cliente, com a mesma chave e politica de reenvio.

## Operacao

- A hospedagem Node.js da TAG08 executa `npm start`, que inicia o servidor standalone gerado pelo Next por proxy na porta interna `3000`.
- Staging deve validar URLs canonicas, alias, APIs, sitemap e HTML sem JavaScript antes do corte.
- O release anterior permanece disponivel como rollback ate a estabilizacao do Next.
