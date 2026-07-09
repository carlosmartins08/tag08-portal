import React, { type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

type ErrorBoundaryProps = {
  children: ReactNode;
  boundaryName?: string;
  fallback?: (options: { error: Error; reset: () => void }) => ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

function DefaultErrorFallback({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-charcoal-900/95 p-8 sm:p-10 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-brand/80">Falha de renderização</p>
              <h2 className="mt-2 text-2xl font-display font-bold text-white">A página encontrou um erro inesperado.</h2>
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">
              O app não conseguiu completar a renderização desta tela. Você pode tentar recarregar ou voltar para a home sem perder o contexto principal.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/5 bg-black/20 p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-500">Detalhe técnico</p>
          <p className="mt-2 text-sm text-zinc-200 break-words">{error.message}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-brand-secondary"
          >
            <RotateCcw className="h-4 w-4" />
            Recarregar
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-brand/30 hover:text-brand"
          >
            <Home className="h-4 w-4" />
            Voltar para a home
          </a>
        </div>
      </div>
    </div>
  );
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: Readonly<ErrorBoundaryProps>;
  declare setState: React.Component<ErrorBoundaryProps, ErrorBoundaryState>["setState"];

  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const prefix = this.props.boundaryName ? `[ErrorBoundary:${this.props.boundaryName}]` : "[ErrorBoundary]";
    console.error(prefix, error, info);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (error) {
      if (this.props.fallback) {
        return this.props.fallback({ error, reset: this.reset });
      }

      return <DefaultErrorFallback error={error} onRetry={this.reset} />;
    }

    return this.props.children;
  }
}
