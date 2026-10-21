"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ClienteOnboarding from "../pages/ClienteOnboarding";
import { getLocalizedPath, type RouteLocale } from "../../../config/routeRegistry";

type Props = { locale: RouteLocale };

const copy = {
  pt: { title: "Acesso ao onboarding", description: "Este acesso é destinado a clientes com projeto confirmado. Continue somente se você solicitou este link.", continue: "Continuar para o onboarding", working: "Validando acesso…", error: "Não foi possível validar este link. Solicite um novo acesso à equipe TAG08." },
  en: { title: "Onboarding access", description: "This access is for clients with a confirmed project. Continue only if you requested this link.", continue: "Continue to onboarding", working: "Validating access…", error: "This link could not be validated. Request a new access link from the TAG08 team." },
  es: { title: "Acceso al onboarding", description: "Este acceso es para clientes con un proyecto confirmado. Continúe solo si solicitó este enlace.", continue: "Continuar al onboarding", working: "Validando acceso…", error: "No fue posible validar este enlace. Solicite un nuevo acceso al equipo TAG08." }
} satisfies Record<RouteLocale, { title: string; description: string; continue: string; working: string; error: string }>;

export function OnboardingAccessGate({ locale }: Props) {
  const [state, setState] = useState<"idle" | "working" | "error">("idle");
  const [token, setToken] = useState<string | null>(null);
  const redeeming = useRef(false);
  const text = copy[locale];

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
    const token = params.get("access_token");
    if (!token) return;

    window.history.replaceState(null, "", window.location.pathname);
    setToken(token);
  }, []);

  const redeem = async () => {
    if (!token || redeeming.current) return;
    redeeming.current = true;
    setState("working");
    setToken(null);
    try {
      const response = await fetch("/api/onboarding/access/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        cache: "no-store"
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || body?.ok !== true) throw new Error("access_unavailable");
      window.location.replace(window.location.pathname);
    } catch {
      setState("error");
      redeeming.current = false;
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-16 text-white">
      <section aria-live="polite" className="w-full rounded-2xl border border-white/10 bg-zinc-950 p-8 shadow-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">TAG08 · Cliente</p>
        <h1 className="text-3xl font-semibold tracking-tight">{text.title}</h1>
        <p className="mt-4 text-zinc-300" role={state === "working" ? "status" : undefined}>{state === "working" ? text.working : text.description}</p>
        {token && state === "idle" ? <button type="button" onClick={redeem} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-lime-300 px-5 py-3 font-semibold text-zinc-950 transition-colors hover:bg-lime-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300">{text.continue}</button> : null}
        {state === "error" ? <p role="alert" className="mt-5 rounded-lg border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">{text.error}</p> : null}
      </section>
    </main>
  );
}

export function OnboardingSessionClient({ locale }: Props) {
  const router = useRouter();
  const navigate = async (path: string) => {
    try {
      const response = await fetch("/api/onboarding/session", { method: "DELETE", cache: "no-store" });
      if (!response.ok) return;
    } catch {
      return;
    }
    router.push(getLocalizedPath(path, locale));
  };
  useEffect(() => {
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch("/api/onboarding/session", { cache: "no-store" });
        if (response.status === 401) window.location.replace(window.location.pathname);
      } catch {
        // Server-side session checks remain authoritative for all private operations.
      }
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return <ClienteOnboarding onNavigate={navigate} locale={locale} />;
}
