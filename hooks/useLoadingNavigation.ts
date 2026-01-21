"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export const useLoadingNavigation = () => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Reset loading when pathname changes (navigation complete)
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const navigate = (href: string) => {
    if (pathname === href) return; // Already on this page
    setLoading(true);
    router.push(href);
  };

  return { loading, navigate, setLoading };
};
