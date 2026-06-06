import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// // GET Visit PatrolShiftWorkPeriod
// export const getPatrolShiftWorkPeriod = async (params) => {
//   try {
//     const response = await axiosInstance.get(endpoints.PatrolShiftWorkPeriod.list, { params });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching visit schedules:', error);
//     throw error;
//   }
// };

// GET Visit PatrolArea
export const getPatrolShiftWorkPeriod = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.PatrolShiftWorkPeriod.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE PatrolShiftWorkPeriod
export const createPatrolShiftWorkPeriod = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.PatrolShiftWorkPeriod.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// DELETE PatrolShiftWorkPeriod
export const deletePatrolShiftWorkPeriod = async (id) => {
  try {
    await axiosInstance.delete(endpoints.PatrolShiftWorkPeriod.delete, {
      data: { PatrolShiftWorkPeriodIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};

// UPDATE PatrolShiftWorkPeriod
export const updatePatrolShiftWorkPeriod = async ({ patrolShiftWorkPeriodId, ...data }) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.PatrolShiftWorkPeriod.update}/${patrolShiftWorkPeriodId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating visitor type:', error);
    throw error;
  }
};
