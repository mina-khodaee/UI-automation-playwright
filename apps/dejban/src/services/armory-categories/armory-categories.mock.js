// src/services/armory-categories/armory-categories.mock.js

const STORAGE_KEY = 'armory_categories';

const initialData = [
    {
        id: '1',
        name: 'سلاح گرم',
        code: 'CAT-001',
        hasSerialNumber: true,
        description: 'انواع اسلحه‌های گرم شامل کلت، ژن، ام‌پی‌فایو و ...',
        status: true,
        createdAt: '2024-01-15T08:30:00.000Z',
        updatedAt: '2024-01-15T08:30:00.000Z',
    },
    {
        id: '2',
        name: 'سلاح سرد',
        code: 'CAT-002',
        hasSerialNumber: false,
        description: 'انواع خنجر، شمشیر، قمه و ...',
        status: true,
        createdAt: '2024-01-20T10:15:00.000Z',
        updatedAt: '2024-01-20T10:15:00.000Z',
    },
    {
        id: '3',
        name: 'مهمات',
        code: 'CAT-003',
        hasSerialNumber: false,
        description: 'انواع فشنگ، خرج، ترقه و ...',
        status: true,
        createdAt: '2024-02-01T09:00:00.000Z',
        updatedAt: '2024-02-01T09:00:00.000Z',
    },
    {
        id: '4',
        name: 'تجهیزات جانبی',
        code: 'CAT-004',
        hasSerialNumber: true,
        description: 'دوربین، خشاب، سه‌پایه، کاور و ...',
        status: true,
        createdAt: '2024-02-10T14:20:00.000Z',
        updatedAt: '2024-02-10T14:20:00.000Z',
    },
    {
        id: '5',
        name: 'مواد منفجره',
        code: 'CAT-005',
        hasSerialNumber: false,
        description: 'انواع نارنجک، تی‌ان‌تی، سیم خاردار و ...',
        status: false,
        createdAt: '2024-03-01T11:45:00.000Z',
        updatedAt: '2024-03-01T11:45:00.000Z',
    },
];

const initData = () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
};

const getData = () => {
    initData();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

const setData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 6);

export const getCategoriesList = async ({
    page = 1,
    pageSize = 10,
    searchTerm = '',
    sortColumn = '',
    sortOrder = '',
} = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let data = [...getData()];

    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        data = data.filter(
            (item) =>
                item.name?.toLowerCase().includes(term) ||
                item.code?.toLowerCase().includes(term) ||
                item.description?.toLowerCase().includes(term)
        );
    }

    if (sortColumn && sortOrder) {
        data.sort((a, b) => {
            let aVal = a[sortColumn];
            let bVal = b[sortColumn];
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const totalCount = data.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = data.slice(startIndex, endIndex);

    return { items, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
};

export const getCategoryById = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const data = getData();
    // eslint-disable-next-line no-shadow
    const item = data.find((item) => item.id === id);
    if (!item) throw new Error('Category not found');
    return item;
};

export const createCategory = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const categories = getData();
    const newCategory = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    categories.push(newCategory);
    setData(categories);
    return newCategory;
};

export const updateCategory = async ({ id, ...payload }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const categories = getData();
    const index = categories.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Category not found');
    const updatedCategory = {
        ...categories[index],
        ...payload,
        updatedAt: new Date().toISOString(),
    };
    categories[index] = updatedCategory;
    setData(categories);
    return updatedCategory;
};

export const deleteCategory = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const categories = getData();
    const filtered = categories.filter((item) => item.id !== id);
    if (filtered.length === categories.length) throw new Error('Category not found');
    setData(filtered);
    return true;
};