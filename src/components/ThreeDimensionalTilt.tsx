import React, { useRef, useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";

interface ThreeDimensionalTiltProps {
  children: React.ReactNode;
  className?: string;
  maxRotate?: number; // max rotation angle in degrees
  perspective?: number; // perspective value in px
  scale?: number; // hover scale multiplier
}

export default function ThreeDimensionalTilt({
  children,
  className = "",
  maxRotate = 6,
  perspective = 1400,
  scale = 1.015,
}: ThreeDimensionalTiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease",
  });
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 80%)",
    opacity: 0,
    transition: "opacity 0.5s ease, background 0.1s ease",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to the element
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert coordinates to range from -0.5 to 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    // Calculate rotation angles
    // Y-axis control rotates horizontally (left/right) -> controlled by xPct
    // X-axis control rotates vertically (up/down) -> controlled by yPct
    const rotateY = xPct * maxRotate;
    const rotateX = -yPct * maxRotate; // negative so mouse up tilts container up

    // Calculate dynamic glare coordinates
    const glareX = (mouseX / width) * 100;
    const glareY = (mouseY / height) * 100;

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease",
      boxShadow: "0 30px 100px -20px rgba(0, 0, 0, 0.7), 0 16px 40px -15px rgba(0, 0, 0, 0.5)",
    });

    setGlareStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.03) 30%, transparent 65%)`,
      opacity: 1,
      transition: "opacity 0.3s ease",
    });
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion) {
      setStyle({
        transform: "none",
        transition: "none",
        boxShadow: "none",
      });
      setGlareStyle({
        background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 80%)",
        opacity: 0,
        transition: "none",
      });
      return;
    }

    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease",
      boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
    });

    setGlareStyle({
      background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 80%)",
      opacity: 0,
      transition: "opacity 0.6s ease, background 0.6s ease",
    });
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      setStyle({
        transform: "none",
        transition: "none",
        boxShadow: "none",
      });
      setGlareStyle({
        background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 80%)",
        opacity: 0,
        transition: "none",
      });
    }
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none ${className}`}
      style={{
        ...style,
        transformStyle: "preserve-3d",
        willChange: prefersReducedMotion ? "auto" : "transform",
      }}
    >
      {/* Glare Reflection overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50 rounded-[inherit]"
        style={glareStyle}
      />
      {/* Preserve-3d container layer for parallax on child items */}
      <div style={{ transformStyle: "preserve-3d", height: "100%", width: "100%" }}>
        {children}
      </div>
    </div>
  );
}
