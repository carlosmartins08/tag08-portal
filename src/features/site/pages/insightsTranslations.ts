import { BLOG_POSTS, type EditorialBlogPost } from "../../../data";
import type { RouteLocale } from "../../../config/routeRegistry";

/** Editorial draft translations. They are intentionally not an approval/readiness signal. */
export type InsightsLocale = "en" | "es";

type ArticleTranslation = Omit<Pick<EditorialBlogPost, "title" | "excerpt" | "content" | "category" | "serviceTitle" | "author" | "relatedObjection">, "category"> & {
  category: string;
  readingTime: string;
};

export type LocalizedEditorialBlogPost = Omit<EditorialBlogPost, "category"> & { category: string };
const EN: Record<string, ArticleTranslation> = {
  "conteudo-estrategico-apoia-decisoes": {
    title: "Strategic content: turning communication into support for better decisions",
    excerpt: "Content does not need to sell all the time. It should help people recognize problems, understand alternatives, reduce doubts, and approach their next decision better prepared.",
    category: "Strategy",
    serviceTitle: "Strategic Marketing Advisory",
    author: "TAG08 Editorial Team",
    readingTime: "2 min read",
    relatedObjection: "If a company publishes regularly but has no clear logic connecting communication, positioning, the customer journey, and its goals, the issue may come before the content calendar.",
    content: `A company can produce visually excellent material and still make its sales team explain everything from scratch.

That happens when communication serves an aesthetic purpose but does not help the audience understand the business.

Strategic content starts before the format. The first question is not whether the company should make Reels, a carousel, a video, or an article. It is:

**what does our audience need to understand to make a better decision?**

### Content is not there to fill a calendar

Every topic should serve a purpose.

It can:

- help someone recognize a problem;
- explain a concept;
- address an objection;
- compare alternatives;
- show how the company thinks;
- demonstrate a process;
- reduce risk;
- prepare a business conversation.

Without a defined purpose, a brand can publish a lot and build very little.

### Attention is not the same as intent

Likes, views, and reach help explain distribution, but they do not show on their own whether content improved a decision.

An article seen by few people can be highly valuable if it answers exactly the question a decision-maker has.

The metric should therefore match the content's purpose.

### Content also qualifies

A company that explains how it works, what it considers important, and where its limits are is more likely to receive better-contextualized conversations.

The potential client arrives with a clearer understanding of the problem, the solution, and the criteria for choosing.

That improves the sales conversation without turning every post into an ad.

### A practical question

Before increasing content volume, take inventory:

- Which questions come up repeatedly?
- Which objections stall proposals?
- What does the sales team have to explain every week?
- Which concepts do clients confuse?
- Which decisions need more context?

Each recurring question may point to a useful topic.`
  },
  "marketing-ou-processo-problema-vendas": {
    title: "Marketing or process? How to tell when a sales problem starts in operations",
    excerpt: "Not every sales difficulty comes from a lack of promotion. Before increasing media spend and content, check whether the operation can make good use of the opportunities it already receives.",
    category: "Processes",
    serviceTitle: "Process Intelligence",
    author: "TAG08 Process Consultants",
    readingTime: "2 min read",
    relatedObjection: "When a symptom appears in sales, service, or rework but its cause is unclear, map the operation before investing in more acquisition.",
    content: `A company can increase traffic, content, and lead generation and still sell poorly.

The problem may not be a lack of demand.

It may be the path an opportunity takes after it arrives.

### Some signs appear quickly

- leads go unanswered;
- no one knows who should take ownership of an opportunity;
- each salesperson follows a different approach;
- proposals go out without follow-up;
- information is scattered across WhatsApp;
- reasons for lost deals are not recorded;
- marketing and sales work from different versions of reality.

When this happens, bringing in more opportunities may simply increase the number of problems entering the system.

### How to distinguish marketing from process

If few opportunities arrive, acquisition may be the issue.

If opportunities arrive but are a poor fit, review the audience, message, and offer.

If good opportunities arrive but service, follow-up, or proposals are inconsistent, the bottleneck is probably in operations.

If a sale closes but delivery creates conflict, the problem may sit even further downstream.

### Process does not mean bureaucracy

Process means making these things clear:

- owners;
- decisions;
- sequence;
- required information;
- criteria;
- exceptions;
- records.

The goal is not to make people fill out more documents.

It is to reduce dependence on improvisation.

### Automating before organizing increases risk

CRM, automation, and AI can speed up a workflow.

But if the workflow is wrong, technology speeds up the mistake too.

So the question to ask before choosing a tool is:

**how does this process actually work today?**`
  },
  "site-inteligencia-artificial-seo-estrutura": {
    title: "Is your website ready to be understood by people, search engines, and AI systems?",
    excerpt: "A useful website explains the business, its offer, and the next step clearly to people and to systems that search, summarize, compare, and recommend information.",
    category: "Web and Technology",
    serviceTitle: "Web Development",
    author: "TAG08 Development Team",
    readingTime: "2 min read",
    relatedObjection: "When a website exists but does not explain the company, its offer, and the next step clearly, optimization should begin with structure.",
    content: `Search has changed.

Companies want to appear on Google, and they also want to be understood by systems that search, summarize, compare, and recommend information.

That does not make the fundamentals less important.

It makes clarity even more important.

### Before thinking about AI, the website must be able to explain the business

A service page should make these points clear:

- what the service is;
- who it is for;
- which problem it addresses;
- how it works;
- what may be included;
- where its limits are;
- which questions are common;
- what the next step is.

If a person cannot understand this easily, no optimization technique can fully compensate for the problem.

### Architecture communicates too

Headings, specific pages, internal links, and information hierarchy help systems understand relationships.

Mentioning many keywords is not enough.

Context has to be built.

### SEO and AI are not opposing strategies

Content structured well for search also tends to be easier for generative systems to understand:

- clear language;
- well-defined entities;
- direct answers;
- original information;
- coherent links;
- trustworthy sources.

### Structured data helps, but it does not replace content

Schema can make technical interpretation easier.

It cannot turn weak content into a relevant source.

### The final goal is still the business

Being cited by AI or appearing in search only matters if people find useful information and can move forward.

Discovery without a good experience ends in wasted traffic.`
  },
  "novos-influenciadores": {
    title: "Influencers: reach matters less when context is missing",
    excerpt: "A smaller community can influence a specific decision more than a huge profile with no real connection to the subject. Fit and purpose matter more than audience size alone.",
    category: "Acquisition and Media",
    serviceTitle: "Strategic Marketing Advisory",
    author: "TAG08 Editorial Team",
    readingTime: "1 min read",
    relatedObjection: "When a partnership starts with choosing an influencer instead of defining an objective, organize the strategy before making the selection.",
    content: `Influence does not mean having a large audience.

Someone with a smaller community may have more influence over a specific decision than a very large profile with no real connection to the topic.

Before hiring an influencer, ask:

- Does this audience fit our offer?
- Does the subject make sense for this profile?
- Has trust been built?
- Does the format fit the message?
- What behavior do we expect to encourage?

### The common mistake

The brand chooses based on appearance, reach, or follower count.

Then it tries to fit the offer into the choice.

The order should be reversed.

First define what the partnership needs to accomplish.

Then find someone who can fulfill that role.`
  },
  "objetivo-de-campanha-antes-de-anunciar": {
    title: "Before advertising: what problem should the campaign solve?",
    excerpt: "Google, Meta, or LinkedIn comes later. First define the expected behavior, offer, audience, and success criteria.",
    category: "Acquisition and Media",
    serviceTitle: "Strategic Marketing Advisory",
    author: "TAG08 Editorial Team",
    readingTime: "2 min read",
    relatedObjection: "Google, Meta, or LinkedIn comes later. First define the expected behavior, offer, audience, and success criteria.",
    content: `Conversations about media often start with the platform.

Google or Instagram?

How much should we invest?

Which audience should we target?

Those are execution questions.

There is an earlier one:

**what does this campaign need to accomplish?**

### “I want to sell more” is too broad

A campaign may be designed to:

- generate awareness;
- capture existing demand;
- validate a message;
- generate assessments;
- re-engage opportunities;
- encourage a return visit;
- test an offer.

Each purpose changes the message, page, audience, and metric.

### Platform results and business results are not the same

A click is not a sale.

A form submission is not a customer.

A lead is not necessarily an opportunity.

The campaign needs to connect to the sales process so analysis can continue after the digital conversion.

### The page and service experience matter too

An ad can do its job perfectly and send someone to:

- a confusing page;
- an unanswered WhatsApp message;
- a generic proposal;
- an unprepared team.

In that case, the problem is not necessarily the campaign.

### Seven questions to answer before buying media

1. What problem are we trying to solve?
2. Who experiences this problem?
3. What behavior do we want to encourage?
4. Which offer responds best?
5. What message needs to be understood?
6. How will we record progress?
7. What will show that we learned or moved forward?

Only then should we choose a channel and budget.`
  },
  "jornada-do-consumidor-conteudo-decisoes": {
    title: "The customer journey: what does your audience need to understand before deciding?",
    excerpt: "Review your content calendar with this question: what does a person need to understand at this stage?",
    category: "Content and Social Media",
    serviceTitle: "Social Media Management",
    author: "TAG08 Editorial Team",
    readingTime: "1 min read",
    relatedObjection: "Review your content calendar with this question: what does a person need to understand at this stage?",
    content: `The customer journey is not a straight line.

Someone may discover a brand, disappear, return through Google, check reviews, watch a video, and only then start a conversation.

The goal is not to control every path.

It is to make sure useful answers are available when questions arise.

### Discovery

The main question is:

**What is happening?**

Content helps people recognize symptoms and name problems.

### Consideration

The main question is:

**Which paths are available?**

This is where comparisons, criteria, risks, and alternatives matter.

### Decision

The main question is:

**Which solution and provider make sense?**

Process, evidence, scope, and next steps become important.

### Relationship

After a contract is signed, content can also align expectations, teach people how to use a solution, and improve the experience.

### The mistake

Repeating the same message at every stage.

A brand that only offers a quote is speaking to people who have already decided.

A brand that only educates may never connect what it teaches to a solution.`
  },
  "gerar-leads-google-ads-pre-requisitos": {
    title: "Google Ads generates leads. Can your company make good use of them?",
    excerpt: "More leads do not necessarily mean more opportunities. Quality and what happens after a contact arrives matter more.",
    category: "Acquisition and Media",
    serviceTitle: "Strategic Marketing Advisory",
    author: "TAG08 Editorial Team",
    readingTime: "1 min read",
    relatedObjection: "Before increasing investment, review the offer, landing page, measurement, and sales process.",
    content: `More leads do not necessarily mean more opportunities.

What matters is their quality and what happens after a contact arrives.

### 1. Offer

People need to understand what is being offered and who it makes sense for.

### 2. Page

The destination should continue the promise made in the ad.

A useful page answers quickly:

- what it is;
- who it is for;
- which problem it addresses;
- why someone should consider it;
- what the next step is.

### 3. Measurement

Cost per lead alone can be misleading.

Track quality, progress, proposals, and business outcomes too.

### 4. Service

A conversion can be lost minutes later because of:

- delays;
- no clear owner;
- a generic response;
- no follow-up.

### Scale comes later

If the offer, page, measurement, and sales process still have problems, increasing spend only expands inefficiency.`
  },
  "consideracao-funil-reduzir-duvidas": {
    title: "Consideration: content that helps clients compare before deciding",
    excerpt: "Between recognizing a problem and hiring someone is a decisive stage: understanding alternatives, evaluating risk, and building criteria.",
    category: "Strategy",
    serviceTitle: "Strategic Marketing Advisory",
    author: "TAG08 Editorial Team",
    readingTime: "1 min read",
    relatedObjection: "Between recognizing a problem and hiring someone is a decisive stage: understanding alternatives, evaluating risk, and building criteria.",
    content: `When companies look alike, comparison tends to come down to price.

That is why consideration-stage communication should help clients understand real differences.

### Explain the criteria

A brand can teach people:

- when a service makes sense;
- when it does not;
- what changes between alternatives;
- which risks exist;
- what to evaluate in a proposal.

This does not mean attacking competitors.

It means improving the quality of the decision.

### Objections are useful topics

“It is expensive.”

“I can do it in-house.”

“I have tried before.”

“I do not have time.”

These statements contain questions content can address helpfully.

### Evidence needs context

A case study without context is just a claim.

Process, decisions, and reasoning do much more to build trust.`
  },
  "youtube-para-empresas-consideracao": {
    title: "YouTube for business: when depth helps clients make a decision",
    excerpt: "Some questions, comparisons, and demonstrations need more time than a short video can provide.",
    category: "Content and Social Media",
    serviceTitle: "Audiovisual Production",
    author: "TAG08 Editorial Team",
    readingTime: "1 min read",
    relatedObjection: "Some questions, comparisons, and demonstrations need more time than a short video can provide.",
    content: `Not every decision fits into thirty seconds.

Consultative services, technical solutions, and higher-risk purchases need context.

### YouTube can work as a library

Videos can explain:

- processes;
- comparisons;
- demonstrations;
- objections;
- case studies;
- technical decisions.

### Depth can build trust

Authority does not depend on appearing to be an expert.

It depends on being able to explain a complex problem in an understandable way.

### Sales teams can use content too

A useful video can be shared after a meeting, before a proposal, or to answer a recurring question.

That turns audiovisual content into a business asset.`
  },
  "campanha-ideal-mensurar-resultados": {
    title: "The right campaign starts with the objective, not the platform",
    excerpt: "Choose a channel only after defining the outcome, audience, and behavior the campaign should encourage.",
    category: "Acquisition and Media", serviceTitle: "Strategic Marketing Advisory", author: "TAG08 Editorial Team", readingTime: "1 min read",
    relatedObjection: "The channel comes after defining the outcome, audience, and behavior expected from the campaign.",
    content: `Choosing a campaign by channel puts the decision in the wrong order.

First answer:

- Do we want to generate awareness?
- Consideration?
- Demand?
- Conversion?
- Learning?

Then define:

- message;
- audience;
- channel;
- budget;
- metric.

The right media choice follows from the purpose the campaign needs to fulfill.`
  },
  "levar-negocio-para-o-digital-com-estrutura": {
    title: "Going digital without organizing operations can amplify disorganization",
    excerpt: "A website, Instagram, and e-commerce do not replace a clear offer, service, ownership, and process.",
    category: "Web and Technology", serviceTitle: "Web Development", author: "TAG08 Editorial Team", readingTime: "1 min read",
    relatedObjection: "A website, Instagram, and e-commerce do not replace a clear offer, service, ownership, and process.",
    content: `Opening channels is easy.

Delivering on what they promise is another matter.

Before expanding a digital presence, a company should assess:

### Offer

Is it clear what we sell?

### Information

Are products, services, prices, policies, and content organized?

### Service

Who receives new opportunities?

### Conversion

What do we expect people to do?

### Ownership

Who maintains each channel?

### Operations

Can the company deliver the promised experience?

### Measurement

Can we learn from what happens?

### E-commerce makes the issue visible

An online store does not create reliable inventory, logistics, commercial policies, or customer service by itself.

Technology exposes the operation.`
  },
  "ferramentas-gratuitas-expansao": {
    title: "Tools can help organize work, but they cannot decide how operations should run",
    excerpt: "Tools work best when objectives, owners, inputs, outputs, and routine decisions are already clear.",
    category: "Processes", serviceTitle: "Process Intelligence", author: "TAG08 Editorial Team", readingTime: "1 min read",
    relatedObjection: "Tools help when objectives, owners, inputs, outputs, and routine decisions are already clear.",
    content: `Software does not create a method.

Spreadsheets, automation, CRMs, and free tools can improve a routine when there is already clarity about:

- objective;
- owner;
- input;
- output;
- decision;
- record.

Without that, a company only digitizes confusion.

### Before choosing a tool

Map:

1. what happens;
2. who participates;
3. where decisions are made;
4. what information is needed;
5. what must be recorded.

Then look for technology that fits the work.`
  },
  "consumidores-conscientes": {
    title: "Audiences are more discerning. Does your communication reflect that?",
    excerpt: "Clients research, compare, and consult reviews. Communication needs to respect the context and knowledge they bring.",
    category: "Content and Social Media", serviceTitle: "Social Media Management", author: "TAG08 Editorial Team", readingTime: "1 min read",
    relatedObjection: "Clients research, compare, and consult reviews. Communication needs to respect the context and knowledge they bring.",
    content: `Clients can research, compare, read reviews, and arrive at a conversation with useful context.

That makes communication that respects people's intelligence and situation more important.

This audience tends to value:

- consistency;
- useful information;
- transparency;
- specificity;
- direct answers;
- clear limits.

Promising everything may build less trust than explaining well what can actually be delivered.`
  },
  "transformacao-digital-erros": {
    title: "Digital transformation: three mistakes that modernize tools but preserve the problem",
    excerpt: "Modern systems do not fix confused workflows if responsibilities, decisions, and information remain disorganized.",
    category: "Processes", serviceTitle: "Process Intelligence", author: "TAG08 Editorial Team", readingTime: "1 min read",
    relatedObjection: "Modernizing systems does not fix confused workflows when responsibilities, decisions, and information remain disorganized.",
    content: `Digitization is not simply putting software on top of an old routine.

Three mistakes appear often.

### 1. Buying technology before understanding the process

The tool starts reproducing a confusing workflow.

### 2. Creating channels without defining their purpose

The company accumulates a website, social networks, a CRM, and automation without clarity about each one's role.

### 3. Changing the interface without changing operations

The experience looks modern, but decisions, responsibilities, and data remain disorganized.

### A safer sequence

Understand â†’ model â†’ validate â†’ structure â†’ develop â†’ test â†’ activate.`
  },
  "influenciadores-virtuais": {
    title: "Virtual influencers are a tool. Strategy is still the decision.",
    excerpt: "Virtual influencers can attract attention, but they need to serve a clear strategic purpose for the brand.",
    category: "Acquisition and Media", serviceTitle: "Strategic Marketing Advisory", author: "TAG08 Editorial Team", readingTime: "1 min read",
    relatedObjection: "Virtual influencers can attract attention, but they need to serve a clear strategic purpose for the brand.",
    content: `New technology attracts attention.

But attention does not answer:

- For whom?
- For what purpose?
- In which context?
- With which message?
- To encourage which behavior?

Virtual influencers can be useful when they reinforce a brand's point of view.

When they are used only because they are new, they may generate curiosity without building meaningful positioning.`
  },
  "como-anunciar-no-google": {
    title: "Google Ads: choose a network based on intent, not format",
    excerpt: "Search, YouTube, Display, and Shopping serve different purposes. Choose based on what the campaign needs to influence.",
    category: "Acquisition and Media", serviceTitle: "Strategic Marketing Advisory", author: "TAG08 Editorial Team", readingTime: "1 min read",
    relatedObjection: "Search, YouTube, Display, and Shopping serve different purposes. Choose based on what the campaign needs to influence.",
    content: `Search, YouTube, Display, and Shopping do not serve the same purpose.

### Search

Captures demand people have already expressed.

### YouTube

Can support discovery, consideration, and explanation.

### Display

Can support reach, recall, and re-engagement.

### Shopping

Makes sense when there is a structured catalog and product intent.

The question is not:

Which network is best?

It is:

**Which behavior do we need to influence?**`
  },
  "manutencao-de-site-seguranca-performance": {
    title: "A website's work does not end at launch: what to maintain afterward",
    excerpt: "Security, backups, forms, content, and performance belong in the routine of a website that supports a business.",
    category: "Web and Technology", serviceTitle: "Website Hosting and Maintenance", author: "TAG08 Editorial Team", readingTime: "2 min read",
    relatedObjection: "Security, backups, forms, content, and performance need ongoing attention on a website that supports the business.",
    content: `A website can be online and already be failing.

A form can stop sending.

Information can become outdated.

An integration can break.

The problem is that many failures only become visible after someone experiences a consequence.

### What to monitor

**Updates**
Dependencies and features need maintenance.

**Security**
The risk surface changes over time.

**Backups**
Their frequency should match how the site changes.

**Performance**
The goal is not a perfect score, but a consistently good experience.

**Forms**
Every contact point should be tested.

**Content**
Outdated information is also a failure.

**Technical SEO**
Links, pages, and indexing need attention.

**Infrastructure**
Availability and hosting still matter.

### Preventive maintenance does not mean zero failures

It means improving the chance of finding and fixing problems before they have a greater impact.`
  },
  "facebook-vender-mais": {
    title: "Does Facebook still work? It depends on the role it plays in the strategy",
    excerpt: "Facebook's usefulness depends on the audience, the channel's purpose, and its connection to service and strategy.",
    category: "Content and Social Media", serviceTitle: "Social Media Management", author: "TAG08 Editorial Team", readingTime: "1 min read",
    relatedObjection: "Facebook's usefulness depends on the audience, the channel's purpose, and its connection to service and strategy.",
    content: `Asking whether a platform still works can oversimplify the decision.

Facebook may still matter for specific audiences, contexts, and goals.

The better question is:

**Is our audience here, and does this channel have a clear purpose?**

When it does, the channel needs:

- an appropriate message;
- a compatible audience;
- a relevant destination;
- a connection to customer service;
- a measurable objective.

With those elements, the platform can play a useful role. Without them, increasing posting frequency is unlikely to help.`
  },
  "automacao-marketing-vendas": {
    title: "Marketing automation does not fix a bad process. It runs it faster.",
    excerpt: "Before automating messages, assignment, and follow-up, a company needs to know which journey it wants to automate.",
    category: "Processes", serviceTitle: "Process Intelligence", author: "TAG08 Editorial Team", readingTime: "1 min read",
    relatedObjection: "Before automating messages, assignment, and follow-up, a company needs to know which journey it wants to automate.",
    content: `Automation can free up time, reduce repetitive tasks, and improve consistency.

But it depends on rules.

Before configuring triggers, establish:

- who enters the workflow;
- why they enter;
- what information is available;
- which message makes sense;
- what action is expected;
- when a person needs to take over;
- when the workflow should stop.

### The mistake

A company notices disorganization and buys a tool.

Then it tries to adapt its routine to the software.

The result is often a confusing process executed faster.

### A better sequence

First, map the process.

Then, assign responsibility.

Next, validate the rules.

Only then, automate.

### Automation should expand capacity

It is most useful when it removes mechanical effort without removing the context people need for decisions that still require human judgment.`
  }
};


