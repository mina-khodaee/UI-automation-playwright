// src/services/claim/claim.http.js

import axiosInstance, { endpoints } from 'src/lib/api';
import { useGetClaimTypesWithClaims } from './claim-management.service';

// ----------------------------------------------------------------------
// GET ClaimTypes (انواع دسترسی‌ها)
export const getClaimType = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.claimManagement.getClaimType, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching ClaimTypes:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// GET Claims (لیست دسترسی‌ها)
export const getClaim = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.claimManagement.getClaim, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Claims:', error);
    throw error;
  }
};

export const getClaimTypesWithClaims = async (params = {}) => {
  try {
    const response = await axiosInstance.get(endpoints.claimManagement.getClaimTypesWithClaims, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Claims:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE Claim (ایجاد دسترسی)
export const createClaim = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.claimManagement.createClaim, data);
    return response.data;
  } catch (error) {
    console.error('Error creating Claim:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE Claim (ویرایش دسترسی)
export const updateClaim = async (data) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.claimManagement.getClaim}/${data.id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating Claim:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE Claim (حذف دسترسی)
export const deleteClaim = async (id) => {
  try {
    const response = await axiosInstance.delete(`${endpoints.claimManagement.getClaim}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting Claim:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// CREATE ClaimType (ایجاد نوع دسترسی)
export const createClaimType = async (data) => {
  try {
    const response = await axiosInstance.post(endpoints.claimManagement.createClaimType, data);
    return response.data;
  } catch (error) {
    console.error('Error creating ClaimType:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// UPDATE ClaimType (ویرایش نوع دسترسی)
export const updateClaimType = async (data) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.claimManagement.getClaimType}/${data.id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating ClaimType:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// DELETE ClaimType (حذف نوع دسترسی)
export const deleteClaimType = async (id) => {
  try {
    const response = await axiosInstance.delete(`${endpoints.claimManagement.getClaimType}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting ClaimType:', error);
    throw error;
  }
};
