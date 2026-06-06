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

export function useGetDeviceTypes(filter, search, page, pageSize, sortOrder, sortColumn) {

    const queryParams = {
        filters: filter,
        searchTerm: search,
        page,
        pageSize,
        sortOrder,
        sortColumn,
      };
      const url = Object.keys(queryParams).length
        ? [api.endpoints.deviceTypes.list, { params: queryParams }]
        : api.endpoints.deviceTypes.list;
    const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);
    const memoizedValue = useMemo(
        () => ({
            deviceTypes: data?.items || [],
            deviceTypesLoading: isLoading,
            deviceTypesTotalCount: data?.totalCount || 0,
            deviceTypesError: error,
            deviceTypesValidating: isValidating,
            deviceTypesEmpty: !isLoading && !data?.items?.length,
            mutate
        }),
        [data?.items, error, isLoading, isValidating, mutate, data?.totalCount]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetDeviceType(id) {
    const url = id ? `${api.endpoints.deviceTypes.detail}/${id}` : '';

    const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            deviceType: data,
            deviceTypeLoading: isLoading,
            deviceTypeError: error,
            deviceTypeValidating: isValidating,
            mutate
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}


// ----------------------------------------------------------------------

export function CreateDeviceType(newDeviceType) {

    const url = api.endpoints.deviceTypes.create;

    const result = api.createItem(url, newDeviceType);

    return result;
}

// ----------------------------------------------------------------------

export function UpdateDeviceType(data) {

    const url = api.endpoints.deviceTypes.update;
    const result = api.updateItem(url, data);
    return result;
}

// ----------------------------------------------------------------------

export function deleteDeviceType(deviceId) {
    const url = api.endpoints.deviceTypes.delete;
    const deviceTypeIds = Array.isArray(deviceId) ? deviceId : [deviceId];
    const queryParameter = { ids: deviceTypeIds };
    const data = api.deleteItem(url, queryParameter);
    return data;
}

// ----------------------------------------------------------------------

export function useGetBrands() {
    const url = api.endpoints.deviceTypes.brands;
    const { data, isLoading, error, isValidating } = useSWR(url, api.fetcher, swrOptions);
    const memoizedValue = useMemo(
        () => ({
            brands: data || [],
            brandsLoading: isLoading,
            brandsError: error,
            brandsValidating: isValidating,
            brandsEmpty: !isLoading && !data?.length,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export async function getModels(devicebrand) {
    const queryParam = { brand: devicebrand };
    const url = api.endpoints.deviceTypes.models;
    const data = await api.getWithParams(url, queryParam);
    const result = data;
    return result;
}