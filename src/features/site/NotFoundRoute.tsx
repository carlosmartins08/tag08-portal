"use client";

import { useRouter } from "next/navigation";
import NotFound from "./pages/NotFound";

export default function NotFoundRoute() {
  const router = useRouter();

  return <NotFound onNavigate={(path) => router.push(path)} />;
}
