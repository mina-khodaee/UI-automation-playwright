// src/services/doors/doors.http.js

import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Doors List
export const getDoorsList = async ({
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
} = {}) => {
  try {
    const params = { page, pageSize, searchTerm, sortColumn, sortOrder };
    const response = await axiosInstance.get(endpoints.doors.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching doors:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Door By ID 
export const getDoorById = async (id) => {
  try {
    const response = await axiosInstance.get(`${endpoints.doors.getById}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching door:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Door
export const createDoor = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.doors.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating door:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Door
export const updateDoor = async ({ id, ...payload }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.doors.update}/${id}`, {
      doorId: id,
      DoorName: payload.DoorName || payload.doorName,
      SiteId: payload.SiteId || payload.siteId,
      UnitId: payload.UnitId || payload.unitId,
      IsActive: payload.IsActive ?? payload.isActive,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating door:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Door 
export const deleteDoor = async (id) => {
  try {
    await axiosInstance.delete(endpoints.doors.delete, {
      data: { doorIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting door:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Multiple Doors
export const deleteMultipleDoors = async (ids) => {
  try {
    await axiosInstance.delete(endpoints.doors.delete, {
      data: { doorIds: ids },
    });
    return true;
  } catch (error) {
    console.error('Error deleting multiple doors:', error);
    throw error;
  }
};