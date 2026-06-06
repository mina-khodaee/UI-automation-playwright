import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as positionApi from './position.http';
import { roleKeys } from '../roleManagement/role.keys';
import * as roleApi from '../roleManagement/roleManagement.http';
import { getPositionClaim } from './position.http';

// ----------------------------------------------------------------------
// Query Keys
export const positionKeys = {
  all: ['positions'],
  list: (params) => ['positions', 'list', params],
  pagination: (params) => ['positions', 'pagination', params],
  detail: (id) => ['positions', id],
};

// ----------------------------------------------------------------------
// GET Positions (simple list)
export const useGetPositions = (params) =>
  useQuery({
    queryKey: positionKeys.list(params),
    queryFn: () => positionApi.getPositions(params),
  });

// GET Positions Claim

export const useGetPositionClaim = (positionId) =>
  useQuery({
    queryKey: positionKeys.list(positionId),
    queryFn: () =>
      positionApi.getPositionClaim({
        RoleId: positionId ? `${positionId}` : undefined,
      }),
  });

// ----------------------------------------------------------------------
// GET Positions with pagination
export const useGetPositionsWithPagination = (params) =>
  useQuery({
    queryKey: positionKeys.pagination(params),
    queryFn: () => positionApi.getPositionsWithPagination(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// GET Position by Id
export const useGetPositionById = (id, options = {}) =>
  useQuery({
    queryKey: positionKeys.detail(id),
    queryFn: () => positionApi.getPositionById(id),
    enabled: !!id,
    ...options,
  });

// ----------------------------------------------------------------------
// CREATE Position
export const useCreatePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => positionApi.createPosition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: positionKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Position
export const useUpdatePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => positionApi.updatePosition(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: positionKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Position
export const useDeletePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => positionApi.deletePosition(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: positionKeys.all });
    },
  });
};
