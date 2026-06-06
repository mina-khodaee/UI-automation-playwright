import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit VisitorBlockList
export const getVisitorBlockList = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.VisitorBlockList.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE VisitorBlockList
export const createVisitorBlockList = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.VisitorBlockList.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// DELETE VisitorBlockList
export const deleteVisitorBlockList = async (id) => {
  try {
    await axiosInstance.delete(endpoints.VisitorBlockList.delete, { data: { blackListIds: [id] } });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};
