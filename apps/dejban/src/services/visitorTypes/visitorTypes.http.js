import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visitor Types List
export const getVisitorTypesList = async () => {
  try {
    const response = await axiosInstance.get(endpoints.visitorType.list);
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor types:', error);
    throw error;
  }
};

export const getSelectVisitorTypesList = async () => {
  try {
    const response = await axiosInstance.get(endpoints.visitorType.selectList);
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor types:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Visitor Type
export const createVisitorType = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.visitorType.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visitor type:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Visitor Type
export const updateVisitorType = async ({ id, ...payload }) => {
  try {
    const response = await axiosInstance.put(endpoints.visitorType.update(id), payload);
    return response.data;
  } catch (error) {
    console.error('Error updating visitor type:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Visitor Type
export const deleteVisitorType = async (ids) => {
  try {
    await axiosInstance.delete(endpoints.visitorType.delete, { data: { ids } });
    return true;
  } catch (error) {
    console.error('Error deleting visitor types:', error);
    throw error;
  }
};
