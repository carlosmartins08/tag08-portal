"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

interface ResilientImageProps extends Omit<ImageProps, "fill" | "onError"> {
  fallbackLabel: string;
}

/** Keeps editorial media meaningful when a remote CDN is temporarily unavailable. */
export default function ResilientImage({ fallbackLabel, alt, className, sizes, ...props }: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        aria-label={alt}
        className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#101011_0%,#161612_48%,#0b0b0b_100%)]"
        role="img"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--color-brand-secondary-rgb),0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--color-brand-secondary-rgb),0.06)_1px,transparent_1px)] bg-[size:28px_28px] opacity-45" />
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-secondary/10 blur-3xl" />
        <div className="absolute inset-0 flex items-end p-6 sm:p-8">
          <span className="tag08-meta text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary/80">
            {fallbackLabel}
          </span>
        </div>
      </div>
    );
  }

  return <Image {...props} fill alt={alt} className={className} sizes={sizes} onError={() => setHasError(true)} />;
}
