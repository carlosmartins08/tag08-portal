import type { ComponentPropsWithoutRef, ReactNode } from "react";

function mergeClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

type SurfaceProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
};

/** Shared canvas for every public route. It deliberately owns no product logic. */
export function PageCanvas({ className, children, ...props }: SurfaceProps) {
  return (
    <div className={mergeClasses("tag08-page", className)} {...props}>
      {children}
    </div>
  );
}

export function ContextNav({ className, children, ...props }: SurfaceProps) {
  return (
    <div className={mergeClasses("tag08-context-nav", className)} {...props}>
      {children}
    </div>
  );
}

export function SectionIntro({ className, children, ...props }: SurfaceProps) {
  return (
    <div className={mergeClasses("tag08-section-intro", className)} {...props}>
      {children}
    </div>
  );
}

export function VisualLabel({ className, children, ...props }: SurfaceProps) {
  return (
    <span className={mergeClasses("tag08-label", className)} {...props}>
      {children}
    </span>
  );
}
