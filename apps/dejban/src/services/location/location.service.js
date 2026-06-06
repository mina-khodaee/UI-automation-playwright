import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as locationApi from './location.http';
import { locationKeys } from './location.keys';

// ----------------------------------------------------------------------
// Get Location As Tree List View

export const useGetLocationTreeList = (params) =>
  useQuery({
    queryKey: locationKeys.list(params),
    queryFn: () => locationApi.getLocationTreeList(params),
  });

// ----------------------------------------------------------------------
// Create Country In Tree List View

export const useCreateCountries = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => locationApi.createCountries(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// Create Provience In Tree List View

export const useCreateProvinces = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => locationApi.createProvinces(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// Create City In Tree List View

export const useCreateCities = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => locationApi.createCities(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// Update Country In Tree List View With Id In Url

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => locationApi.updateCountries(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// Update Provience In Tree List View With Id In Url

export const useUpdateProvience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => locationApi.updateProvinces(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// Update City In Tree List View With Id In Url

export const useUpdateCity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => locationApi.updateCities(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// Delete Country In Tree List View

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => locationApi.deleteCountries(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// Delete Provience In Tree List View

export const useDeleteProvience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => locationApi.deleteProvinces(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// Delete City In Tree List View

export const useDeleteCity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => locationApi.deleteCities(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// Get Country For SelectBox

export const useGetCountries = (params) =>
  useQuery({
    queryKey: locationKeys.country(params),
    queryFn: () => locationApi.getCountries(params),
  });

// ----------------------------------------------------------------------
// Get Provience For SelectBox

export const useGetProviences = (params) =>
  useQuery({
    queryKey: locationKeys.provience(params),
    queryFn: () => locationApi.getProviences(params),
  });

// ----------------------------------------------------------------------
// Get City For SelectBox

export const useGetCities = (params) =>
  useQuery({
    queryKey: locationKeys.city(params),
    queryFn: () => locationApi.getCities(params),
  });