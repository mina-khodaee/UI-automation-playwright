// src/services/armory-categories/armory-categories.service.js

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as categoriesApi from './armory-categories.http';
import { armoryCategoriesKeys } from './armory-categories.keys';

export const useGetCategories = (params = {}, enabled = true) =>
    useQuery({
        queryKey: armoryCategoriesKeys.list(params),
        queryFn: () => categoriesApi.getCategoriesList(params),
        keepPreviousData: true,
        enabled,
    });

export const useGetCategoryById = (id) =>
    useQuery({
        queryKey: armoryCategoriesKeys.detail(id),
        queryFn: () => categoriesApi.getCategoryById(id),
        enabled: !!id,
    });

export const useCreateCategory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: categoriesApi.createCategory,
        onSuccess: () => qc.invalidateQueries({ queryKey: armoryCategoriesKeys.lists() }),
    });
};

export const useUpdateCategory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: categoriesApi.updateCategory,
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: armoryCategoriesKeys.lists() });
            qc.invalidateQueries({ queryKey: armoryCategoriesKeys.detail(variables.id) });
        },
    });
};

export const useDeleteCategory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: categoriesApi.deleteCategory,
        onSuccess: () => qc.invalidateQueries({ queryKey: armoryCategoriesKeys.lists() }),
    });
};