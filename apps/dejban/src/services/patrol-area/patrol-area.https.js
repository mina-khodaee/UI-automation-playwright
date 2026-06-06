import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit PatrolArea
export const getPatrolArea = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.PatrolArea.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE PatrolArea
export const createPatrolArea = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.PatrolArea.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// DELETE PatrolArea
export const deletePatrolArea = async (id) => {
  try {
    await axiosInstance.delete(endpoints.PatrolArea.delete, {
      data: { PatrolAreaIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};

// UPDATE PatrolArea
export const updatePatrolArea = async ({ patrolAreaId, ...data }) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.PatrolArea.update}/${patrolAreaId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating visitor type:', error);
    throw error;
  }
};
