"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function LoadingManager() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const incRef = useRef<number | null>(null);

  useEffect(() => {
    // When pathname changes, show loader
    if (!pathname) return;
    setLoading(true);
    setProgress(10);

    // slowly increase progress while loading
    if (incRef.current) window.clearInterval(incRef.current);
    incRef.current = window.setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 8;
        return next >= 85 ? 85 : Math.round(next);
      });
    }, 250);

    // hide after a small delay to avoid flicker if navigation is instant
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      // complete
      setProgress(100);
      if (incRef.current) {
        window.clearInterval(incRef.current);
        incRef.current = null;
      }
      // let the 100% be visible briefly
      window.setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    }, 600);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (incRef.current) window.clearInterval(incRef.current);
      timerRef.current = null;
      incRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div
        aria-hidden
        className={`app-top-progress ${loading ? "active" : ""}`}
        style={{
          transform: `scaleX(${Math.max(progress / 100, 0.02)})`,
          opacity: loading ? 1 : 0,
        }}
      />

      <div className={`loading-overlay ${loading ? "show" : ""}`}>
        <div className="loading-panel" aria-hidden>
          <div className="ui-spinner" />
          <div className="loading-text">Loading…</div>
        </div>
      </div>
    </>
  );
}
