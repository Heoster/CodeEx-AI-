"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SohamLoader } from "./soham-loader";

export default function LoadingManager() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!pathname) return;

    setLoading(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!loading) return null;

  return <SohamLoader variant="overlay" label="Loading…" />;
}
