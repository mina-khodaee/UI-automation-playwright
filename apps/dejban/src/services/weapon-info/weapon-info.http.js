import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Weapon Info with pagination
export const getWeaponInfos = async ({
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
} = {}) => {
  try {
    const params = {
      page,
      pageSize,
      searchTerm,
      sortColumn,
      sortOrder,
    };

    const response = await axiosInstance.get(endpoints.major.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Weapon Info:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Weapon Info
export const createWeaponInfo = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.major.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating Weapon Info:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Weapon Info
export const updateWeaponInfo = async ({ id, ...data }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.major.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating Weapon Info:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Weapon Info
export const deleteWeaponInfo = async (id) => {
  try {
    await axiosInstance.delete(endpoints.major.delete, {
      data: { majorIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting Weapon Info:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Weapon Info without pagination

export const getWeaponInfosWithoutPagination = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.major.list, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching Weapon Info (without pagination):', error);
    throw error;
  }
};
