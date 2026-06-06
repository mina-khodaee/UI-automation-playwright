import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visitor BlackList Reasons
export const getVisitorBlackListReasons = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.VisitorBlackListReasons.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Visitor BlackList Reason
export const createVisitorBlackListReason = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.VisitorBlackListReasons.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visitor schedule:', error);
    throw error;
  }
};

// DELETE Visitor BlackList Reason
export const deleteVisitorBlackListReason = async (id) => {
  try {
    await axiosInstance.delete(endpoints.VisitorBlackListReasons.delete, {
      data: { blackListReasonIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};
