# Página: Contato

## Status

- [x] Rascunho estratégico
- [ ] Revisado pelo time
- [ ] Aprovado
- [ ] Implementado

## Rota

`/contato`

## Função da página

Converter visitantes qualificados em conversa direta, coletando contexto suficiente para iniciar uma leitura consultiva.

A página de Contato não deve ser apenas um formulário genérico. Ela deve funcionar como uma entrada de diagnóstico.

## Promessa principal

Antes de indicar qualquer solução, a TAG08 entende o momento da marca para recomendar o caminho mais coerente.

## CTA principal

Enviar solicitação de contato

## CTA secundário

Falar pelo WhatsApp

## SEO

### Meta title

Contato TAG08 | Solicite um diagnóstico inicial

### Meta description

Fale com a TAG08 para entender o melhor caminho para sua presença digital, conteúdo, site, branding, processos ou estratégia de crescimento.

### H1

Vamos entender o melhor caminho para sua marca.

---

# Seção 01 — Hero de contato

## Função da seção

Acolher o visitante e explicar que o contato começa por entendimento, não por proposta pronta.

## Local recomendado

Primeira dobra da página `/contato`.

## Componente sugerido

`ContactHero`, `PageHero` ou `DiagnosticHero`.

## Conteúdo

### Eyebrow

Contato TAG08

### Título

Vamos entender o melhor caminho para sua marca.

### Subtítulo

Conte um pouco sobre seu momento, seus objetivos e o que está travando sua presença digital hoje. A partir disso, avaliamos se e como a TAG08 pode ajudar.

### CTA principal

Enviar solicitação de contato

### CTA secundário

Falar pelo WhatsApp

### Frase de apoio

A primeira conversa não é uma venda forçada. É uma leitura inicial para entender contexto, prioridade e fit.

## Observações de implementação

- CTA principal deve rolar para o formulário.
- CTA secundário pode abrir link do WhatsApp oficial.
- Inserir número real apenas quando confirmado.

---

# Seção 02 — Canais de contato

## Função da seção

Organizar caminhos de contato por intenção do visitante.

## Local recomendado

Após o Hero ou lateral do formulário.

## Componente sugerido

`ContactCards`, `ChannelCards` ou `ContactOptions`.

## Conteúdo

### Título

Escolha o melhor canal para começar

### Card 01 — Diagnóstico inicial

**Título:** Diagnóstico inicial  
**Texto:** Para empresas, profissionais ou marcas que querem entender qual solução faz mais sentido agora.  
**CTA:** Preencher formulário

### Card 02 — WhatsApp comercial

**Título:** WhatsApp comercial  
**Texto:** Para uma conversa mais direta com a equipe da TAG08. Ideal para dúvidas rápidas e primeiro contato.  
**CTA:** Chamar no WhatsApp

### Card 03 — Parcerias e indicações

**Título:** Parcerias e indicações  
**Texto:** Para representantes, parceiros, afiliados ou pessoas interessadas em indicar oportunidades para a TAG08.  
**CTA:** Quero ser parceiro

### Card 04 — Projetos em andamento

**Título:** Já sou cliente  
**Texto:** Para clientes ativos, o ideal é usar os canais oficiais definidos no onboarding, preservando histórico, prazo e contexto.  
**CTA:** Acessar canal oficial

## Observações de implementação

- O card “Já sou cliente” deve evitar que demandas operacionais entrem pelo formulário comercial.
- Se não houver área de cliente, direcionar para instrução simples: “Use o canal oficial definido com sua equipe TAG08”.

---

# Seção 03 — Formulário de qualificação

## Função da seção

Coletar dados suficientes para qualificar o lead sem criar atrito excessivo.

## Local recomendado

Centro da página.

## Componente sugerido

`ContactForm`, `DiagnosticForm` ou `LeadQualificationForm`.

## Conteúdo

### Título do formulário

Conte o que você precisa organizar

### Texto de apoio

