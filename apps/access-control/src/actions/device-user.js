import useSWR from 'swr';
import { useMemo } from 'react';

import * as api from 'src/lib/api';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateOnMount: true,
};

// ----------------------------------------------------------------------

export function useGetDeviceUsers(filters, searchTerm, sortColumn, sortOrder, page, pageSize) {
  const queryParams = {
    filters,
    searchTerm,
    sortColumn,
    sortOrder,
    page,
    pageSize
  };
  const url = Object.keys(queryParams).length
    ? [api.endpoints.aclUserManagement.list, { params: queryParams }]
    : api.endpoints.aclUserManagement.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      deviceUsers: data?.items || [],
      deviceUsersLoading: isLoading,
      deviceUsersTotalCount: data?.totalCount,
      deviceUsersError: error,
      deviceUsersValidating: isValidating,
      deviceUsersEmpty: !isLoading && !data?.items?.length,
      mutate
    }),
    [data?.items, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetDeviceUser(id) {
  const url = id ? `${api.endpoints.aclUserManagement.detail}/${id}` : '';

  const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      deviceUser: data,
      deviceUserLoading: isLoading,
      deviceUserError: error,
      deviceUserValidating: isValidating,
      mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function deleteDeviceUsers(deviceUserId, syncWithDevicesInUserAccessGroups) {
  const url = api.endpoints.aclUserManagement.delete;
  const queryParameter = { ids: [deviceUserId], syncWithDevicesInUserAccessGroups };
  const data = api.deleteItem(url, queryParameter);
  return data;
}

// ----------------------------------------------------------------------

export function CreateDeviceUser(newDeviceUser) {

  const url = api.endpoints.aclUserManagement.create;

  const result = api.createItem(url, newDeviceUser);

  return result;
}

// ----------------------------------------------------------------------

export function quickCreateDeviceUser(newDeviceUser) {

  const url = api.endpoints.aclUserManagement.quickCreate;

  const result = api.createItem(url, newDeviceUser);

  return result;
}

// ----------------------------------------------------------------------

export function UpdateDeviceUser(data) {

  const url = api.endpoints.aclUserManagement.update;
  const result = api.updateItem(url, data);
  return result;
}

// ----------------------------------------------------------------------

export function updateAccessGroupIds(data) {

  const url = api.endpoints.aclUserManagement.updateAccessGroupIds;
  const result = api.updateItem(url, data);
  return result;
}

// ----------------------------------------------------------------------

export function updateAccessAuthorities(data) {

  const url = api.endpoints.aclUserManagement.updateAccessAuthorities;
  const result = api.updateItem(url, data);
  return result;
}

// ----------------------------------------------------------------------

export function updateAuthTypeConfig(data) {

  const url = api.endpoints.aclUserManagement.updateAuthTypeConfig;
  const result = api.updateItem(url, data);
  return result;
}

// ----------------------------------------------------------------------

export async function getUserTypes() {
  const url = api.endpoints.aclUserManagement.getUserTypes;
  const data = await api.fetcher(url);
  return data;

}

// ----------------------------------------------------------------------

export function setUserBiometricDataToDevices(userId) {

  const url = api.endpoints.aclUserManagement.SetUserBiometricDataToDevices;

  const result = api.createItem(url, userId);

  return result;
}

// ----------------------------------------------------------------------

export function getUserBiometricDataFromDevice(data) {

  const url = api.endpoints.aclUserManagement.getBiometricData;

  const result = api.createItem(url, data);

  return result;
}

// ----------------------------------------------------------------------


