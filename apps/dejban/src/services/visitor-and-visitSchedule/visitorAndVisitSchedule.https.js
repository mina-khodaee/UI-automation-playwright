import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Visitor And VisitSchedule List
export const getVisitorAndVisitSchedule = async ({
  page = 1,
  pageSize = 10,
  searchTerm = '',
  sortColumn,
  sortOrder,
} = {}) => {
  try {
    const params = { page, pageSize, searchTerm, sortColumn, sortOrder };
    const response = await axiosInstance.get(endpoints.VisitorAndVisitSchedule.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit schedules:', error);
    throw error;
  }
};

// GET VisitorAndVisitSchedule By ID
export const VisitorAndVisitScheduleById = async (id) => {
  try {
    const response = await axiosInstance.get(endpoints.VisitorAndVisitSchedule.getById(id));
    return response.data;
  } catch (error) {
    console.error('Error fetching VisitorAndVisitSchedule:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Visitor And VisitSchedule
export const createVisitorAndVisitSchedule = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.VisitorAndVisitSchedule.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating visit schedule:', error);
    throw error;
  }
};

// UPDATE Visitor And VisitSchedule
export const updateVisitorAndVisitSchedule = async (...payload) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.VisitorAndVisitSchedule.update}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('Error updating visitor:', error);
    throw error;
  }
};
