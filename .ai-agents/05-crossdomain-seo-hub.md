# AGENTE 05 - crossdomain-seo-hub

Objetivo:
- Consolidar o contrato de SEO e links entre o domínio principal `tag08.com.br` e os subdomínios do ecossistema.

Escopo:
- `docs/ARCHITECTURE.md`
- `docs/ROUTES.md`
- `.ai-agents/README.md`
- Blocos de ecossistema e rodapés dos LPs listados quando houver código local:
  - `LandingPage_hospedagem_TAG08`
  - `LandingPage_Influenciador_TAG08`
  - `LandingPage_plano-base-_TAG08`
  - `LandingPage_ProcessActivation_TAG08`
  - `LandingPage_Process Inteligente _TAG08`

Mapa de rede declarado:
- Core: `https://tag08.com.br`
- Hospedagem: `https://hospedagem.tag08.com.br` - PT-BR / EN / ES
- Influenciador: `https://influenciador.tag08.com.br` - PT-BR / EN / ES
- Processo Inteligente: `https://processo.tag08.com.br` - PT-BR / EN / ES
- Process Activation: `https://processos.tag08.com.br` - PT-BR / EN / ES
- Plano Base: `https://plano-base.tag08.com.br` - PT-BR / EN / ES
- Fonte de contrato da rede no código: `src/config/siteNetwork.ts`

Tarefas:
1. Declarar um mapa único de propriedades em `docs/ARCHITECTURE.md` e `docs/ROUTES.md`.
2. Padronizar `canonical` por projeto para o domínio correto.
3. Eliminar links sem destino em blocos de ecossistema.
4. Registrar critérios de revisão e owner na `.ai-agents/README.md`.
5. Garantir PT-BR/EN/ES em contratos SEO e links ativos.

Critérios de aceite:
- Canonical de cada projeto aponta para URL real.
- Blocos de ecossistema têm apenas links ativos para URLs existentes.
- Não existe propriedade suspensa sem trilha de conversão.
- O handoff registra impacto, risco e próximo passo.

Estado:
- A fonte única de rede está sincronizada em `src/config/siteNetwork.ts` e nos documentos.
- Os subdomínios esperados seguem a estrutura recebida.
- Próximo ciclo recomendado: validar os rodapés dos projetos LP externos no próprio repositório e atualizar textos quebrados de CTA.

## Handoff operacional - SEO/cross-domain

- Escopo local executado: páginas `HospedagemManutencaoSites`, `GestaoRedesSociais`, `ProcessIntelligence`, `ProcessActivation`, além de `siteI18n`, `Footer` e `siteNetwork`.
- LPs pendentes fora do repositório: `LandingPage_plano-base-_TAG08` e variações futuras por subdomínio.
- Critérios mínimos para handoff:
  - canonical por idioma;
  - `hreflang` válido;
  - termos de navegação e menus consistentes;
  - texto jurídico e LGPD por idioma.
