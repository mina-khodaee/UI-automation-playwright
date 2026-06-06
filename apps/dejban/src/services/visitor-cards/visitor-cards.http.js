import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit VisitorCards
export const getVisitorCards = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.VisitorCards.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE VisitorCards
export const createVisitorCards = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.VisitorCards.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// DELETE VisitorCards
export const deleteVisitorCards = async (id) => {
  try {
    await axiosInstance.delete(endpoints.VisitorCards.delete, { data: { visitorCardIds: [id] } });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};
