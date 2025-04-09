'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SearchParamsComponent({ children }: { children: (params: URLSearchParams) => React.ReactNode }) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}

export function SearchParamsProvider({ children }: { children: (params: URLSearchParams) => React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <SearchParamsComponent>
        {children}
      </SearchParamsComponent>
    </Suspense>
  );
}