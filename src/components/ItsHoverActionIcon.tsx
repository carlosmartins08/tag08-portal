"use client";

import { useEffect } from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";

type ItsHoverActionIconProps = {
  name: "send" | "code";
  size?: number;
  className?: string;
};

/**
 * Small, decorative adaptations of Its Hover's send-icon and code-icon.
 * The source library is Apache-2.0: https://github.com/itshover/itshover
 * The surrounding control owns its accessible name; these SVGs are hidden from AT.
 */
export default function ItsHoverActionIcon({
  name,
  size = 16,
  className = "",
}: ItsHoverActionIconProps) {
  const [scope, animate] = useAnimate();
  const motionPreference = useReducedMotion();
  const motionAllowed = motionPreference === false;

  useEffect(() => {
    const svg = scope.current as SVGSVGElement | null;
    const control = svg?.closest<HTMLElement>("[data-its-hover-icon-interaction], button, a, [role='button']");
    if (!control || !motionAllowed) return;

    let pointerActive = false;
    let focusActive = false;
    let animationActive = false;

    const syncAnimation = () => {
      const shouldAnimate = pointerActive || focusActive;
      if (shouldAnimate === animationActive) return;
      animationActive = shouldAnimate;

      if (shouldAnimate) {
        if (name === "send") {
          void animate(".send-icon", { x: [0, 3, 0], y: [0, -3, 0] }, { duration: 0.36, ease: "easeInOut" });
        } else {
          void animate(".left-bracket", { x: -2 }, { duration: 0.24, ease: "easeOut" });
          void animate(".right-bracket", { x: 2 }, { duration: 0.24, ease: "easeOut" });
        }
        return;
      }

      if (name === "send") {
        void animate(".send-icon", { x: 0, y: 0 }, { duration: 0.2, ease: "easeOut" });
      } else {
        void animate(".left-bracket", { x: 0 }, { duration: 0.2, ease: "easeInOut" });
        void animate(".right-bracket", { x: 0 }, { duration: 0.2, ease: "easeInOut" });
      }
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "touch") pointerActive = true;
      syncAnimation();
    };
    const onPointerLeave = () => {
      pointerActive = false;
      syncAnimation();
    };
    const onFocusIn = () => {
      focusActive = true;
      syncAnimation();
    };
    const onFocusOut = (event: FocusEvent) => {
      if (control.contains(event.relatedTarget as Node | null)) return;
      focusActive = false;
      syncAnimation();
    };

    control.addEventListener("pointerenter", onPointerEnter);
    control.addEventListener("pointerleave", onPointerLeave);
    control.addEventListener("focusin", onFocusIn);
    control.addEventListener("focusout", onFocusOut);

    return () => {
      control.removeEventListener("pointerenter", onPointerEnter);
      control.removeEventListener("pointerleave", onPointerLeave);
      control.removeEventListener("focusin", onFocusIn);
      control.removeEventListener("focusout", onFocusOut);
    };
  }, [animate, motionAllowed, name, scope]);

  return (
    <motion.svg
      ref={scope}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {name === "send" ? (
        <motion.g className="send-icon" style={{ transformOrigin: "center" }}>
          <path d="M10 14 21 3" />
          <path d="m21 3-6.5 18a.55.55 0 0 1-1 0l-3.5-7-7-3.5a.55.55 0 0 1 0-1L21 3" />
        </motion.g>
      ) : (
        <>
          <motion.path className="right-bracket" d="m16 18 6-6-6-6" />
          <motion.path className="left-bracket" d="m8 6-6 6 6 6" />
        </>
      )}
    </motion.svg>
  );
}
