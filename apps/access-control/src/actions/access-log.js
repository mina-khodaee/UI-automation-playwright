import useSWR from 'swr';
import { useMemo } from 'react';

import * as api from 'src/lib/api';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetAccessLogs(filters, searchTerm, sortColumn, sortOrder, page, pageSize) {
  const queryParams = {
    filters,
    searchTerm,
    sortColumn,
    sortOrder,
    page,
    pageSize,
  };
  const url = Object.keys(queryParams).length
    ? [api.endpoints.accessLogs.list, { params: queryParams }]
    : api.endpoints.accessLogs.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      accessLogs: data?.items || [],
      accessLogsTotalCount: data?.totalCount,
      accessLogsLoading: isLoading,
      accessLogsError: error,
      accessLogsValidating: isValidating,
      mutate
    }),
    [data?.items, error, isLoading, isValidating, mutate, data?.totalCount]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetAuthModes() {
  const url = api.endpoints.aclUserManagement.getAuthModes;
  const { data, isLoading, error, isValidating } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      authModes: data || [],
      authModesLoading: isLoading,
      authModesEmpty: !isLoading && !data?.length,
      authModesError: error,
      authModesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating,]
  );
  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetAuthTypes() {
  const url = api.endpoints.aclUserManagement.getAuthTypes;
  const { data, isLoading, error, isValidating } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      authTypes: data || [],
      authTypesLoading: isLoading,
      authTypesEmpty: !isLoading && !data?.length,
      authTypesError: error,
      authTypesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating,]
  );
  return memoizedValue;
}