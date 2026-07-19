import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, Calendar, Filter, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { BLOG_POSTS, type EditorialBlogPost } from "../../../data";

interface InsightsProps {
  onNavigate: (page: string) => void;
}

const CATEGORIES = ["Todos", "Estratégia", "Branding", "Performance", "Processos", "Web"];

export default function Insights({ onNavigate }: InsightsProps) {
  const [selectedPost, setSelectedPost] = useState<EditorialBlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedPost]);

  const filteredPosts = selectedCategory === "Todos"
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.category === selectedCategory);

  const handleLinkClick = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderInsightCta = (post: EditorialBlogPost) => (
    <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6 space-y-3">
      <p className="text-brand font-mono text-[10px] uppercase tracking-widest">Próximo passo recomendado</p>
      <h3 className="text-white font-semibold text-lg">{post.relatedObjection ?? post.serviceNote}</h3>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-300">
          {post.relatedServiceTitle ?? post.serviceTitle}
        </span>
        <button
          onClick={() => handleLinkClick(post.relatedServicePath ?? post.servicePath)}
          className="inline-flex items-center gap-2 bg-brand text-black hover:bg-brand-dark transition-all duration-300 px-4 py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider"
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
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-brand/5 border border-brand/20 text-zinc-300 text-xs sm:text-sm font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="leading-relaxed">
                  <strong className="text-brand font-sans uppercase tracking-wider block sm:inline mr-2">[Vitrine de Prévia / Preview]</strong>
                  Esta área funciona como biblioteca editorial e já prepara cada peça para um serviço, uma dor e um próximo passo.
                </span>
                <span className="text-[10px] font-sans whitespace-nowrap bg-white/[0.05] border border-white/[0.08] px-2.5 py-1 rounded text-zinc-400">
                  SEO Canonical Ready
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-brand text-xs font-sans">
                  <Sparkles className="w-3 h-3" />
                  <span>Insights TAG08 &bull; Centro de inteligência aplicada</span>
                </div>
                <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-gradient leading-[1.1] tracking-tight">
                  Conteúdo com valor real<br />
                  <span className="text-brand">e destino comercial claro.</span>
                </h1>
                <p className="text-zinc-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                  Cada peça editorial nasce como `BlogPost`, mas entra no site com relação explícita a um serviço, uma objeção e uma ação concreta.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.04] pb-6">
              <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest mr-2 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Filtrar:
              </span>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all uppercase tracking-wider cursor-pointer ${
                    selectedCategory === category
                      ? "bg-brand text-black shadow-md shadow-brand/10"
                      : "bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] text-zinc-400 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group bg-charcoal-900 border border-white/[0.05] hover:border-brand/20 rounded-2xl overflow-hidden transition-all duration-350 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="relative aspect-video overflow-hidden bg-zinc-950 shrink-0">
                    <Image
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      src={post.image}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <span className="absolute top-4 left-4 bg-brand text-black font-mono font-black text-[9px] uppercase px-2.5 py-0.5 rounded tracking-widest">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-zinc-500 font-mono text-[10px] uppercase tracking-wide">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {post.readingTime ?? post.readTime}</span>
                      </div>
                      <h3 className="text-white font-semibold text-lg hover:text-brand transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.03] flex items-center justify-between text-xs font-sans font-bold text-brand group-hover:text-brand-dark transition-colors mt-auto">
                      <span>Abrir Insight Completo</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
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
            className="max-w-3xl mx-auto px-6 space-y-10 text-left"
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand transition-colors font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar para Insights
            </button>

            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/[0.05] bg-zinc-950">
              <Image
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                src={selectedPost.image}
                alt={selectedPost.title}
                referrerPolicy="no-referrer"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 bg-brand text-black font-mono font-black text-xs uppercase px-3 py-1 rounded tracking-widest shadow">
                {selectedPost.category}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-center text-zinc-500 font-mono text-xs uppercase tracking-wider border-b border-white/[0.04] pb-4">
                <span className="flex items-center gap-1.5 text-zinc-400"><Calendar className="w-4 h-4 text-brand" /> {selectedPost.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-zinc-400"><BookOpen className="w-4 h-4 text-brand" /> {selectedPost.readingTime ?? selectedPost.readTime}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-zinc-400"><User className="w-4 h-4 text-brand" /> {selectedPost.author}</span>
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight tracking-tight">
                {selectedPost.title}
              </h1>
            </div>

            <div className="prose prose-invert max-w-none text-zinc-300 text-sm sm:text-base space-y-6 leading-relaxed font-sans">
              {selectedPost.content.split("\n\n").map((para, idx) => {
                if (para.trim().startsWith("###")) {
                  return (
                    <h3 key={idx} className="font-display font-bold text-xl sm:text-2xl text-white pt-4 tracking-tight">
                      {para.replace("###", "").trim()}
                    </h3>
                  );
                }
                if (para.trim().startsWith("-") || para.trim().startsWith("*")) {
                  return (
                    <ul key={idx} className="list-disc pl-6 space-y-2 text-zinc-400 border-l-2 border-brand/20">
                      {para.split("\n").map((item, itemIndex) => (
                        <li key={itemIndex}>{item.replace(/^[-*]\s*/, "").trim()}</li>
                      ))}
                    </ul>
                  );
                }

                const parsedParagraph = para.split("**").map((text, i) => (
                  i % 2 === 1 ? <strong key={i} className="text-white font-bold">{text}</strong> : text
                ));

                return (
                  <p key={idx} className="whitespace-pre-line leading-relaxed">
                    {parsedParagraph}
                  </p>
                );
              })}
            </div>

            <section className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
              <p className="text-brand font-mono text-[10px] uppercase tracking-widest">Direção Estratégica</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Problema</p>
                  <p className="text-zinc-200 text-sm leading-relaxed">{selectedPost.strategicSynthesis.problem}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Tese</p>
                  <p className="text-zinc-200 text-sm leading-relaxed">{selectedPost.strategicSynthesis.thesis}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Risco</p>
                  <p className="text-zinc-200 text-sm leading-relaxed">{selectedPost.strategicSynthesis.risk}</p>
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1">Próximo passo</p>
                  <p className="text-zinc-200 text-sm leading-relaxed">{selectedPost.strategicSynthesis.nextStep}</p>
                </div>
              </div>
            </section>

            {selectedPost.faq?.length ? (
              <section className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
                <p className="text-brand font-mono text-[10px] uppercase tracking-widest">FAQ do artigo</p>
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
                <p className="text-brand font-mono text-[10px] uppercase tracking-widest">Insights relacionados</p>
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
                        <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">{item.category}</p>
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
                className="bg-brand text-black hover:bg-brand-dark transition-all duration-300 px-5 py-3 rounded-lg font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
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
