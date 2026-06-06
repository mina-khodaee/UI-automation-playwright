import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserClaims,
  getUsersList,
  getSelectUsersList,
  getUserRoles,
  getUserActivityHistory,
  getUsersWithSpecialClaim,
  getUsersWithExcludedClaim,
  getUserExcludedClaims,
  updateUser,
  deleteUser,
  createExcludeUserClaims,
} from './account-management.http';
import { accountManagementKeys } from './account-management.keys';

// ----------------------------------------------------------------------
// GET User Claims
export const useGetUserClaims = (params) =>
  useQuery({
    queryKey: accountManagementKeys.userClaimsList(params),
    queryFn: () => getUserClaims(params),
  });

// ----------------------------------------------------------------------
// GET Users List
export const useGetUsersList = (params) =>
  useQuery({
    queryKey: accountManagementKeys.userList(params),
    queryFn: () => getUsersList(params),
  });

// ----------------------------------------------------------------------
// GET Select Users List
export const useGetSelectUsersList = (params) =>
  useQuery({
    queryKey: accountManagementKeys.selectUserList(params),
    queryFn: () => getSelectUsersList(params),
  });

// ----------------------------------------------------------------------
// GET User Roles
export const useGetUserRoles = (params) =>
  useQuery({
    queryKey: accountManagementKeys.userRolesList(params),
    queryFn: () => getUserRoles(params),
  });

// ----------------------------------------------------------------------
// GET User Activity History
export const useGetUserActivityHistory = (params) =>
  useQuery({
    queryKey: accountManagementKeys.activityHistoryList(params),
    queryFn: () => getUserActivityHistory(params),
  });

// ----------------------------------------------------------------------
// GET Users With Special Claim (جدید)
export const useGetUsersWithSpecialClaim = (params) =>
  useQuery({
    queryKey: accountManagementKeys.usersWithSpecialClaimList(params),
    queryFn: () => getUsersWithSpecialClaim(params),
  });

// ----------------------------------------------------------------------
// GET Users With Excluded Claim (جدید)
export const useGetUsersWithExcludedClaim = (params) =>
  useQuery({
    queryKey: accountManagementKeys.usersWithExcludedClaimList(params),
    queryFn: () => getUsersWithExcludedClaim(params),
  });

// ----------------------------------------------------------------------
// GET User Excluded Claims (جدید)
export const useGetUserExcludedClaims = (params) =>
  useQuery({
    queryKey: accountManagementKeys.userExcludedClaimsList(params),
    queryFn: () => getUserExcludedClaims(params),
  });

// Create Exclude User Claims
export const useCreateExcludeUserClaims = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => createExcludeUserClaims(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: accountManagementKeys,
      });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE User
export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateUser(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: accountManagementKeys.users(),
      });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE User
export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: accountManagementKeys.users(),
      });
    },
  });
};
