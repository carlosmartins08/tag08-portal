"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";

interface HeroEditorialStageProps {
  image: StaticImageData;
}

const initialLightPosition = {
  "--hero-stage-light-x": "72%",
  "--hero-stage-light-y": "42%",
  "--hero-stage-rotate-x": "0deg",
  "--hero-stage-rotate-y": "0deg"
} as CSSProperties;

export default function HeroEditorialStage({ image }: HeroEditorialStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const resetLight = () => {
      const stage = stageRef.current;
      if (!stage) return;

      stage.style.setProperty("--hero-stage-light-x", "72%");
      stage.style.setProperty("--hero-stage-light-y", "42%");
      stage.style.setProperty("--hero-stage-rotate-x", "0deg");
      stage.style.setProperty("--hero-stage-rotate-y", "0deg");
    };

    const moveLight = (event: PointerEvent) => {
      if (!hoverCapable.matches || reducedMotion.matches) {
        resetLight();
        return;
      }

      const stage = stageRef.current;
      if (!stage) return;

      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        resetLight();
        return;
      }

      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        stage.style.setProperty("--hero-stage-light-x", `${Math.round(x * 100)}%`);
        stage.style.setProperty("--hero-stage-light-y", `${Math.round(y * 100)}%`);
        stage.style.setProperty("--hero-stage-rotate-x", `${((0.5 - y) * 1).toFixed(2)}deg`);
        stage.style.setProperty("--hero-stage-rotate-y", `${((x - 0.5) * 1.25).toFixed(2)}deg`);
      });
    };

    window.addEventListener("pointermove", moveLight, { passive: true });
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", moveLight);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      data-testid="hero-editorial-stage"
      aria-hidden="true"
      className="hero-editorial-stage pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={initialLightPosition}
    >
      <div className="hero-editorial-stage__drift absolute inset-0">
        <div className="hero-editorial-stage__image absolute inset-0">
          <Image
            src={image}
            alt=""
            preload
            fill
            sizes="(max-width: 1279px) 100vw, 1280px"
            className="object-cover object-[72%_center]"
          />
        </div>
      </div>
      <div className="hero-editorial-stage__grid absolute inset-0" />
      <div className="hero-editorial-stage__wash absolute inset-0" />
      <div className="hero-editorial-stage__light pointer-events-none absolute inset-0" />
    </div>
  );
}
