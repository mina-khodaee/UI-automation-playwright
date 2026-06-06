import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET SecurityEquipments with pagination
export const getSecurityEquipments = async ({
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

    const response = await axiosInstance.get(endpoints.SecurityEquipments.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching SecurityEquipments:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE SecurityEquipments
export const createSecurityEquipments = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.SecurityEquipments.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating SecurityEquipments:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE SecurityEquipments
export const updateSecurityEquipments = async (data) => {
  try {
    const response = await axiosInstance.put(`${endpoints.SecurityEquipments.update}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating SecurityEquipments:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE SecurityEquipments
export const deleteSecurityEquipments = async (id) => {
  try {
    await axiosInstance.delete(endpoints.SecurityEquipments.delete, {
      data: { SecurityEquipmentsId: id },
    });
    return true;
  } catch (error) {
    console.error('Error deleting SecurityEquipments:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET SecurityEquipments without pagination
export const getSecurityEquipmentsWithoutPagination = async () => {
  try {
    const response = await axiosInstance.get(endpoints.SecurityEquipments.selectList);
    return response.data;
  } catch (error) {
    console.error('Error fetching SecurityEquipments (without pagination):', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET single SecurityEquipments by ID
export const getSecurityEquipmentsById = async (id) => {
  try {
    const response = await axiosInstance.get(`${endpoints.SecurityEquipments.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SecurityEquipments by ID:', error);
    throw error;
  }
};
