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

export function useGetDevices(filters, searchTerm) {
  const queryParams = {
    filters,
    searchTerm,
  };
  const url = Object.keys(queryParams).length
    ? [api.endpoints.devices.list, { params: queryParams }]
    : api.endpoints.devices.list;
  const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      devices: data?.items || [],
      devicesLoading: isLoading,
      devicesTotalCount: data?.totalCount || 0,
      devicesError: error,
      devicesValidating: isValidating,
      devicesEmpty: !isLoading && !data?.items?.length,
      mutate
    }),
    [data?.items, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetDevice(id) {
  const url = id ? `${api.endpoints.devices.detail}/${id}` : '';

  const { data, isLoading, error, isValidating, mutate } = useSWR(url, api.fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      device: data,
      deviceLoading: isLoading,
      deviceError: error,
      deviceValidating: isValidating,
      mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function deleteDevice(deviceId) {
  const url = api.endpoints.devices.delete;
  const deviceIds = Array.isArray(deviceId) ? deviceId : [deviceId];
  const queryParameter = { ids: deviceIds };
  const data = api.deleteItem(url, queryParameter);
  return data;
}

// ----------------------------------------------------------------------

export function CreateDevice(newDevice) {

  const url = api.endpoints.devices.create;

  const result = api.createItem(url, newDevice);
  
  return result;
}

// ----------------------------------------------------------------------

export function UpdateDevice(data) {

  const url = api.endpoints.devices.update;
  const result = api.updateItem(url, data);
  return result;
}

// ----------------------------------------------------------------------

export async function getFirmwareVersion(deviceBrand, deviceTerminalId, deviceSerialNumber) {
  const queryParams = {
    brand: deviceBrand,
    terminalId: deviceTerminalId,
    serialNumber: deviceSerialNumber
  };
  const url = api.endpoints.devices.firmwareVersion;
  const data = await api.getWithParams(url, queryParams);
  return data;

}

// ----------------------------------------------------------------------
// Settings
// ----------------------------------------------------------------------

export function useGetNetworkTypes() {
  const url = api.endpoints.devices.settings.networkTypes;
  const { data, isLoading, error, isValidating } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      networkTypes: data || [],
      networkTypesLoading: isLoading,
      networkTypesEmpty: !isLoading && !data?.length,
      networkTypesError: error,
      networkTypesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating,]
  );
  return memoizedValue;
}

// ----------------------------------------------------------------------

export function saveNetworkOptions(options) {

  const url = api.endpoints.devices.settings.saveNetworkOptions;

  const result = api.createItem(url, options);
 
  return result;
}

// ----------------------------------------------------------------------

export function saveInterfaceOptions(options) {

  const url = api.endpoints.devices.settings.saveInterfaceOptions;

  const result = api.createItem(url, options);
  
  return result;
}

// -----------------------------------------------------------------------

export function saveSecurityOptions(options) {
  const url = api.endpoints.devices.settings.saveSecurityOptions;

  const result = api.createItem(url, options);
  console.log(result);
  return result;
}

// -----------------------------------------------------------------------

export function setNetworkOptions(id) {

  const url = id ? `${api.endpoints.devices.settings.setNetworkOptions}/${id}` : '';

  const result = api.setItem(url);
 
  return result;
}

// ----------------------------------------------------------------------

export function setInterfaceOptions(id) {

  const url = id ? `${api.endpoints.devices.settings.setInterfaceOptions}/${id}` : '';

  const result = api.setItem(url);

  return result;
}

// -----------------------------------------------------------------------

export function setSecurityOptions(id) {

  const url = id ? `${api.endpoints.devices.settings.setSecurityOptions}/${id}` : '';

  const result = api.setItem(url);
  return result;
}

// ----------------------------------------------------------------------
export function useGetVirdiAccessLevels() {
  const url = api.endpoints.devices.settings.virdiAccessLevels;
  const { data, isLoading, error, isValidating } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      accessLevels: data || [],
      accessLevelsLoading: isLoading,
      accessLevelsEmpty: !isLoading && !data?.length,
      accessLevelsError: error,
      accessLevelsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating,]
  );
  return memoizedValue;
}

// ----------------------------------------------------------------------
export function useGetVirdiApplicationModes() {
  const url = api.endpoints.devices.settings.virdiApplicationModes;
  const { data, isLoading, error, isValidating } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      applicationModes: data || [],
      applicationModesLoading: isLoading,
      applicationModesEmpty: !isLoading && !data?.length,
      applicationModesError: error,
      applicationModesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating,]
  );
  return memoizedValue;
}

// ----------------------------------------------------------------------
export function useGetVirdiAntipassbackValues() {
  const url = api.endpoints.devices.settings.virdiAntipassbackValues;
  const { data, isLoading, error, isValidating } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      antipassbackValues: data || [],
      antipassbackValuesLoading: isLoading,
      antipassbackValuesEmpty: !isLoading && !data?.length,
      antipassbackValuesError: error,
      antipassbackValuesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating,]
  );
  return memoizedValue;
}

// ----------------------------------------------------------------------
export function useGetVirdiSecurityLevels() {
  const url = api.endpoints.devices.settings.virdiTerminalSecurityLevels;
  const { data, isLoading, error, isValidating } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      securityLevels: data || [],
      securityLevelsLoading: isLoading,
      securityLevelsEmpty: !isLoading && !data?.length,
      securityLevelsError: error,
      securityLevelsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating,]
  );
  return memoizedValue;
}

// ----------------------------------------------------------------------
export function useGetVirdiInputIDTypes() {
  const url = api.endpoints.devices.settings.virdiInputIDTypes;
  const { data, isLoading, error, isValidating } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      inputIDTypes: data || [],
      inputIDTypesLoading: isLoading,
      inputIDTypesEmpty: !isLoading && !data?.length,
      inputIDTypesError: error,
      inputIDTypesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating,]
  );
  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetDeviceTypeAuthenticationModes(id) {

  const url = id ? `${api.endpoints.devices.authModes}/${id}` : '';
  
  const { data, isLoading, error, isValidating } = useSWR(url, api.fetcher, swrOptions);
  const memoizedValue = useMemo(
    () => ({
      authenticationModes: data || [],
      authenticationModesLoading: isLoading,
      authenticationModesEmpty: !isLoading && !data?.length,
      authenticationModesError: error,
      authenticationModesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating,]
  );
  return memoizedValue;
}

// ----------------------------------------------------------------------

export function saveDeviceUsersBiometricData(ids) {

  const url = api.endpoints.devices.commands.getBiometricData;

  const result = api.createItem(url, ids);
  
  return result;
}

// ----------------------------------------------------------------------

export function sendBiometricDataToDevice(id) {

  const url = api.endpoints.devices.commands.setBiometricDataToDevice;

  const result = api.createItem(url, id);
  
  return result;
}

// ----------------------------------------------------------------------
