import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit Contract
export const getContract = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.contract.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Contract
export const createContract = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.contract.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// DELETE Contract
export const deleteContract = async (id) => {
  try {
    await axiosInstance.delete(endpoints.contract.delete, { data: { Contract: [id] } });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};
