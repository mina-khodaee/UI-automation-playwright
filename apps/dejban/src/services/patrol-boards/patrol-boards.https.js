// PatrolBoards.api.js
import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Patrol Boards List (with pagination)
export const getPatrolBoards = async ({
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
  ShiftId,
  WorkPeriodId,
  BoardDate,
}) => {
  try {
    const params = {
      page,
      pageSize,
      searchTerm,
      sortColumn,
      sortOrder,
      ShiftId,
      WorkPeriodId,
      BoardDate,
    };

    const response = await axiosInstance.get(endpoints.PatrolBoards.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching patrol boards:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Patrol Board Personnels List
export const getPatrolBoardPersonnels = async ({
  ShiftId,
  WorkPeriodId,
  BoardDate,
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
}) => {
  try {
    const params = {
      ShiftId,
      WorkPeriodId,
      BoardDate,
      page,
      pageSize,
      searchTerm,
      sortColumn,
      sortOrder,
    };

    const response = await axiosInstance.get(endpoints.PatrolBoards.boardList, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching patrol board personnels:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Patrol Board
export const createPatrolBoard = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.PatrolBoards.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating patrol board:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Patrol Board
export const updatePatrolBoard = async ({ id, ...payload }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.PatrolBoards.update}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating patrol board:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Patrol Board
export const deletePatrolBoard = async (id) => {
  try {
    await axiosInstance.delete(`${endpoints.PatrolBoards.delete}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting patrol board:', error);
    throw error;
  }
};
