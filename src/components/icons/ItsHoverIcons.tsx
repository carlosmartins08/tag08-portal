"use client";

// Adapted from itshover/itshover (Apache-2.0). Changes: reduced-motion support,
// decorative semantics, parent-controlled hover/focus, and smaller motion travel.
// Attribution and the full license are in THIRD_PARTY_NOTICES.md.

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  type SVGProps,
} from "react";
import { motion, useAnimate, useReducedMotion } from "motion/react";

export interface AnimatedIconHandle {
  startAnimation: () => void | Promise<void>;
  stopAnimation: () => void;
}

interface AnimatedIconProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const ArrowNarrowRightIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function ArrowNarrowRightIcon(
    { size = 16, color = "currentColor", strokeWidth = 2, className },
    ref,
  ) {
    const [scope, animate] = useAnimate();
    const prefersReducedMotion = useReducedMotion();

    const startAnimation = useCallback(() => {
      if (prefersReducedMotion) return;
      void animate(
        ".arrow-group",
        { x: [0, 3, 0] },
        { duration: 0.32, ease: "easeInOut" },
      );
    }, [animate, prefersReducedMotion]);

    const stopAnimation = useCallback(() => {
      animate(".arrow-group", { x: 0 }, { duration: prefersReducedMotion ? 0 : 0.16 });
    }, [animate, prefersReducedMotion]);

    useImperativeHandle(ref, () => ({ startAnimation, stopAnimation }), [startAnimation, stopAnimation]);

    return (
      <motion.svg
        ref={scope}
        onHoverStart={() => void startAnimation()}
        onHoverEnd={stopAnimation}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
        style={{ pointerEvents: "auto" }}
      >
        <motion.g className="arrow-group">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </motion.g>
      </motion.svg>
    );
  },
);

export const SendIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function SendIcon(
    { size = 14, color = "currentColor", strokeWidth = 2, className },
    ref,
  ) {
    const [scope, animate] = useAnimate();
    const prefersReducedMotion = useReducedMotion();

    const startAnimation = useCallback(async () => {
      if (prefersReducedMotion) return;
      await animate(
        ".send-group",
        { x: [0, 2, 0], y: [0, -2, 0] },
        { duration: 0.28, ease: "easeInOut" },
      );
    }, [animate, prefersReducedMotion]);

    const stopAnimation = useCallback(() => {
      animate(
        ".send-group",
        { x: 0, y: 0 },
        { duration: prefersReducedMotion ? 0 : 0.16 },
      );
    }, [animate, prefersReducedMotion]);

    useImperativeHandle(ref, () => ({ startAnimation, stopAnimation }), [startAnimation, stopAnimation]);

    return (
      <motion.svg
        ref={scope}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
        style={{ pointerEvents: "none" }}
      >
        <motion.g className="send-group">
          <path d="M10 14 21 3" />
          <path d="m21 3-6.5 18a.55.55 0 0 1-1 0l-3.5-7-7-3.5a.55.55 0 0 1 0-1L21 3" />
        </motion.g>
      </motion.svg>
    );
  },
);

export const CheckedIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  function CheckedIcon(
    { size = 32, color = "currentColor", strokeWidth = 2, className },
    ref,
  ) {
    const [scope, animate] = useAnimate();
    const prefersReducedMotion = useReducedMotion();

    const startAnimation = useCallback(async () => {
      if (prefersReducedMotion) return;
      await animate(".success-check", { pathLength: 0 }, { duration: 0 });
      await animate(".success-check", { pathLength: 1 }, { duration: 0.38, ease: "easeInOut" });
    }, [animate, prefersReducedMotion]);

    const stopAnimation = useCallback(() => {
      animate(".success-check", { pathLength: 1 }, { duration: prefersReducedMotion ? 0 : 0.16 });
    }, [animate, prefersReducedMotion]);

    useImperativeHandle(ref, () => ({ startAnimation, stopAnimation }), [startAnimation, stopAnimation]);

    return (
      <motion.svg
        ref={scope}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
        style={{ pointerEvents: "none" }}
      >
        <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
        <motion.path
          d="m9 12 2 2 4-4"
          className="success-check"
          initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
        />
      </motion.svg>
    );
  },
);

ArrowNarrowRightIcon.displayName = "ArrowNarrowRightIcon";
SendIcon.displayName = "SendIcon";
CheckedIcon.displayName = "CheckedIcon";
