import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Personnel BlackList
export const getPersonnelBlackList = async (params) => {
  try {
    const response = await axiosInstance.get(endpoints.PersonnelBlackList.list, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching personnel schedules:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Personnel BlackList
export const createPersonnelBlackList = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.PersonnelBlackList.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating personnel schedule:', error);
    throw error;
  }
};

// DELETE Personnel BlackList
export const deletePersonnelBlackList = async (id) => {
  try {
    await axiosInstance.delete(endpoints.PersonnelBlackList.delete, {
      data: { blackListIds: [id] },
    });
    return true;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
};
