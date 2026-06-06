import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as weaponInfoApi from './weapon-info.http';
import { WeaponInfoKeys } from './weapon-info.keys';

// ----------------------------------------------------------------------
// GET Weapon Infos
export const useGetWeaponInfos = (params) =>
  useQuery({
    queryKey: WeaponInfoKeys.list(params),
    queryFn: () => weaponInfoApi.getMajors(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// CREATE Weapon Info
export const useCreateWeaponInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => weaponInfoApi.createMajors(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WeaponInfoKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE Weapon Info
export const useUpdateWeaponInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => weaponInfoApi.updateMajors(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WeaponInfoKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE Weapon Info
export const useDeleteWeaponInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => weaponInfoApi.deleteMajor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WeaponInfoKeys.all });
    },
  });
};

// ----------------------------------------------------------------------
// GET Weapon Infos Without Pagination
export const useGetWeaponInfosWithOutPagination= (params) =>
  useQuery({
    queryKey: WeaponInfoKeys.list(params),
    queryFn: () => weaponInfoApi.getMajorsWithoutPagination(params),
  });