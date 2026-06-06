import { useMemo } from 'react';
import { useSearchParams as _useSearchParams } from 'react-router';

// ----------------------------------------------------------------------

export function useSearchParams() {
  const [searchParams, setSearchParams] = _useSearchParams();

  return useMemo(() => [searchParams, setSearchParams], [searchParams]);
}
