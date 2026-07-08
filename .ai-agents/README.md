# Diretrizes de Execução com `.ai-agents`

Objetivo:
- Fechar os pontos críticos do projeto TAG08 de ponta a ponta, com separação por camadas e trilha rastreável.

Fluxo sugerido:
1. `backend-and-integration`
2. `content-and-encoding`
3. `route-and-governance`
4. `validation-and-release`
5. `crossdomain-seo-hub`

## Handoff atual

### Concluído
- Endpoint mínimo de onboarding em `server/index.ts` com contrato versionado.
- Fila local de fallback no onboarding com retry controlado.
- Registry único de rotas em `src/config/routeRegistry.ts`.
- Sitemap gerado a partir do mesmo registry.
- Rede cross-domain consolidada em `src/config/siteNetwork.ts`.
- Base estratégica da TAG08 consolidada em `docs/TAG08_KNOWLEDGE_SYSTEM.md`.
- Build e typecheck passam após correção dos blocos JSX quebrados.

### Riscos abertos
- Encoding residual ainda existe em trechos longos de texto do frontend e de documentos auxiliares.
- O playbook de release ainda precisa ser seguido com disciplina humana; não há automação de smoke test além do build.
- As landing pages externas não estão versionadas neste repositório local.

### Próximo passo recomendado
- `content-and-encoding`: limpeza final de textos visíveis e documentos.
- `validation-and-release`: checklist curto, monitoramento e validação manual antes de subir.

## Regras gerais

- Trabalhar no repositório atual sem inventar nova stack.
- Entregar mudanças mínimas e funcionais primeiro.
- Registrar impacto, risco e critérios de aceite ao final.
- Não tocar em arquivos já resolvidos por outro agente sem justificar o conflito.

## Estado alvo

- Onboarding com envio real ou fallback controlado e documentado.
- SEO e estruturas técnicas coerentes.
- Documentação mínima de arquitetura e rotas.
- Persistência local e acessibilidade sem regressões óbvias.
- Texto em UTF-8 consistente por língua.

## Execução

- Cada agente deve retornar: `Concluído`, `Risco`, `Pendências`, `Próximo passo`.
- Arquivos modificados devem ficar listados no bloco final.

## Handoff operacional

- LP externa pendente: `LandingPage_plano-base-_TAG08`.
- Critérios de entrega para cada LP externa:
  - canonical por idioma alinhado ao domínio alvo;
  - `hreflang` com `x-default`, `pt-BR`, `en-US`, `es-ES`;
  - `alternate` e crosslink documentados em `siteNetwork`;
  - bloco de LGPD e cookies com labels por idioma consistentes;
  - checklist de aprovação jurídica e comercial para promessas e prazo.
