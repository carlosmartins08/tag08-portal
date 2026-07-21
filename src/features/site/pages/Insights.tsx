import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, Calendar, Clock3, Filter, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ResilientImage from "../../../components/ResilientImage";
import { BLOG_POSTS, type EditorialBlogPost } from "../../../data";

interface InsightsProps {
  onNavigate: (page: string) => void;
}

const CATEGORIES = ["Todos", "Estratégia", "Branding", "Performance", "Processos", "Web"];

const getContentBlocks = (content: string) => content
  .trim()
  .split(/\r?\n\s*\r?\n/)
  .flatMap((block) => {
    const lines = block.split(/\r?\n/);
    const [firstLine, ...remainingLines] = lines;

    // Authors commonly place a list immediately after a Markdown heading.
    // Render those as separate semantic blocks without imposing blank lines on content entry.
    if (firstLine?.trim().startsWith("###") && remainingLines.join("\n").trim()) {
      return [firstLine, remainingLines.join("\n")];
    }

    return [block];
  });

const getArticleSections = (post: EditorialBlogPost) => (
  getContentBlocks(post.content)
    .map((block, index) => ({ title: block.replace("###", "").trim(), index, isSection: block.trim().startsWith("###") }))
    .filter(({ isSection }) => isSection)
);

const sectionId = (title: string, index: number) => (
  `insight-section-${index}-${title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`
);

