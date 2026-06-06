// reservedCards.http.js

import axiosInstance, { endpoints } from 'src/lib/api';

// ----------------------------------------------------------------------
// GET Reserved Cards List
export const getReservedCards = async () => {
  try {
    const response = await axiosInstance.get(endpoints.reservedCards.list);
    return response.data;
  } catch (error) {
    console.error('Error fetching reserved cards:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Reserved Card
export const createReservedCard = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.reservedCards.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating reserved card:', error);
    throw error;
  }
};
