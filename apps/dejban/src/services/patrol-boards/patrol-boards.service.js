// patrolBoards.hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patrolBoardsKeys } from './patrol-boards.keys';
import * as patrolBoardApi from './patrol-boards.https';

// ----------------------------------------------------------------------
// List Patrol Boards
export const useGetPatrolBoards = (params) =>
  useQuery({
    queryKey: patrolBoardsKeys.list(params),
    queryFn: () => patrolBoardApi.getPatrolBoards(params),
    keepPreviousData: true,
  });

// ----------------------------------------------------------------------
// Get Patrol Board Personnels
export const useGetPatrolBoardPersonnels = (params) =>
  useQuery({
    queryKey: patrolBoardsKeys.personnels(params),
    queryFn: () => patrolBoardApi.getPatrolBoardPersonnels(params),
    keepPreviousData: true,
    enabled: !!params.boardId,
  });

// ----------------------------------------------------------------------
// Create Patrol Board
export const useCreatePatrolBoard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patrolBoardApi.createPatrolBoard,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patrolBoardsKeys.lists() });
    },
  });
};

// ----------------------------------------------------------------------
// Update Patrol Board
export const useUpdatePatrolBoard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patrolBoardApi.updatePatrolBoard,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: patrolBoardsKeys.lists() });
      qc.invalidateQueries({ queryKey: patrolBoardsKeys.detail(variables.id) });
    },
  });
};

// ----------------------------------------------------------------------
// Delete Patrol Board
export const useDeletePatrolBoard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patrolBoardApi.deletePatrolBoard,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: patrolBoardsKeys.lists() });
    },
  });
};
