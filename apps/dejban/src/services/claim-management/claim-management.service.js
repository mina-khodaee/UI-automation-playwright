// src/services/claim/claim.service.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClaim,
  getClaimType,
  createClaim,
  updateClaim,
  deleteClaim,
  createClaimType,
  updateClaimType,
  deleteClaimType,
  getClaimTypesWithClaims,
} from './claim-management.http';

// ----------------------------------------------------------------------
// Query Keys
export const claimKeys = {
  all: ['claims'],
  list: (params) => ['claims', 'list', params],
  detail: (id) => ['claims', id],
};

export const claimTypeKeys = {
  all: ['claimTypes'],
  list: (params) => ['claimTypes', 'list', params],
  detail: (id) => ['claimTypes', id],
};

// ----------------------------------------------------------------------
// GET Claims with pagination
export const useGetClaim = (params) =>
  useQuery({
    queryKey: claimKeys.list(params),
    queryFn: () => getClaim(params),
    keepPreviousData: true,
  });

// GET Claims with pagination
export const useGetClaimTypesWithClaims = (params) =>
  useQuery({
    queryKey: claimKeys.list(params),
    queryFn: () => getClaimTypesWithClaims(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// GET Claim Types (for dropdown)
export const useGetClaimType = (params = {}) =>
  useQuery({
    queryKey: ['claimTypes', params],
    queryFn: () => getClaimType(params),
  });

// ----------------------------------------------------------------------
// CREATE Claim
export const useCreateClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Claim
export const useUpdateClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Claim
export const useDeleteClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// CREATE ClaimType
export const useCreateClaimType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createClaimType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimTypeKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE ClaimType
export const useUpdateClaimType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateClaimType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimTypeKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE ClaimType
export const useDeleteClaimType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClaimType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimTypeKeys.all });
    },
  });
};
