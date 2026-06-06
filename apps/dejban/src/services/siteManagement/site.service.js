import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as siteApi from './site.http';

// ----------------------------------------------------------------------
// Query Keys
export const siteKeys = {
  all: ['site'],
  list: (params) => ['site', 'list', params],
  pagination: (params) => ['site', 'pagination', params],
  detail: (id) => ['site', id],
};

// ----------------------------------------------------------------------
// GET Sites (simple list)
export const useGetSites = (params) =>
  useQuery({
    queryKey: siteKeys.list(params),
    queryFn: () => siteApi.getSites(params),
  });

// ----------------------------------------------------------------------
// GET Sites with pagination
export const useGetSitesWithPagination = (params) =>
  useQuery({
    queryKey: siteKeys.pagination(params),
    queryFn: () => siteApi.getSitesWithPagination(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// CREATE Site
export const useCreateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => siteApi.createSite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Site
export const useUpdateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => siteApi.updateSite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Site
export const useDeleteSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => siteApi.deleteSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: siteKeys.all });
    },
  });
};
