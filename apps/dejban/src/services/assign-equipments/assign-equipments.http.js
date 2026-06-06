import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit AssignEquipments
export const getAssignEquipmentsList = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.AssignEquipments.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE AssignEquipments
export const createAssignEquipments = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.AssignEquipments.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};