const ES: Record<string, ArticleTranslation> = {
  "conteudo-estrategico-apoia-decisoes": {
    title: "Contenido estratégico: convertir la comunicación en apoyo para decidir mejor",
    excerpt: "El contenido no tiene que vender todo el tiempo. Debe ayudar al público a reconocer problemas, entender alternativas, resolver dudas y llegar mejor preparado a su próxima decisión.",
    category: "Estrategia", serviceTitle: "Asesoría de Marketing Estratégico", author: "Equipo Editorial TAG08", readingTime: "2 min de lectura",
    relatedObjection: "Si la empresa publica, pero no conecta con claridad comunicación, posicionamiento, recorrido del cliente y objetivos, el problema puede estar antes del calendario editorial.",
    content: `Una empresa puede producir materiales visualmente excelentes y aun así obligar al equipo comercial a explicarlo todo desde cero.

Esto ocurre cuando la comunicación cumple una función estética, pero no ayuda al público a comprender el negocio.

El contenido estratégico empieza antes del formato. La primera pregunta no es si la empresa hará Reels, un carrusel, un video o un artículo. Es:

**¿qué necesita entender nuestro público para tomar una mejor decisión?**

### El contenido no existe para llenar un calendario

Cada tema debería cumplir una función.

Puede:

- ayudar a reconocer un problema;
- explicar un concepto;
- responder una objeción;
- comparar alternativas;
- mostrar cómo piensa la empresa;
- demostrar un proceso;
- reducir riesgos;
- preparar una conversación comercial.

Sin una función definida, una marca puede publicar mucho y construir poco.

### La atención no es lo mismo que la intención

Los Me gusta, las visualizaciones y el alcance ayudan a entender la distribución, pero por sí solos no muestran si el contenido mejoró una decisión.

Un artículo visto por pocas personas puede ser muy valioso si responde exactamente la duda de quien toma una decisión.

Por eso, la métrica debe acompañar la función del contenido.

### El contenido también ayuda a calificar

Una empresa que explica cómo trabaja, qué considera importante y cuáles son sus límites tiende a recibir conversaciones con más contexto.

El cliente potencial llega entendiendo mejor el problema, la solución y los criterios de elección.

Esto mejora la conversación comercial sin convertir cada publicación en un anuncio.

### Una pregunta práctica

Antes de aumentar el volumen de contenido, haz un inventario:

- ¿Qué dudas aparecen repetidamente?
- ¿Qué objeciones frenan las propuestas?
- ¿Qué tiene que explicar el equipo comercial cada semana?
- ¿Qué conceptos confunden los clientes?
- ¿Qué decisiones necesitan más contexto?

Cada pregunta recurrente puede indicar un tema útil.`
  },
  "marketing-ou-processo-problema-vendas": {
    title: "¿Marketing o procesos? Cómo saber cuándo el problema de ventas está en la operación",
    excerpt: "No toda dificultad comercial se debe a la falta de difusión. Antes de aumentar la inversión en medios y contenido, comprueba si la operación aprovecha las oportunidades que ya recibe.",
    category: "Procesos", serviceTitle: "Process Intelligence", author: "Consultores de Procesos TAG08", readingTime: "2 min de lectura",
    relatedObjection: "Si el síntoma aparece en ventas, atención o retrabajo, pero no está clara la causa, conviene mapear la operación antes de invertir más en adquisición.",
    content: `Una empresa puede aumentar el tráfico, el contenido y la generación de oportunidades y seguir vendiendo mal.

El problema quizá no sea la falta de demanda.

Puede estar en el recorrido que sigue una oportunidad después de llegar.

### Algunas señales aparecen rápido

- los leads quedan sin respuesta;
- nadie sabe quién debe hacerse cargo de una oportunidad;
- cada vendedor trabaja de una manera distinta;
- se envían propuestas sin seguimiento;
- la información queda dispersa en WhatsApp;
- no se registran los motivos de pérdida;
- marketing y ventas trabajan con versiones diferentes de la realidad.

En ese escenario, atraer más oportunidades puede aumentar simplemente la cantidad de problemas que entran al sistema.

### Cómo distinguir marketing de procesos

Si llegan pocas oportunidades, puede haber un problema de adquisición.

Si llegan, pero no encajan, conviene revisar el público, el mensaje y la oferta.

Si llegan buenas oportunidades, pero la atención, el seguimiento o las propuestas son inconsistentes, el cuello de botella probablemente está en la operación.

Si la venta se concreta, pero la entrega genera conflictos, el problema puede estar aún más adelante.

### Proceso no significa burocracia

Proceso significa aclarar:

- responsables;
- decisiones;
- secuencia;
- información necesaria;
- criterios;
- excepciones;
- registros.

El objetivo no es que las personas llenen más documentos.

Es reducir la dependencia de la improvisación.

### Automatizar antes de organizar aumenta el riesgo

El CRM, la automatización y la IA pueden acelerar un flujo.

Pero, si el flujo está mal, la tecnología también acelera el error.

Por eso, antes de elegir una herramienta, pregunta:

**¿cómo funciona realmente este proceso hoy?**`
  },
  "site-inteligencia-artificial-seo-estrutura": {
    title: "¿Tu sitio está preparado para que lo entiendan las personas, los buscadores y la IA?",
    excerpt: "Un sitio útil explica con claridad el negocio, su oferta y el siguiente paso tanto a las personas como a los sistemas que buscan, resumen, comparan y recomiendan información.",
    category: "Web y Tecnología", serviceTitle: "Desarrollo Web", author: "Equipo de Desarrollo TAG08", readingTime: "2 min de lectura",
    relatedObjection: "Si el sitio existe, pero no explica bien la empresa, la oferta y el siguiente paso, la optimización debe comenzar por la estructura.",
    content: `La búsqueda ha cambiado.

Hoy una empresa quiere aparecer en Google y también quiere que la entiendan los sistemas que buscan, resumen, comparan y recomiendan información.

Esto no elimina los fundamentos.

Hace que la claridad sea aún más importante.

### Antes de pensar en IA, el sitio debe poder explicar el negocio

Una página de servicio debería responder con claridad:

- qué es el servicio;
- para quién es;
- qué problema aborda;
- cómo funciona;
- qué puede incluir;
- cuáles son sus límites;
- qué dudas son frecuentes;
- cuál es el siguiente paso.

Si una persona no puede entenderlo fácilmente, ninguna técnica de optimización compensa por completo el problema.

### La arquitectura también comunica

Los títulos, las páginas específicas, los enlaces internos y la jerarquía de información ayudan a los sistemas a entender las relaciones.

No basta con mencionar muchas palabras clave.

Es necesario construir contexto.

### SEO e IA no son estrategias opuestas

Un contenido bien estructurado para las búsquedas también suele ser más comprensible para los sistemas generativos:

- lenguaje claro;
- entidades bien definidas;
- respuestas directas;
- información original;
- enlaces coherentes;
- fuentes confiables.

### Los datos estructurados ayudan, pero no sustituyen el contenido

Schema puede facilitar la interpretación técnica.

No convierte un contenido débil en una fuente relevante.

### El objetivo final sigue siendo el negocio

Que una IA te cite o que aparezcas en una búsqueda solo tiene valor si la persona encuentra información útil y puede avanzar.

Descubrirte sin ofrecer una buena experiencia termina en tráfico desperdiciado.`
  },
  "novos-influenciadores": {
    title: "Influencers: el alcance importa menos cuando falta contexto",
    excerpt: "Una comunidad pequeña puede influir más en una decisión concreta que un perfil enorme sin relación real con el tema. El encaje y el propósito importan más que el tamaño por sí solo.",
    category: "Adquisición y Medios", serviceTitle: "Asesoría de Marketing Estratégico", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Si una colaboración empieza por elegir al influencer y no por definir el objetivo, organiza la estrategia antes de contratar.",
    content: `Influencia no es sinónimo de una audiencia grande.

Una persona con una comunidad menor puede influir más en una decisión concreta que un perfil enorme sin relación real con el tema.

Antes de contratar a un influencer, pregunta:

- ¿Esta audiencia encaja con nuestra oferta?
- ¿El tema tiene sentido para ese perfil?
- ¿Existe confianza construida?
- ¿El formato encaja con el mensaje?
- ¿Qué comportamiento esperamos generar?

### El error habitual

La marca elige por la apariencia, el alcance o el número de seguidores.

Después intenta adaptar la oferta a esa elección.

El orden debería ser el inverso.

Primero definimos la función de la colaboración.

Después buscamos a quien pueda cumplirla.`
  },
  "objetivo-de-campanha-antes-de-anunciar": {
    title: "Antes de anunciar: ¿qué problema debe resolver la campaña?",
    excerpt: "Google, Meta o LinkedIn vienen después. Primero define el comportamiento esperado, la oferta, el público y los criterios de éxito.",
    category: "Adquisición y Medios", serviceTitle: "Asesoría de Marketing Estratégico", author: "Equipo Editorial TAG08", readingTime: "2 min de lectura",
    relatedObjection: "Google, Meta o LinkedIn vienen después. Primero define el comportamiento esperado, la oferta, el público y los criterios de éxito.",
    content: `Las conversaciones sobre medios suelen empezar por la plataforma.

¿Google o Instagram?

¿Cuánto invertir?

¿A qué público dirigirnos?

Pero esas son preguntas de ejecución.

Hay una pregunta anterior:

**¿qué función debe cumplir esta campaña?**

### “Quiero vender más” es demasiado amplio

Una campaña puede servir para:

- generar descubrimiento;
- captar demanda existente;
- validar un mensaje;
- generar diagnósticos;
- recuperar oportunidades;
- incentivar el regreso;
- probar una oferta.

Cada función cambia el mensaje, la página, el público y la métrica.

### Los resultados de la plataforma no son resultados del negocio

Un clic no es una venta.

Un formulario no es un cliente.

Un lead no es necesariamente una oportunidad.

La campaña debe conectarse con el proceso comercial para que el análisis continúe después de la conversión digital.

### La página y la atención también forman parte

Un anuncio puede hacer bien su trabajo y enviar a la persona a:

- una página confusa;
- un WhatsApp sin respuesta;
- una propuesta genérica;
- un equipo sin preparación.

En ese caso, el problema no está necesariamente en la campaña.

### Siete preguntas antes de invertir en medios

1. ¿Qué problema intentamos resolver?
2. ¿Quién vive ese problema?
3. ¿Qué comportamiento queremos provocar?
4. ¿Qué oferta responde mejor?
5. ¿Qué mensaje debe entenderse?
6. ¿Cómo registraremos el avance?
7. ¿Qué demostrará que aprendimos o avanzamos?

Después elegimos el canal y la inversión.`
  },
  "jornada-do-consumidor-conteudo-decisoes": {
    title: "El recorrido del cliente: ¿qué necesita entender antes de decidir?",
    excerpt: "Revisa tu calendario de contenido con esta pregunta: ¿qué necesita comprender la persona en esta etapa?",
    category: "Contenido y Redes Sociales", serviceTitle: "Gestión de Redes Sociales", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Revisa tu calendario de contenido con esta pregunta: ¿qué necesita comprender la persona en esta etapa?",
    content: `El recorrido del cliente no es una línea recta.

Una persona puede conocer la marca, desaparecer, volver desde Google, consultar reseñas, ver un video y solo entonces conversar.

Por eso, el objetivo no es controlar cada camino.

Es asegurar que existan respuestas cuando aparezcan las dudas.

### Descubrimiento

La pregunta principal es:

**¿Qué está pasando?**

El contenido ayuda a reconocer síntomas y poner nombre a los problemas.

### Consideración

La pregunta principal es:

**¿Qué caminos existen?**

Aquí importan las comparaciones, los criterios, los riesgos y las alternativas.

### Decisión

La pregunta principal es:

**¿Qué solución y proveedor tienen sentido?**

El proceso, la evidencia, el alcance y los siguientes pasos cobran importancia.

### Relación

Después de contratar, el contenido también ayuda a alinear expectativas, enseñar el uso y mejorar la experiencia.

### El error

Repetir el mismo mensaje en todos los momentos.

Una marca que solo ofrece presupuestos habla con quien ya decidió.

Una marca que solo educa puede no conectar nunca el conocimiento con una solución.`
  },
  "gerar-leads-google-ads-pre-requisitos": {
    title: "Google Ads genera leads. ¿Tu empresa puede aprovecharlos?",
    excerpt: "Más leads no significan necesariamente más oportunidades. Importan su calidad y lo que ocurre después de que llega el contacto.",
    category: "Adquisición y Medios", serviceTitle: "Asesoría de Marketing Estratégico", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Antes de aumentar la inversión, revisa la oferta, la página, la medición y el proceso comercial.",
    content: `Más leads no significan necesariamente más oportunidades.

Lo que importa es su calidad y lo que ocurre después de que llega el contacto.

### 1. Oferta

La persona necesita entender qué se ofrece y para quién tiene sentido.

### 2. Página

El destino debe continuar la promesa iniciada en el anuncio.

Una buena página responde rápidamente:

- qué es;
- para quién;
- qué problema aborda;
- por qué considerarla;
- cuál es el siguiente paso.

### 3. Medición

El costo por lead por sí solo puede engañar.

También hay que seguir la calidad, el avance, las propuestas y el resultado comercial.

### 4. Atención

Una conversión puede perderse minutos después por:

- demora;
- falta de responsable;
- respuesta genérica;
- ausencia de seguimiento.

### La escala viene después

Si la oferta, la página, la medición y el área comercial aún tienen problemas, aumentar la inversión amplía la ineficiencia.`
  },
  "consideracao-funil-reduzir-duvidas": {
    title: "Consideración: contenido que ayuda al cliente a comparar antes de decidir",
    excerpt: "Entre reconocer el problema y contratar existe una etapa decisiva: entender alternativas, evaluar riesgos y construir criterios.",
    category: "Estrategia", serviceTitle: "Asesoría de Marketing Estratégico", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Entre reconocer el problema y contratar existe una etapa decisiva: entender alternativas, evaluar riesgos y construir criterios.",
    content: `Cuando las empresas parecen iguales, la comparación suele reducirse al precio.

Por eso, la comunicación en la etapa de consideración debe ayudar al cliente a entender diferencias reales.

### Explica los criterios

Una marca puede enseñar:

- cuándo tiene sentido un servicio;
- cuándo no;
- qué cambia entre alternativas;
- qué riesgos existen;
- qué evaluar en una propuesta.

Esto no significa atacar a la competencia.

Significa mejorar la calidad de la decisión.

### Las objeciones son temas

“Es caro.”

“Puedo hacerlo internamente.”

“Ya lo intenté antes.”

“No tengo tiempo.”

Estas frases contienen dudas que el contenido puede tratar de forma útil.

### La evidencia necesita contexto

Un caso sin contexto es solo una afirmación.

El proceso, las decisiones y el razonamiento ayudan mucho más a construir confianza.`
  },
  "youtube-para-empresas-consideracao": {
    title: "YouTube para empresas: cuándo la profundidad ayuda al cliente a decidir",
    excerpt: "Algunas dudas, comparaciones y demostraciones necesitan más tiempo del que puede ofrecer un video corto.",
    category: "Contenido y Redes Sociales", serviceTitle: "Producción Audiovisual", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Algunas dudas, comparaciones y demostraciones necesitan más tiempo del que puede ofrecer un video corto.",
    content: `No todas las decisiones caben en treinta segundos.

Los servicios consultivos, las soluciones técnicas y las compras de mayor riesgo necesitan contexto.

### YouTube puede funcionar como una biblioteca

Los videos pueden explicar:

- procesos;
- comparaciones;
- demostraciones;
- objeciones;
- casos;
- decisiones técnicas.

### La profundidad también genera confianza

La autoridad no depende de parecer especialista.

Depende de poder explicar un problema complejo de manera comprensible.

### El equipo comercial también puede usar el contenido

Un buen video puede compartirse después de una reunión, antes de una propuesta o para responder una duda recurrente.

Así, el contenido audiovisual se convierte en un activo comercial.`
  },
  "campanha-ideal-mensurar-resultados": {
    title: "La campaña adecuada empieza por el objetivo, no por la plataforma",
    excerpt: "El canal se elige después de definir el resultado, el público y el comportamiento que la campaña debe generar.",
    category: "Adquisición y Medios", serviceTitle: "Asesoría de Marketing Estratégico", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "La elección del canal viene después de definir el resultado, el público y el comportamiento esperado.",
    content: `Elegir una campaña por el canal invierte el orden de la decisión.

Primero responde:

- ¿Queremos generar descubrimiento?
- ¿Consideración?
- ¿Demanda?
- ¿Conversión?
- ¿Aprendizaje?

Después definimos:

- mensaje;
- público;
- canal;
- presupuesto;
- métrica.

El medio adecuado es consecuencia de la función que la campaña debe cumplir.`
  },
  "levar-negocio-para-o-digital-com-estrutura": {
    title: "Entrar en el entorno digital sin organizar la operación puede amplificar el desorden",
    excerpt: "Un sitio, Instagram y el comercio electrónico no sustituyen una oferta, atención, responsabilidades y procesos claros.",
    category: "Web y Tecnología", serviceTitle: "Desarrollo Web", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Un sitio, Instagram y el comercio electrónico no sustituyen una oferta, atención, responsabilidades y procesos claros.",
    content: `Abrir canales es fácil.

Cumplir lo que prometen es otra historia.

Antes de ampliar la presencia digital, una empresa debe evaluar:

### Oferta

¿Está claro qué vendemos?

### Información

¿Están organizados los productos, servicios, precios, políticas y contenidos?

### Atención

¿Quién recibe las oportunidades?

### Conversión

¿Qué esperamos que haga la persona?

### Responsabilidad

¿Quién mantiene cada canal?

### Operación

¿La empresa puede cumplir la experiencia prometida?

### Medición

¿Podemos aprender de lo que sucede?

### El comercio electrónico hace visible el problema

Una tienda en línea no crea por sí sola un inventario confiable, logística, políticas comerciales ni atención.

La tecnología expone la operación.`
  },
  "ferramentas-gratuitas-expansao": {
    title: "Las herramientas ayudan a organizar, pero no deciden cómo debe funcionar la operación",
    excerpt: "Las herramientas ayudan más cuando ya están claros los objetivos, responsables, entradas, salidas y decisiones de la rutina.",
    category: "Procesos", serviceTitle: "Process Intelligence", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Las herramientas ayudan cuando ya están claros los objetivos, responsables, entradas, salidas y decisiones de la rutina.",
    content: `El software no crea un método.

Las hojas de cálculo, la automatización, los CRM y las herramientas gratuitas pueden mejorar una rutina cuando ya hay claridad sobre:

- objetivo;
- responsable;
- entrada;
- salida;
- decisión;
- registro.

Sin eso, la empresa solo digitaliza la confusión.

### Antes de elegir una herramienta

Mapea:

1. qué sucede;
2. quién participa;
3. dónde se toman decisiones;
4. qué información hace falta;
5. qué debe quedar registrado.

Después busca la tecnología que se adapte al trabajo.`
  },
  "consumidores-conscientes": {
    title: "El público es más exigente. ¿Tu comunicación refleja esa madurez?",
    excerpt: "Los clientes investigan, comparan y consultan reseñas. La comunicación debe respetar el contexto y el conocimiento que traen.",
    category: "Contenido y Redes Sociales", serviceTitle: "Gestión de Redes Sociales", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Los clientes investigan, comparan y consultan reseñas. La comunicación debe respetar el contexto y el conocimiento que traen.",
    content: `Los clientes pueden investigar, comparar, consultar reseñas y llegar a una conversación con información previa.

Esto aumenta la importancia de una comunicación que respete su inteligencia y contexto.

Este público suele valorar:

- coherencia;
- información útil;
- transparencia;
- especificidad;
- respuestas directas;
- límites claros.

Prometerlo todo puede generar menos confianza que explicar bien lo que realmente se puede entregar.`
  },
  "transformacao-digital-erros": {
    title: "Transformación digital: tres errores que modernizan las herramientas y conservan el problema",
    excerpt: "Modernizar sistemas no resuelve flujos confusos si las responsabilidades, decisiones e información siguen desorganizadas.",
    category: "Procesos", serviceTitle: "Process Intelligence", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Modernizar sistemas no resuelve flujos confusos si las responsabilidades, decisiones e información siguen desorganizadas.",
    content: `Digitalizar no es simplemente poner software sobre una rutina antigua.

Hay tres errores frecuentes.

### 1. Comprar tecnología antes de entender el proceso

La herramienta empieza a reproducir un flujo confuso.

### 2. Crear canales sin definir su función

La empresa acumula sitio, redes, CRM y automatizaciones sin claridad sobre el papel de cada uno.

### 3. Cambiar la interfaz sin cambiar la operación

La experiencia parece moderna, pero las decisiones, responsabilidades y datos siguen desorganizados.

### Una secuencia más segura

Entender â†’ modelar â†’ validar â†’ estructurar â†’ desarrollar â†’ probar â†’ activar.`
  },
  "influenciadores-virtuais": {
    title: "Los influencers virtuales son un recurso. La estrategia sigue siendo la decisión.",
    excerpt: "Los influencers virtuales pueden llamar la atención, pero deben cumplir una función estratégica clara para la marca.",
    category: "Adquisición y Medios", serviceTitle: "Asesoría de Marketing Estratégico", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Los influencers virtuales pueden llamar la atención, pero deben cumplir una función estratégica clara para la marca.",
    content: `La novedad tecnológica llama la atención.

Pero la atención no responde:

- ¿para quién?
- ¿con qué objetivo?
- ¿en qué contexto?
- ¿con qué mensaje?
- ¿para generar qué comportamiento?

Los influencers virtuales pueden ser útiles cuando refuerzan una postura de marca.

Cuando se usan solo por ser una novedad, pueden generar curiosidad sin construir un posicionamiento real.`
  },
  "como-anunciar-no-google": {
    title: "Google Ads: elige la red según la intención, no el formato",
    excerpt: "Búsqueda, YouTube, Display y Shopping cumplen funciones distintas. Elige según lo que la campaña necesita influir.",
    category: "Adquisición y Medios", serviceTitle: "Asesoría de Marketing Estratégico", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Búsqueda, YouTube, Display y Shopping cumplen funciones distintas. Elige según lo que la campaña necesita influir.",
    content: `Búsqueda, YouTube, Display y Shopping no cumplen la misma función.

### Búsqueda

Capta una demanda que ya se expresó.

### YouTube

Puede apoyar el descubrimiento, la consideración y la explicación.

### Display

Puede apoyar el alcance, el recuerdo y la reactivación.

### Shopping

Tiene sentido cuando existe un catálogo estructurado y una intención de producto.

La pregunta no es:

¿qué red es mejor?

Es:

**¿qué comportamiento necesitamos influir?**`
  },
  "manutencao-de-site-seguranca-performance": {
    title: "El trabajo de un sitio no termina al publicarlo: qué cuidar después",
    excerpt: "Seguridad, copias de respaldo, formularios, contenido y rendimiento forman parte de la rutina de un sitio que apoya al negocio.",
    category: "Web y Tecnología", serviceTitle: "Hospedaje y Mantenimiento Web", author: "Equipo Editorial TAG08", readingTime: "2 min de lectura",
    relatedObjection: "La seguridad, las copias de respaldo, los formularios, el contenido y el rendimiento requieren atención continua.",
    content: `Un sitio puede estar en línea y ya estar fallando.

Un formulario puede dejar de enviarse.

La información puede quedar desactualizada.

Una integración puede romperse.

El problema es que muchas fallas solo se notan cuando alguien sufre sus consecuencias.

### Qué conviene supervisar

**Actualizaciones**
Las dependencias y funciones necesitan mantenimiento.

**Seguridad**
La superficie de riesgo cambia con el tiempo.

**Copias de respaldo**
Su frecuencia debe acompañar el ritmo de cambios del sitio.

**Rendimiento**
No se trata de perseguir una nota perfecta, sino de mantener una buena experiencia.

**Formularios**
Hay que probar cada punto de contacto.

**Contenido**
La información antigua también es una falla.

**SEO técnico**
Los enlaces, las páginas y la indexación requieren seguimiento.

**Infraestructura**
La disponibilidad y el hospedaje siguen importando.

### El mantenimiento preventivo no significa cero fallas

Significa aumentar la posibilidad de identificar y corregir problemas antes de que tengan un impacto mayor.`
  },
  "facebook-vender-mais": {
    title: "¿Facebook todavía funciona? Depende de la función que tenga en la estrategia",
    excerpt: "La utilidad de Facebook depende del público, del objetivo del canal y de su integración con la atención y la estrategia.",
    category: "Contenido y Redes Sociales", serviceTitle: "Gestión de Redes Sociales", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "La utilidad de Facebook depende del público, del objetivo del canal y de su integración con la atención y la estrategia.",
    content: `Preguntar si una plataforma todavía funciona puede simplificar demasiado la decisión.

Facebook puede seguir siendo relevante para ciertos públicos, contextos y objetivos.

La pregunta adecuada es:

**¿nuestro público está aquí y existe una función clara para este canal?**

Cuando la respuesta es sí, hacen falta:

- un mensaje adecuado;
- un público compatible;
- un destino coherente;
- integración con la atención;
- un objetivo medible.

Con estos elementos, la plataforma puede cumplir una función útil. Sin ellos, aumentar la frecuencia difícilmente resolverá el problema.`
  },
  "automacao-marketing-vendas": {
    title: "La automatización de marketing no corrige un proceso malo: lo ejecuta más rápido",
    excerpt: "Antes de automatizar mensajes, asignaciones y seguimientos, la empresa debe saber qué recorrido quiere automatizar.",
    category: "Procesos", serviceTitle: "Process Intelligence", author: "Equipo Editorial TAG08", readingTime: "1 min de lectura",
    relatedObjection: "Antes de automatizar mensajes, asignaciones y seguimientos, la empresa debe saber qué recorrido quiere automatizar.",
    content: `La automatización puede liberar tiempo, reducir tareas repetitivas y aumentar la consistencia.

Pero depende de reglas.

Antes de configurar activadores, hay que definir:

- quién entra en el flujo;
- por qué entra;
- qué información está disponible;
- qué mensaje tiene sentido;
- qué acción se espera;
- cuándo debe intervenir una persona;
- cuándo debe detenerse el flujo.

### El error

La empresa detecta desorganización y compra una herramienta.

Después intenta adaptar su rutina al software.

El resultado suele ser un proceso confuso ejecutado con más rapidez.

### Una secuencia mejor

Primero, mapear el proceso.

Después, definir responsabilidades.

Luego, validar las reglas.

Solo entonces, automatizar.

### La automatización debe ampliar la capacidad

Es más útil cuando elimina el esfuerzo mecánico sin quitar el contexto de las decisiones que todavía necesitan criterio humano.`
  }
};


