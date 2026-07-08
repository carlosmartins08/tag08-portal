import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackOutboundClick } from "../lib/analytics";

type TrackedOutboundLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  label: string;
  surface: string;
  language?: string;
  children: ReactNode;
};

export default function TrackedOutboundLink({
  label,
  surface,
  language,
  href = "#",
  onClick,
  children,
  ...anchorProps
}: TrackedOutboundLinkProps) {
  const handleClick: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] = (event) => {
    onClick?.(event);

    if (event.defaultPrevented || !href) {
      return;
    }

    trackOutboundClick({
      label,
      url: href,
      surface,
      language
    });
  };

  return (
    <a href={href} onClick={handleClick} {...anchorProps}>
      {children}
    </a>
  );
}
