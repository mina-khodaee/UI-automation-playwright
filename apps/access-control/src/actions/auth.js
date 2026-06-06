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

export function useGetMySessions(page, pageSize, sortOrder) {

    const queryParams = {
        page,
        pageSize,
        sortOrder
      };
      const url = Object.keys(queryParams).length
              ? [api.endpoints.auth.getMySessions, { params: queryParams }]
              : api.endpoints.auth.getMySessions;
          const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);
    const memoizedValue = useMemo(
        () => ({
            mySessions: data?.items || [],
            mySessionsLoading: isLoading,
            mySessionsTotalCount: data?.totalCount,
            mySessionsPage: data?.page,
            mySessionsPageSize: data?.pageSize,
            mySessionsError: error,
            mySessionsValidating: isValidating,
            mySessionsEmpty: !isLoading && !data?.items?.length,
            mutate
        }),
        [data?.items, error, isLoading, isValidating, mutate, data?.totalCount, data?.page, data?.pageSize]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function ChangePassword(newPassword) {

    const url = api.endpoints.auth.changePassword;
  
    const result = api.createItem(url, newPassword);
    
    return result;
}

// ------------------------------------------------------------------------

export function TerminateSession(jti) {

    const url = jti ? `${api.endpoints.auth.terminateSession}/${jti}` : '';
    const data = api.deleteItem(url);
    return data;
}

// ----------------------------------------------------------------------

export function TerminateOtherSessions() {
    const url = api.endpoints.auth.terminateOtherSession;
    const data = api.createItem(url);
    return data;
}