Quanto mais claro for o contexto, melhor conseguimos entender se o caminho envolve estratégia, conteúdo, site, branding, audiovisual, processos ou outra solução.

## Campos recomendados

### Campo 01 — Nome

**Label:** Nome  
**Placeholder:** Seu nome completo

### Campo 02 — Empresa ou marca

**Label:** Empresa ou marca  
**Placeholder:** Nome do negócio, marca ou projeto

### Campo 03 — WhatsApp

**Label:** WhatsApp  
**Placeholder:** Informe seu número com DDD

### Campo 04 — Email

**Label:** Email  
**Placeholder:** seuemail@exemplo.com

### Campo 05 — Tipo de negócio

**Label:** Qual o tipo do seu negócio?  
**Opções sugeridas:**

- Empresa local
- Profissional liberal
- Clínica ou saúde
- Marca pessoal
- E-commerce ou varejo
- Serviço B2B
- Evento ou produção
- Outro

### Campo 06 — O que você busca agora?

**Label:** O que você precisa organizar primeiro?  
**Opções sugeridas:**

- Estratégia e posicionamento
- Gestão de redes sociais
- Produção audiovisual
- Site ou landing page
- Branding e identidade visual
- Processos e operação
- Hospedagem ou manutenção
- Ainda não sei

### Campo 07 — Principal desafio

**Label:** O que mais está travando hoje?  
**Placeholder:** Explique em poucas linhas o que motivou seu contato.

### Campo 08 — Presença digital atual

**Label:** Sua marca já tem presença digital ativa?  
**Opções sugeridas:**

- Sim, mas está desorganizada
- Sim, mas quero melhorar
- Tenho pouco ou quase nada
- Tenho site, mas não gera resultado
- Tenho redes sociais, mas sem consistência
- Ainda estou começando

### Campo 09 — Prazo ou urgência

**Label:** Existe alguma data ou urgência real?  
**Placeholder:** Informe se há lançamento, evento, campanha ou prazo específico.

### Campo 10 — Investimento

**Label:** Você já tem uma faixa de investimento prevista?  
**Opções sugeridas:**

- Ainda estou avaliando
- Até R$ 1.500/mês
- De R$ 1.500 a R$ 3.000/mês
- Acima de R$ 3.000/mês
- Projeto pontual
- Prefiro conversar primeiro

### Campo 11 — Mensagem adicional

**Label:** Quer acrescentar algo?  
**Placeholder:** Compartilhe links, referências ou informações importantes.

### Checkbox de consentimento

**Texto:** Autorizo a TAG08 a usar essas informações para analisar minha solicitação e retornar o contato pelos canais informados.

### Botão de envio

Enviar solicitação de contato

## Observações de implementação

- Não usar formulário excessivamente longo em mobile sem agrupamento.
- Campos essenciais: nome, WhatsApp, tipo de necessidade e desafio.
- Campo de investimento ajuda a qualificar, mas pode ser opcional.

---

# Seção 04 — Expectativa de resposta

## Função da seção

Reduzir ansiedade e explicar o que acontece depois do envio.

## Local recomendado

Abaixo do formulário ou lateral em desktop.

## Componente sugerido

`ResponseExpectation`, `NextSteps` ou `AfterSubmitBlock`.

## Conteúdo

### Título

O que acontece depois do envio?

### Etapas

#### 1. Leitura do contexto

A equipe analisa as informações enviadas para entender o momento e a necessidade principal.

#### 2. Primeiro retorno

Entramos em contato pelo canal informado para confirmar detalhes e, se fizer sentido, marcar uma conversa.

#### 3. Diagnóstico inicial

A primeira conversa ajuda a identificar se o caminho envolve estratégia, conteúdo, site, audiovisual, processos ou outra solução.

#### 4. Proposta, quando houver fit

Se houver alinhamento, montamos uma recomendação com escopo, entregas, responsabilidades e próximos passos.

### Texto de apoio

Não enviamos proposta genérica sem entender o mínimo do contexto. Isso protege o cliente, a equipe e a qualidade da entrega.

