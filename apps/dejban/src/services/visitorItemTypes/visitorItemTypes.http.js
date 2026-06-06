import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visitor Item Types List
export const getVisitorItemTypes = async () => {
  try {
    const response = await axiosInstance.get(endpoints.VisitorItemsTypes.list);
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor item types:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Visitor Item Type
export const createVisitorItemType = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.VisitorItemsTypes.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visitor item type:', error);
    throw error;
  }
};
