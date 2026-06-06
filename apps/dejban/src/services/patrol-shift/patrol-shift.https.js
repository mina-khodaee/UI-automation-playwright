import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit PatrolShift
export const getPatrolShift = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.PatrolShifts.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE PatrolShift
export const createPatrolShift = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.PatrolShifts.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// DELETE PatrolShift
export const deletePatrolShift = async (id) => {
  try {
    await axiosInstance.delete(endpoints.PatrolShifts.delete, {
      data: { patrolShiftIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};

// UPDATE PatrolShift
export const updatePatrolShift = async ({ patrolShiftId, ...data }) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.PatrolShifts.update}/${patrolShiftId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating visitor type:', error);
    throw error;
  }
};