export const INSIGHTS_UI = {
  en: {
    categories: ["All", "Strategy", "Content and Social Media", "Processes", "Web and Technology", "Acquisition and Media"],
    hubTitle: "Ideas that help you decide with more clarity.",
    hubDescription: "Read about strategy, content and social media, processes, web, and acquisition. Every article starts with a real question and leads to a useful decision or next step.",
    filterLabel: "Filter:", filterAria: "Filter insights by topic", featured: "Featured", featuredAria: "Featured insight",
    readFeatured: "Read the full analysis", moreReads: "More reading for this moment", read: "Read analysis",
    empty: "There are no published insights in this category yet.", showAll: "Show all insights",
    nextStepTitle: "Does this problem sound familiar to your company?",
    nextStep: "Insights help make sense of a problem. The next step depends on the company's context, maturity, and priorities.",
    nextStepCta: "Understand which path makes sense", readArticle: "Read insight: ", readFeaturedLabel: "Read featured insight: ",
    outline: "In this article", recommended: "Recommended next step", understand: "Understand this solution",
    back: "Back to Insights", related: "Related insights", date: "Publication date", reading: "Reading time", author: "Author",
    imageFallback: "TAG08 insight", articleTitle: "Insights | TAG08", emptyRoute: "Insights",
  },
  es: {
    categories: ["Todos", "Estrategia", "Contenido y Redes Sociales", "Procesos", "Web y Tecnología", "Adquisición y Medios"],
    hubTitle: "Ideas que ayudan a decidir con más claridad.",
    hubDescription: "Lecturas sobre estrategia, contenido y redes sociales, procesos, web y adquisición. Cada texto parte de una duda real y conduce a una decisión o a un siguiente paso útil.",
    filterLabel: "Filtrar:", filterAria: "Filtrar Insights por tema", featured: "Destacado", featuredAria: "Insight destacado",
    readFeatured: "Leer el análisis completo", moreReads: "Más lecturas para este momento", read: "Leer análisis",
    empty: "Todavía no hay Insights publicados en esta categoría.", showAll: "Ver todos los Insights",
    nextStepTitle: "¿Este problema se parece al momento de tu empresa?",
    nextStep: "Los Insights ayudan a entender el problema. El siguiente paso depende del contexto, la madurez y las prioridades de la empresa.",
    nextStepCta: "Entender qué camino tiene sentido", readArticle: "Leer Insight: ", readFeaturedLabel: "Leer Insight destacado: ",
    outline: "En esta lectura", recommended: "Siguiente paso recomendado", understand: "Entender esta solución",
    back: "Volver a Insights", related: "Insights relacionados", date: "Fecha de publicación", reading: "Tiempo de lectura", author: "Autor",
    imageFallback: "Insight TAG08", articleTitle: "Insights | TAG08", emptyRoute: "Insights",
  },
} as const;


