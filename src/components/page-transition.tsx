"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Keying by pathname forces a remount when navigation occurs,
  // which allows CSS mount animations to run on new pages.
  return (
    <div key={pathname ?? "root"} className="page-transition" data-path={pathname}>
      {children}
    </div>
  );
}
