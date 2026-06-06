import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Personnel BlackList Reasons
export const getPersonnelBlackListReasons = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.PersonnelBlackListReasons.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching personnel schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Personnel BlackList Reason
export const createPersonnelBlackListReason = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.PersonnelBlackListReasons.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating personnel schedule:', error);
    throw error;
  }
};

// DELETE Personnel BlackList Reason
export const deletePersonnelBlackListReason = async (id) => {
  try {
    await axiosInstance.delete(endpoints.PersonnelBlackListReasons.delete, {
      data: { blackListReasonIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};