export const INSIGHTS_TRANSLATIONS: Record<InsightsLocale, Record<string, ArticleTranslation>> = { en: EN, es: ES };

type InsightsUiDictionary = {
  [Key in keyof typeof INSIGHTS_UI.en]: (typeof INSIGHTS_UI.en)[Key] | (typeof INSIGHTS_UI.es)[Key];
};

export function getInsightsUiCopy(
  locale: InsightsLocale,
  key: keyof typeof INSIGHTS_UI.en,
  dictionary: Partial<InsightsUiDictionary> = INSIGHTS_UI[locale],
): string {
  const value = dictionary[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing ${locale} Insights UI string: ${String(key)}`);
  }
  return value;
}

export function getInsightTranslation(post: EditorialBlogPost, locale: InsightsLocale): ArticleTranslation {
  const translation = INSIGHTS_TRANSLATIONS[locale][post.slug];
  if (!translation) throw new Error(`Missing ${locale} Insights draft for ${post.slug}`);
  return translation;
}

export function localizeInsightPost(post: EditorialBlogPost, locale: InsightsLocale): LocalizedEditorialBlogPost {
  const translation = getInsightTranslation(post, locale);
  return { ...post, ...translation, relatedServiceTitle: translation.serviceTitle };
}

/** Resolves the shared article projection used by both the UI and route metadata. */
export function getLocalizedInsightBySlug(slug: string, locale: RouteLocale): LocalizedEditorialBlogPost | null {
  const source = BLOG_POSTS.find((post) => post.slug === slug);
  if (!source) return null;
  return locale === "pt" ? source : localizeInsightPost(source, locale);
}

