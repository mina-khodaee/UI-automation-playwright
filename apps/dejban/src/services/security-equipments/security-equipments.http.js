import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit SecurityEquipments
export const getSecurityEquipments = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.SecurityEquipments.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
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
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// DELETE SecurityEquipments
export const deleteSecurityEquipments = async (id) => {
  try {
    await axiosInstance.delete(endpoints.SecurityEquipments.delete, {
      data: { SecurityEquipmentIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};

// UPDATE SecurityEquipments
export const updateSecurityEquipments = async ({ securityEquipmentId, ...data }) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.SecurityEquipments.update}/${securityEquipmentId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating visitor type:', error);
    throw error;
  }
};
