'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams as _useSearchParams } from 'next/navigation';

export function useSearchParams() {
  const router = useRouter();
  const searchParams = _useSearchParams();

  const navigate = useCallback(
    (params, options) => {
      const method = options && options.replace ? 'replace' : 'push';
      router[method](`?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const api = useMemo(() => {
    return {
      /** Read */
      get(key) {
        return searchParams.get(key);
      },

      /** Set / update */
      set(values, options) {
        if (Object.keys(values).length === 0) {
          navigate(new URLSearchParams(), options);
          return;
        }

        const params = new URLSearchParams(searchParams.toString());

        Object.entries(values).forEach(([key, value]) => {
          if (value === null || value === undefined || value === '') {
            params.delete(key);
          } else {
            params.set(key, String(value));
          }
        });

        navigate(params, options);
      },

      /** Remove one or more */
      remove(keys, options) {
        const params = new URLSearchParams(searchParams.toString());
        [].concat(keys).forEach((key) => params.delete(key));
        navigate(params, options);
      },

      /** Clear all params */
      reset(options) {
        navigate(new URLSearchParams(), options);
      },

      /** Raw params */
      raw: searchParams,
    };
  }, [navigate, searchParams]);

  return api;
}
