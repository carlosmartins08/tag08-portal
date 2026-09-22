import { lazy, Suspense, useEffect, useState } from "react";

interface Subtle3DCanvasProps {
  className?: string;
  intensity?: number;
  minimumViewport?: number;
}

const Subtle3DCanvasScene = lazy(() => import("./Subtle3DCanvasScene"));

const Subtle3DFallback = ({ className = "" }: { className?: string }) => (
  <div
    className={`absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,rgba(var(--color-brand-secondary-rgb),0.04),transparent_50%)] pointer-events-none ${className}`}
  />
);

export default function Subtle3DCanvas({ className = "", intensity = 1, minimumViewport = 768 }: Subtle3DCanvasProps) {
  const [shouldRenderScene, setShouldRenderScene] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopViewport = window.matchMedia(`(min-width: ${minimumViewport}px)`);
    let startupTimer = 0;
    const updateSceneVisibility = () => {
      window.clearTimeout(startupTimer);
      if (!desktopViewport.matches || reducedMotion.matches) {
        setShouldRenderScene(false);
        return;
      }

      // WebGL is a secondary detail. Reserve the initial render budget for meaningful text and media.
      startupTimer = window.setTimeout(() => setShouldRenderScene(true), 5000);
    };

    updateSceneVisibility();
    reducedMotion.addEventListener("change", updateSceneVisibility);
    desktopViewport.addEventListener("change", updateSceneVisibility);
    return () => {
      window.clearTimeout(startupTimer);
      reducedMotion.removeEventListener("change", updateSceneVisibility);
      desktopViewport.removeEventListener("change", updateSceneVisibility);
    };
  }, [minimumViewport]);

  if (!shouldRenderScene) {
    return <Subtle3DFallback className={className} />;
  }

  return (
    <Suspense fallback={<Subtle3DFallback className={className} />}>
      <Subtle3DCanvasScene className={className} intensity={intensity} />
    </Suspense>
  );
}
