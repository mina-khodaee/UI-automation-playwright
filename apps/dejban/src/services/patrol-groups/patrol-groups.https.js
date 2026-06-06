import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit PatrolGroups
export const getPatrolGroups = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.PatrolGroups.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE PatrolGroups
export const createPatrolGroups = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.PatrolGroups.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// DELETE PatrolGroups
export const deletePatrolGroups = async (id) => {
  try {
    await axiosInstance.delete(endpoints.PatrolGroups.delete, {
      data: { groupIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};

// UPDATE PatrolGroups
export const updatePatrolGroups = async ({ patrolGroupId, ...data }) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.PatrolGroups.update}/${patrolGroupId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating visitor type:', error);
    throw error;
  }
};
