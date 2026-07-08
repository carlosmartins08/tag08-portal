interface Subtle3DCanvasSceneProps {
  className?: string;
  intensity?: number;
}

const ORBIT_DOTS = Array.from({ length: 12 }, (_, index) => index);

export default function Subtle3DCanvasScene({ className = "", intensity = 1 }: Subtle3DCanvasSceneProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 60% 50%, rgba(var(--color-brand-secondary-rgb),0.09), transparent 28%), radial-gradient(circle at 40% 52%, rgba(255,255,255,0.05), transparent 36%)",
          opacity: Math.min(1, 0.35 + intensity * 0.18)
        }}
      />

      <div className="absolute inset-[8%] rounded-full border border-white/5 animate-[spin_36s_linear_infinite]" />
      <div className="absolute inset-[15%] rounded-full border border-brand/15 border-dashed animate-[spin_54s_linear_infinite_reverse]" />
      <div className="absolute inset-[24%] rounded-full border border-white/5 animate-[spin_72s_linear_infinite]" />

      <svg
        viewBox="0 0 200 200"
        className="absolute left-1/2 top-1/2 w-[76%] h-[76%] -translate-x-1/2 -translate-y-1/2 opacity-90"
      >
        <defs>
          <linearGradient id="subtleOrbitStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-brand-secondary)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        <g fill="none">
          <circle cx="100" cy="100" r="64" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="50" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="2 4" />
          <polygon
            points="100,26 138,47 152,88 138,133 100,154 62,133 48,88 62,47"
            stroke="url(#subtleOrbitStroke)"
            strokeWidth="1.5"
          />
          <polygon
            points="100,42 126,57 136,88 126,119 100,134 74,119 64,88 74,57"
            stroke="rgba(var(--color-brand-secondary-rgb),0.18)"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
          <line x1="100" y1="26" x2="100" y2="154" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="48" y1="88" x2="152" y2="88" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="62" y1="47" x2="138" y2="133" stroke="rgba(var(--color-brand-secondary-rgb),0.14)" strokeWidth="0.9" />
          <line x1="138" y1="47" x2="62" y2="133" stroke="rgba(var(--color-brand-secondary-rgb),0.14)" strokeWidth="0.9" />
        </g>
      </svg>

      <div className="absolute inset-0">
        {ORBIT_DOTS.map((index) => {
          const angle = index * 30;
          const depth = index % 3;
          const size = 4 - depth * 0.75;
          const duration = 18 + depth * 6;
          const offset = 18 + depth * 5;

          return (
            <span
              key={index}
              className="absolute left-1/2 top-1/2 rounded-full bg-brand shadow-[0_0_24px_rgba(var(--color-brand-secondary-rgb),0.25)]"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${offset}rem)`,
                animation: `spin ${duration}s linear infinite`,
                opacity: 0.28 + depth * 0.1
              }}
            />
          );
        })}
      </div>

      <div
        className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/15 bg-[radial-gradient(circle,rgba(17,17,17,0.92),rgba(4,4,4,0.72)_72%,transparent_100%)] shadow-[0_0_80px_rgba(var(--color-brand-secondary-rgb),0.08)]"
        style={{
          backdropFilter: "blur(4px)",
          opacity: Math.min(1, 0.78 + intensity * 0.08)
        }}
      />

      <div className="absolute left-1/2 top-1/2 flex h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/70 shadow-[0_0_50px_rgba(0,0,0,0.45)]">
        <div className="h-2.5 w-2.5 rounded-full bg-brand animate-pulse" />
      </div>
    </div>
  );
}
