'use client'

import { useMemo } from 'react';
import { useGetLocationTreeList } from 'src/services/location/location.service';
import { buildTree } from './constants';

export const useLocationTree = (selectedItem) => {
  const { data: apiData = [], isLoading, error } = useGetLocationTreeList();

  // Create Tree With Api Data
  const locationTree = useMemo(() => {
    return buildTree(apiData, selectedItem?.id);
  }, [apiData, selectedItem?.id]);

  const isEmpty = locationTree.length === 0;

  return {
    locationTree,
    isLoading,
    error,
    isEmpty
  };
};