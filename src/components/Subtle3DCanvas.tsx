import { lazy, Suspense } from "react";

interface Subtle3DCanvasProps {
  className?: string;
  intensity?: number;
}

const Subtle3DCanvasScene = lazy(() => import("./Subtle3DCanvasScene"));

const Subtle3DFallback = ({ className = "" }: { className?: string }) => (
  <div
    className={`absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,rgba(var(--color-brand-secondary-rgb),0.04),transparent_50%)] pointer-events-none ${className}`}
  />
);

export default function Subtle3DCanvas({ className = "", intensity = 1 }: Subtle3DCanvasProps) {
  return (
    <Suspense fallback={<Subtle3DFallback className={className} />}>
      <Subtle3DCanvasScene className={className} intensity={intensity} />
    </Suspense>
  );
}
