import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as staffApi from './staff.http';
import { staffKeys } from './staff.keys';

// ----------------------------------------------------------------------
// CREATE Staff
export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => staffApi.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// Assign Role To User
export const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => staffApi.assignRoleToUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// GET Staffs with pagination
export const useGetStaffWithPagination = (params) =>
  useQuery({
    queryKey: staffKeys.pagination(params),
    queryFn: () => staffApi.getStaffWithPagination(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// Get User Role By UserId
export const useGetUserRoleById = (userId) => {
  return useQuery({
    queryKey: staffKeys.list(userId),
    queryFn: () => staffApi.getUserRoleById({
      UserId: userId ? `${userId}` : undefined
    }),
  });
};

// ----------------------------------------------------------------------
// Get User Detail By UserId
export const useGetUserById = (userId) => {
  return useQuery({
    queryKey: staffKeys.list(userId),
    queryFn: () => staffApi.getUserById(userId),
  });
};

// ----------------------------------------------------------------------
// Update UserName And Password By Admin
export const useChangeUserNameAndPasswordByAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => staffApi.updateUserNameAndUserPasswordByAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Staff
export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => staffApi.updateStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// GET Select Personnels
export const useGetSelectPersonnels = (params) =>
  useQuery({
    queryKey: staffKeys.selectList(params),
    queryFn: () => personnelApi.getSelectPersonnels(params),
  });
