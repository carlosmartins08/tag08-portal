import type { KeyboardEvent } from "react";

/** Activates composite cards with the same keys supported by native buttons. */
export function activateOnKeyboard(event: KeyboardEvent<HTMLElement>, action: () => void) {
  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  action();
}
