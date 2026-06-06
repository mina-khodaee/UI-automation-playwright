import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit SecurityEquipmentTypes
export const getSecurityEquipmentTypes = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.SecurityEquipmentTypes.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE SecurityEquipmentTypes
export const createSecurityEquipmentTypes = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.SecurityEquipmentTypes.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// DELETE SecurityEquipmentTypes
export const deleteSecurityEquipmentTypes = async (id) => {
  try {
    await axiosInstance.delete(endpoints.SecurityEquipmentTypes.delete, {
      data: { securityEquipmentTypeIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};

// UPDATE SecurityEquipmentTypes
export const updateSecurityEquipmentTypes = async ({ securityEquipmentTypeId, ...data }) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.SecurityEquipmentTypes.update}/${securityEquipmentTypeId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating visitor type:', error);
    throw error;
  }
};
