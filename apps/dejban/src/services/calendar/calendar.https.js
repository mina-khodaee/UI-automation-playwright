import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Calendar
export const getCalendar = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.Calendar.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching calendars:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Calendar
export const createCalendar = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.Calendar.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating calendar:', error);
    throw error;
  }
};

// DELETE Calendar
export const deleteCalendar = async (id) => {
  try {
    await axiosInstance.delete(endpoints.Calendar.delete, {
      data: { CalendarIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting calendar:', error);
    throw error;
  }
};

// UPDATE Calendar
export const updateCalendar = async ({ calendarId, ...data }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.Calendar.update}/${calendarId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating calendar:', error);
    throw error;
  }
};
