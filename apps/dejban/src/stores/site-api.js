import { create } from "zustand";

import { createItem, deleteItem, endpoints, fetcher, updateItem } from 'src/lib/api';

// ----------------------------------------------------------------------

export const useSiteAPI = create((set) => ({
  allSite: [],
  allSiteByPagination: [],
  params: {},
  scopes: [],
  totalCount: 0,
  loading: {
    fetch: false,
    myFetch: false,
    delete: false,
    create: false,
    update: false,
    scopes: false
  },
  error: null,


  getSitesByPagination: async (pageSize, page, searchTerm, sortColumn, sortOrder) => {
    try {
      set((state) => ({
        loading: { ...state.loading, fetch: true },
        error: null
      }));

      const response = await fetcher([endpoints.site.list, { params: { pageSize, page, searchTerm, sortColumn, sortOrder } }]);

      set(() => ({
        allSiteByPagination: response.items,
        totalCount: response.totalCount,
      }));

    } catch (error) {

      set(() => ({
        error: true,
      }));

      throw error;

    } finally {

      set((state) => ({
        loading: { ...state.loading, fetch: false }
      }));

    }
  },

  // getSites: async () => {
  //   try {
  //     set((state) => ({
  //       loading: { ...state.loading, fetch: true },
  //       error: null
  //     }));

  //     const response = await fetcher([endpoints.site.listt]);

  //     set(() => ({
  //       allSite: response.items || response,
  //       totalCount: response.totalCount || response.length,
  //     }));

  //     return response;

  //   } catch (error) {
  //     set(() => ({
  //       error: error.message,
  //     }));
  //     throw error;

  //   } finally {
  //     set((state) => ({
  //       loading: { ...state.loading, fetch: false }
  //     }));
  //   }
  // },

  getSites: async ({ sortColumn, sortOrder } = {}) => {
    try {
      set((state) => ({
        loading: { ...state.loading, fetch: true },
        error: null,
      }));

      const response = await fetcher([
        endpoints.site.listt,
        {
          params: {
            pageSize: 100,
            page: 1,
            searchTerm: '',
            sortColumn: mapSortColumn(sortColumn),
            sortOrder: sortOrder ?? 'Asc',
          },
        },
      ]);

      set(() => ({
        allSite: response.items ?? [],
        totalCount: response.totalCount ?? 0,
      }));

      return response;

    } catch (error) {
      set(() => ({
        error: error.message,
      }));
      throw error;

    } finally {
      set((state) => ({
        loading: { ...state.loading, fetch: false },
      }));
    }
  },



  createSite: async (data) => {
    try {
      set((state) => ({
        loading: { ...state.loading, create: true }
      }));
      const key = await createItem(endpoints.site.create, data);
      set(() => ({
        createdKey: key
      }));
      return key;
    } catch (error) {
      set(() => ({
        error: true
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, create: false }
      }));
    }
  },

  updateSite: async (data) => {
    try {
      set((state) => ({
        loading: { ...state.loading, update: true }
      }));
      await updateItem(endpoints.site.update, data);
    } catch (error) {
      set(() => ({
        error: true
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, update: false }
      }));
    }
  },


  deleteSite: async (ids) => {
    try {
      set((state) => ({
        loading: { ...state.loading, delete: true },
        error: null
      }));
      await deleteItem(endpoints.site.delete, { ids: [ids] });
    } catch (error) {
      set(() => ({
        error: true
      }));
      throw error;
    } finally {
      set((state) => ({
        loading: { ...state.loading, delete: false }
      }));
    }
  },


}));

const mapSortColumn = (column) => {
  if (!column) return 'Name';

  switch (column) {
    case 'id':
    case 'Id':
      return 'Id';

    case 'name':
    case 'Name':
      return 'Name';

    case 'title':
    case 'Title':
      return 'Title';

    default:
      return 'Name'; // fallback
  }
};

