import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET ShiftSupervisorAndDeputy
export const getShiftSupervisorAndDeputy = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.ShiftSupervisorAndDeputy.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE ShiftSupervisorAndDeputy
export const createShiftSupervisorAndDeputy = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.ShiftSupervisorAndDeputy.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// DELETE ShiftSupervisorAndDeputy
export const deleteShiftSupervisorAndDeputy = async (id) => {
  try {
    await axiosInstance.delete(endpoints.ShiftSupervisorAndDeputy.delete, {
      data: { ShiftSupervisorAndDeputyIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};

// UPDATE ShiftSupervisorAndDeputy
export const updateShiftSupervisorAndDeputy = async ({ shiftSupervisorAndDeputyId, ...data }) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.ShiftSupervisorAndDeputy.update}/${shiftSupervisorAndDeputyId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating visitor type:', error);
    throw error;
  }
};
