// role hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as roleApi from './roleManagement.http';
import { roleKeys } from './role.keys';

export const useGetRoles = (params) =>
  useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => roleApi.getRoles(params),
    keepPreviousData: true,
  });

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: roleApi.createRole,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};

export const useUpdateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: roleApi.updateRole,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};

export const useDeleteRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: roleApi.deleteRole,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};

// ----------------------------------------------------------------------
// GET Role By Id
export const useGetRoleById = (id, options = {}) =>
  useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleApi.getRoleById(id),
    enabled: !!id, // فقط وقتی id وجود دارد
    ...options,
  });

export const useAssignClaimToRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => roleApi.assignClaimToRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
    },
  });
};

export const useGetRoleClaim = (roleId) =>
  useQuery({
    queryKey: roleKeys.list(roleId),
    queryFn: () =>
      roleApi.getRoleClaim({
        RoleId: roleId ? `${roleId}` : undefined,
      }),
  });

export const useGetRolesWithOutPagination = (params) =>
  useQuery({
    queryKey: [roleKeys.all, { ...params }],
    queryFn: () => roleApi.getRolesWithoutPagination(params),
  });