## Observações de implementação

- Pode aparecer em formato de timeline simples.
- Evitar prometer prazo exato de resposta se a operação não tiver SLA formal.

---

# Seção 05 — Fit de atendimento

## Função da seção

Qualificar expectativa e reduzir leads desalinhados.

## Local recomendado

Após expectativa de resposta.

## Componente sugerido

`FitSection`, `QualificationBlock` ou `GoodFitBadFit`.

## Conteúdo

### Título

A TAG08 faz mais sentido quando existe vontade de construir com direção.

### Bom fit

A TAG08 tende a fazer sentido para quem:

- entende que comunicação é investimento;
- quer clareza antes de execução;
- valoriza método, organização e acompanhamento;
- está disposto a colaborar com informações e aprovações;
- busca uma relação de parceria, não apenas fornecedor;
- quer crescer sem depender de improviso permanente.

### Baixo fit

Talvez a TAG08 não seja o melhor caminho para quem:

- quer apenas o menor preço;
- busca promessa de resultado imediato;
- não aceita diagnóstico;
- quer urgência constante sem planejamento;
- espera atendimento ilimitado fora de escopo;
- quer apenas “uns posts” sem pensar estratégia.

### Fechamento

Se você busca clareza, método e execução responsável, podemos conversar.

## Observações de implementação

- Tom firme, mas não agressivo.
- Importante para proteger energia comercial.

---

# Seção 06 — Privacidade e uso das informações

## Função da seção

Dar segurança sobre envio de dados.

## Local recomendado

Abaixo do formulário ou no rodapé da página de contato.

## Componente sugerido

`PrivacyNotice`, `LegalNotice` ou texto auxiliar do formulário.

## Conteúdo

### Título

Como usamos suas informações

### Texto

As informações enviadas pelo formulário são usadas apenas para analisar sua solicitação, entender o contexto do projeto e retornar o contato pelos canais informados.

A TAG08 não usa esses dados para prometer soluções automáticas nem compartilha informações comerciais sensíveis sem autorização.

### Texto curto para formulário

Seus dados serão usados apenas para análise da solicitação e retorno comercial.

## Observações de implementação

- Vincular à política de privacidade quando existir.
- Evitar juridiquês.

---

# Seção 07 — CTA final

## Função da seção

Reforçar a ação para quem rolou a página sem enviar o formulário.

## Local recomendado

Final da página.

## Componente sugerido

`FinalCTA`, `ContactCTA`.

## Conteúdo

### Título

Pronto para entender o próximo passo da sua marca?

### Texto

Envie seu contexto inicial e vamos avaliar qual caminho faz mais sentido para o seu momento.

### CTA principal

Enviar solicitação de contato

### CTA secundário

Falar pelo WhatsApp

## Observações de implementação

- CTA principal deve rolar para o formulário.
- CTA secundário abre WhatsApp.

---

# Mensagens do formulário

## Estado de sucesso

### Título

Solicitação enviada com sucesso.

### Texto

Recebemos suas informações. A equipe da TAG08 vai analisar seu contexto e retornar pelo canal informado.

### CTA

Voltar para o site

## Estado de erro

### Título

Não foi possível enviar sua solicitação.

### Texto

Revise os campos obrigatórios e tente novamente. Se o erro continuar, fale com a TAG08 pelo WhatsApp.

### CTA

Tentar novamente

## Campo obrigatório

Este campo é obrigatório.

## Email inválido

Informe um email válido.

## WhatsApp inválido

Informe um número com DDD.

---

# Checklist de qualidade da página Contato

- [ ] A página qualifica o lead antes da conversa?
- [ ] O formulário coleta contexto útil sem excesso de atrito?
- [ ] Há expectativa clara sobre o que acontece depois?
- [ ] O CTA principal é coerente?
- [ ] Há aviso de privacidade claro?
- [ ] A página evita promessa de proposta imediata?
- [ ] Existe caminho separado para cliente ativo e parceiro?
