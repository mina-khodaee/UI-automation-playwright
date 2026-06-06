import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visit Schedules List
export const getVisitSchedules = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.VisitSchedules.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Visit Schedule
export const createVisitSchedule = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.VisitSchedules.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Manager Schedules List
export const getManagerSchedule = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.VisitSchedules.mangerList, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching Manager schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// Approve Schedule
export const approveSchedule = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.VisitSchedules.approveSchedule, data);
    return response.data;
  } catch (error) {
    console.error('Error Approve schedule:', error);
    throw error;
  }
};


// ----------------------------------------------------------------------
// Deny Schedule
export const denySchedule = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.VisitSchedules.denySchedule, data);
    return response.data;
  } catch (error) {
    console.error('Error Deny schedule:', error);
    throw error;
  }
};