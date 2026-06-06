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

export function useGetAccessGroups(searchTerm, page, pageSize, sortOrder, sortColumn) {

    const queryParams = {
        searchTerm,
        page,
        pageSize,
        sortOrder,
        sortColumn,
      };
      const url = Object.keys(queryParams).length
              ? [api.endpoints.accessGroups.list, { params: queryParams }]
              : api.endpoints.accessGroups.list;
    const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);
    const memoizedValue = useMemo(
        () => ({
            accessGroups: data?.items || [],
            accessGroupsLoading: isLoading,
            accessGroupsTotalCount: data?.totalCount || 0,
            accessGroupsError: error,
            accessGroupsValidating: isValidating,
            accessGroupsEmpty: !isLoading && !data?.items?.length,
            mutate
        }),
        [data?.items, error, isLoading, isValidating, mutate, data?.totalCount]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetAccessGroup(id) {
    const url = id ? `${api.endpoints.accessGroups.detail}/${id}` : '';

    const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            accessGroup: data,
            accessGroupLoading: isLoading,
            accessGroupError: error,
            accessGroupValidating: isValidating,
            mutate
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}


// ----------------------------------------------------------------------

export function CreateAccessGroup(newAccessGroup) {

    const url = api.endpoints.accessGroups.create;

    const result = api.createItem(url, newAccessGroup);

    return result;
}

// ----------------------------------------------------------------------

export function UpdateAccessGroup(data) {

    const url = api.endpoints.accessGroups.update;
    const result = api.updateItem(url, data);
    return result;
}

// ----------------------------------------------------------------------

export function deleteAccessGroup(accessGroupId) {
    const url = api.endpoints.accessGroups.delete;
    const accessGroupIds = Array.isArray(accessGroupId) ? accessGroupId : [accessGroupId];
    const queryParameter = { ids: accessGroupIds };
    const data = api.deleteItem(url, queryParameter);
    return data;
}

// ----------------------------------------------------------------------

export function sendBiometricDataToDevices(accessGroupId) {

    const url = api.endpoints.accessGroups.setBiometricData;

    const result = api.createItem(url, accessGroupId);

    return result;
}

// ----------------------------------------------------------------------
