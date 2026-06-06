import axiosInstance, { endpoints } from 'src/lib/api';

export const getSites = async (params) => {
  const res = await axiosInstance.get(endpoints.site.list, { params });
  return res.data;
};

export const createSite = async (data) => {
  const res = await axiosInstance.post(endpoints.site.create, data);
  return res.data;
};

export const updateSite = async (data) => {
  const res = await axiosInstance.put(endpoints.site.update, data);
  return res.data;
};

export const deleteSite = async (ids) => {
  const res = await axiosInstance.delete(endpoints.site.delete, { data: { ids } });
  return res.data;
};
