"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SearchParamsProvider } from "./SearchParamsProvider";

export const ScrollToTop = () => {
  const pathname = usePathname();

  return (
    <SearchParamsProvider>
      {(searchParams) => {
        useEffect(() => {
          window.scrollTo(0, 0);
        }, [pathname, searchParams]);

        return null;
      }}
    </SearchParamsProvider>
  );
};
