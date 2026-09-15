import { useEffect, useRef, type ReactNode, type RefObject } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

type FocusManagedDialogProps = {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  labelledBy?: string;
  onClose: () => void;
};

/** A small, dependency-free modal primitive for keyboard-safe overlays. */
export default function FocusManagedDialog({
  ariaLabel,
  children,
  className,
  id,
  initialFocusRef,
  labelledBy,
  onClose
}: FocusManagedDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
    const focusInitial = () => (initialFocusRef?.current ?? focusable()[0] ?? dialog).focus();
    const frame = window.requestAnimationFrame(focusInitial);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const elements = focusable();
      if (elements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      dialog.removeEventListener("keydown", handleKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [initialFocusRef]);

  return (
    <div
      ref={dialogRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={className}
    >
      {children}
    </div>
  );
}
