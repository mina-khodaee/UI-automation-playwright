import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visitor Items List
export const getVisitorItems = async () => {
  try {
    const response = await axiosInstance.get(endpoints.VisitorItems.list);
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor items:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Visitor Item
export const createVisitorItem = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.VisitorItems.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visitor item:', error);
    throw error;
  }
};
