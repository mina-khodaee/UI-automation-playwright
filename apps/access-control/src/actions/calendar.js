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

export function useGetCalendars( searchTerm, sortOrder, pageSize, sortColumn) {
    const queryParams = {
        searchTerm,
        sortOrder,
        pageSize: 8,
        sortColumn
    };
    const url = Object.keys(queryParams).length
        ? [api.endpoints.calendars.list, { params: queryParams }]
        : api.endpoints.calendars.list;
    const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);
    const memoizedValue = useMemo(
        () => ({
            calendars: data?.items || [],
            calendarsLoading: isLoading,
            calendarsTotalCount: data?.totalCount || 0,
            calendarsError: error,
            calendarsValidating: isValidating,
            calendarsEmpty: !isLoading && !data?.items?.length,
            mutate
        }),
        [data?.items, error, isLoading, isValidating, mutate, data?.totalCount]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCalendar(id) {
    const url = id ? `${api.endpoints.calendars.detail}/${id}` : '';

    const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);

    const memoizedValue = useMemo(
        () => ({
            aclCalendar: data,
            aclCalendarLoading: isLoading,
            aclCalendarError: error,
            aclCalendarValidating: isValidating,
            mutate
        }),
        [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------

export function deleteCalendar(id) {
    const url = api.endpoints.calendars.delete;
    const queryParameter = { ids: [id] };
    const data = api.deleteItem(url, queryParameter);
    return data;
}

// ----------------------------------------------------------------------

export function CreateCalendar(newCalendar) {

    const url = api.endpoints.calendars.create;

    const result = api.createItem(url, newCalendar);

    return result;
}

// ----------------------------------------------------------------------

export function UpdateCalendar(data) {

    const url = api.endpoints.calendars.update;
    const result = api.updateItem(url, data);
    return result;
}

// ----------------------------------------------------------------------