export default function Insights({ onNavigate }: InsightsProps) {
  const [selectedPost, setSelectedPost] = useState<EditorialBlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedPost]);

  const filteredPosts = selectedCategory === "Todos"
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.category === selectedCategory);
  const featuredPost = filteredPosts.at(-1);
  const listPosts = featuredPost
    ? filteredPosts.filter((post) => post.id !== featuredPost.id)
    : [];
  const articleBlocks = selectedPost ? getContentBlocks(selectedPost.content) : [];
  const articleSections = selectedPost ? getArticleSections(selectedPost) : [];

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderInsightCta = (post: EditorialBlogPost) => (
    <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6 space-y-3">
      <p className="text-brand tag08-meta text-xs uppercase tracking-widest">Próximo passo recomendado</p>
      <h3 className="text-white font-semibold text-lg">{post.relatedObjection ?? post.serviceNote}</h3>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs tag08-meta uppercase tracking-wider text-zinc-300">
          {post.relatedServiceTitle ?? post.serviceTitle}
        </span>
        <button
          onClick={() => handleLinkClick(post.relatedServicePath ?? post.servicePath)}
          className="inline-flex items-center gap-2 bg-brand text-black hover:bg-brand-dark transition-all duration-300 px-4 py-2.5 rounded-lg tag08-meta font-bold text-xs uppercase tracking-wider"
        >
          Ver serviço
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-charcoal-950 text-white min-h-screen pt-28 pb-20 relative">
      <AnimatePresence mode="wait">
        {!selectedPost ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto px-6 space-y-12 text-left"
          >
            <header className="max-w-3xl space-y-4">
              <div className="space-y-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-brand text-xs font-sans">
                  <Sparkles className="w-3 h-3" />
                  <span>Insights TAG08</span>
                </div>
                <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-gradient leading-[1.06] tracking-tight">
                  Ideias que ajudam a<br />
                  <span className="text-brand">decidir com mais clareza.</span>
                </h1>
                <p className="text-zinc-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                  Leitura editorial sobre estratégia, marca, processos e tecnologia. Cada material parte de uma pergunta real e termina em um próximo passo aplicável.
                </p>
              </div>
            </header>

            <nav aria-label="Filtrar insights por tema" className="flex flex-wrap items-center gap-2 border-b border-white/[0.04] pb-6">
              <span className="text-zinc-500 tag08-meta text-xs uppercase tracking-widest mr-2 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Filtrar:
              </span>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                  className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all uppercase tracking-wider cursor-pointer ${
                    selectedCategory === category
                      ? "bg-brand text-black shadow-md shadow-brand/10"
                      : "bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] text-zinc-400 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>

            {featuredPost ? (
              <article className="overflow-hidden rounded-3xl border border-white/[0.08] bg-charcoal-900">
                <button
                  type="button"
                  onClick={() => setSelectedPost(featuredPost)}
                  className="group grid w-full text-left md:grid-cols-[1.08fr_0.92fr]"
                  aria-label={`Ler insight em destaque: ${featuredPost.title}`}
                >
                  <div className="relative min-h-64 overflow-hidden bg-zinc-950 md:min-h-full">
                    <ResilientImage
                      fallbackLabel={`${featuredPost.category} // insight TAG08`}
                      sizes="(max-width: 768px) 100vw, 55vw"
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      referrerPolicy="no-referrer"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full bg-brand px-3 py-1 tag08-meta text-xs font-black uppercase tracking-widest text-black">
                      Em destaque
                    </span>
                  </div>
                  <div className="flex flex-col justify-center gap-5 p-7 sm:p-9 lg:p-11">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 tag08-meta text-xs uppercase tracking-wider text-zinc-500">
                      <span className="text-brand">{featuredPost.category}</span>
                      <span aria-hidden="true">/</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {featuredPost.date}</span>
                      <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> {featuredPost.readingTime ?? featuredPost.readTime}</span>
                    </div>
                    <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-white transition-colors group-hover:text-brand sm:text-4xl">
                      {featuredPost.title}
                    </h2>
                    <p className="max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                      {featuredPost.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 tag08-meta text-xs font-bold uppercase tracking-wider text-brand">
                      Ler análise completa <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              </article>
            ) : null}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listPosts.map((post) => (
                <article key={post.id} className="overflow-hidden rounded-2xl border border-white/[0.05] bg-charcoal-900 transition-colors hover:border-brand/20">
                  <button
                    type="button"
                    onClick={() => setSelectedPost(post)}
                    aria-label={`Ler insight: ${post.title}`}
                    className="group flex h-full w-full flex-col text-left"
                  >
                    <div className="relative aspect-video shrink-0 overflow-hidden bg-zinc-950">
                      <ResilientImage
                        fallbackLabel={`${post.category} // insight TAG08`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        src={post.image}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                      <span className="absolute left-4 top-4 rounded bg-brand px-2.5 py-0.5 tag08-meta text-xs font-black uppercase tracking-widest text-black">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-grow flex-col justify-between gap-4 p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 tag08-meta text-xs uppercase tracking-wide text-zinc-500">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                          <span aria-hidden="true">•</span>
                          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {post.readingTime ?? post.readTime}</span>
                        </div>
                        <h2 className="line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-brand">
                          {post.title}
                        </h2>
                        <p className="line-clamp-3 text-xs leading-relaxed text-zinc-400">
                          {post.excerpt}
                        </p>
                      </div>
                      <span className="mt-auto flex items-center justify-between border-t border-white/[0.04] pt-4 tag08-meta text-xs font-bold uppercase tracking-wider text-brand">
                        Ler análise <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </button>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16 bg-charcoal-900 border border-white/[0.05] rounded-2xl">
                <p className="text-zinc-500 font-sans text-sm uppercase">Nenhum insight publicado nesta categoria ainda.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="article"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto px-6 space-y-10 text-left"
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand transition-colors font-sans text-xs uppercase tracking-wider cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para Insights
            </button>

            <header className="mx-auto max-w-3xl space-y-5">
              <span className="inline-flex rounded-full border border-brand/20 bg-brand/10 px-3 py-1 tag08-meta text-xs font-black uppercase tracking-[0.16em] text-brand">
                {selectedPost.category}
              </span>
              <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-[1.04] tracking-tight">
                {selectedPost.title}
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
                {selectedPost.excerpt}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-zinc-500 tag08-meta text-xs uppercase tracking-wider border-y border-white/[0.05] py-4">
                <span className="flex items-center gap-1.5 text-zinc-400"><Calendar className="w-4 h-4 text-brand" /> {selectedPost.date}</span>
                <span className="flex items-center gap-1.5 text-zinc-400"><BookOpen className="w-4 h-4 text-brand" /> {selectedPost.readingTime ?? selectedPost.readTime}</span>
                <span className="flex items-center gap-1.5 text-zinc-400"><User className="w-4 h-4 text-brand" /> {selectedPost.author}</span>
              </div>
            </header>

            <div className="relative aspect-[16/8] overflow-hidden rounded-3xl border border-white/[0.05] bg-zinc-950 shadow-2xl">
              <ResilientImage
                fallbackLabel={`${selectedPost.category} // insight TAG08`}
                sizes="(max-width: 1024px) 100vw, 70vw"
                src={selectedPost.image}
                alt={selectedPost.title}
                referrerPolicy="no-referrer"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 via-transparent to-transparent" />
            </div>

            <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
              <article className="prose prose-invert max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">
              {articleBlocks.map((para, idx) => {
                if (para.trim().startsWith("###")) {
                  const title = para.replace("###", "").trim();
                  return (
                    <h2 id={sectionId(title, idx)} key={idx} className="scroll-mt-28 font-display font-bold text-2xl sm:text-3xl text-white pt-8 tracking-tight leading-tight">
                      {title}
                    </h2>
                  );
                }
                if (/^[-*]\s+/.test(para.trim())) {
                  return (
                  <ul key={idx} className="my-7 list-disc space-y-2.5 border-l-2 border-brand/30 pl-8 text-zinc-300 marker:text-brand">
                      {para.split("\n").map((item, itemIndex) => (
                        <li key={itemIndex}>{item.replace(/^[-*]\s*/, "").trim()}</li>
                      ))}
                    </ul>
                  );
                }
                if (/^\d+\.\s+/.test(para.trim())) {
                  return (
                    <ol key={idx} className="my-7 list-decimal space-y-2.5 border-l-2 border-brand/30 pl-8 text-zinc-300 marker:font-sans marker:text-brand">
                      {para.split("\n").map((item, itemIndex) => (
                        <li key={itemIndex}>{item.replace(/^\d+\.\s*/, "").trim()}</li>
                      ))}
                    </ol>
                  );
                }

                const parsedParagraph = para.split("**").map((text, i) => (
                  i % 2 === 1 ? <strong key={i} className="text-white font-bold">{text}</strong> : text
                ));

                return (
                  <p key={idx} className="mb-6 whitespace-pre-line leading-relaxed">
                    {parsedParagraph}
                  </p>
                );
              })}
              </article>

              {articleSections.length ? (
                <aside className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 lg:sticky lg:top-28">
                  <p className="tag08-meta text-xs uppercase tracking-widest text-brand">Nesta leitura</p>
                  <ol className="mt-4 space-y-3 border-l border-white/[0.1] pl-4">
                    {articleSections.map(({ title, index }) => (
                      <li key={title}>
                        <a className="text-xs leading-relaxed text-zinc-400 transition-colors hover:text-white" href={`#${sectionId(title, index)}`}>
                          {title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </aside>
              ) : null}
            </div>

            <section className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
              <p className="text-brand tag08-meta text-xs uppercase tracking-widest">Direção Estratégica</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs tag08-meta uppercase tracking-widest text-zinc-500 mb-1">Problema</p>
                  <p className="text-zinc-200 text-sm leading-relaxed">{selectedPost.strategicSynthesis.problem}</p>
                </div>
                <div>
                  <p className="text-xs tag08-meta uppercase tracking-widest text-zinc-500 mb-1">Tese</p>
                  <p className="text-zinc-200 text-sm leading-relaxed">{selectedPost.strategicSynthesis.thesis}</p>
                </div>
                <div>
                  <p className="text-xs tag08-meta uppercase tracking-widest text-zinc-500 mb-1">Risco</p>
                  <p className="text-zinc-200 text-sm leading-relaxed">{selectedPost.strategicSynthesis.risk}</p>
                </div>
                <div>
                  <p className="text-xs tag08-meta uppercase tracking-widest text-zinc-500 mb-1">Próximo passo</p>
                  <p className="text-zinc-200 text-sm leading-relaxed">{selectedPost.strategicSynthesis.nextStep}</p>
                </div>
              </div>
            </section>

            {selectedPost.faq?.length ? (
              <section className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
                <p className="text-brand tag08-meta text-xs uppercase tracking-widest">FAQ do artigo</p>
                <div className="space-y-4">
                  {selectedPost.faq.map((item) => (
                    <div key={item.question} className="space-y-2 border-b border-white/[0.05] pb-4 last:border-b-0 last:pb-0">
                      <h3 className="text-white font-semibold text-base leading-snug">{item.question}</h3>
                      <p className="text-zinc-300 text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {selectedPost.relatedInsights?.length ? (
              <section className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
                <p className="text-brand tag08-meta text-xs uppercase tracking-widest">Insights relacionados</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedPost.relatedInsights
                    .map((relatedKey) => BLOG_POSTS.find((candidate) => candidate.slug === relatedKey || candidate.id === relatedKey))
                    .filter((candidate): candidate is EditorialBlogPost => Boolean(candidate))
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedPost(item)}
                        className="rounded-xl border border-white/[0.05] bg-black/20 p-4 text-left hover:border-brand/20 transition-colors"
                      >
                        <p className="text-xs tag08-meta uppercase tracking-widest text-zinc-500">{item.category}</p>
                        <h3 className="text-white font-semibold text-sm mt-1 leading-snug">{item.title}</h3>
                        <p className="text-zinc-400 text-xs mt-2 leading-relaxed line-clamp-2">{item.excerpt}</p>
                      </button>
                    ))}
                </div>
              </section>
            ) : null}

            {renderInsightCta(selectedPost)}

            <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.01] border border-white/[0.04] p-8 rounded-2xl">
              <div>
                <h3 className="text-white font-bold text-lg">Quer estruturar sua marca para faturar no topo?</h3>
                <p className="text-zinc-500 text-xs mt-0.5">Fale com um consultor especialista e use os insights como parte do processo comercial.</p>
              </div>
              <button
                onClick={() => handleLinkClick("/contato")}
                className="bg-brand text-black hover:bg-brand-dark transition-all duration-300 px-5 py-3 rounded-lg tag08-meta font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
              >
                Falar Conosco
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
