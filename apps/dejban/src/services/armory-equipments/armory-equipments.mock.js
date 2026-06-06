// src/services/armory-equipments/armory-equipments.mock.js

const STORAGE_KEY = 'armory_equipments';

const initialData = [
    {
        id: '1',
        categoryId: '1',  // سلاح گرم
        name: 'کلت کمری مدل ۲۰۱۵',
        description: 'سلاح کمری نیمه اتوماتیک ۹ میلی‌متر',
        createdAt: '2024-01-15T08:30:00.000Z',
        updatedAt: '2024-01-15T08:30:00.000Z',
    },
    {
        id: '2',
        categoryId: '1',  // سلاح گرم
        name: 'تفنگ ژن مدل ۲۰۲۰',
        description: 'تفنگ تهاجمی ۵.۵۶ میلی‌متر',
        createdAt: '2024-01-20T10:15:00.000Z',
        updatedAt: '2024-01-20T10:15:00.000Z',
    },
    {
        id: '3',
        categoryId: '1',  // سلاح گرم
        name: 'ام‌پی‌فایو مدل ۲۰۱۸',
        description: 'مسلسل دستی ۹ میلی‌متر',
        createdAt: '2024-02-01T09:00:00.000Z',
        updatedAt: '2024-02-01T09:00:00.000Z',
    },
    {
        id: '4',
        categoryId: '2',  // سلاح سرد
        name: 'خنجر تاکتیکی',
        description: 'خنجر نظامی با غلاف',
        createdAt: '2024-02-10T14:20:00.000Z',
        updatedAt: '2024-02-10T14:20:00.000Z',
    },
    {
        id: '5',
        categoryId: '2',  // سلاح سرد
        name: 'شمشیر تشریفاتی',
        description: 'شمشیر مراسمات نظامی',
        createdAt: '2024-02-15T11:00:00.000Z',
        updatedAt: '2024-02-15T11:00:00.000Z',
    },
    {
        id: '6',
        categoryId: '3',  // مهمات
        name: 'فشنگ ۹ میلی‌متر',
        description: 'بسته ۵۰ عددی',
        createdAt: '2024-03-01T09:30:00.000Z',
        updatedAt: '2024-03-01T09:30:00.000Z',
    },
    {
        id: '7',
        categoryId: '3',  // مهمات
        name: 'فشنگ ۵.۵۶ میلی‌متر',
        description: 'بسته ۳۰ عددی',
        createdAt: '2024-03-05T14:00:00.000Z',
        updatedAt: '2024-03-05T14:00:00.000Z',
    },
    {
        id: '8',
        categoryId: '4',  // تجهیزات جانبی
        name: 'دوربین دید در شب',
        description: 'مدل پیشرفته با برد ۲۰۰ متر',
        createdAt: '2024-03-10T08:45:00.000Z',
        updatedAt: '2024-03-10T08:45:00.000Z',
    },
    {
        id: '9',
        categoryId: '4',  // تجهیزات جانبی
        name: 'سه‌پایه تفنگ',
        description: 'قابل تنظیم ارتفاع',
        createdAt: '2024-03-12T10:15:00.000Z',
        updatedAt: '2024-03-12T10:15:00.000Z',
    },
    {
        id: '10',
        categoryId: '5',  // مواد منفجره
        name: 'نارنجک دستی',
        description: 'نارنجک انفجاری',
        createdAt: '2024-03-15T11:30:00.000Z',
        updatedAt: '2024-03-15T11:30:00.000Z',
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

export const getEquipmentsList = async ({
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

export const getEquipmentById = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const data = getData();
    // eslint-disable-next-line no-shadow
    const item = data.find((item) => item.id === id);
    if (!item) throw new Error('Equipment not found');
    return item;
};

export const createEquipment = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const equipments = getData();
    const newEquipment = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    equipments.push(newEquipment);
    setData(equipments);
    return newEquipment;
};

export const updateEquipment = async ({ id, ...payload }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const equipments = getData();
    const index = equipments.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Equipment not found');
    const updatedEquipment = {
        ...equipments[index],
        ...payload,
        updatedAt: new Date().toISOString(),
    };
    equipments[index] = updatedEquipment;
    setData(equipments);
    return updatedEquipment;
};

export const deleteEquipment = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const equipments = getData();
    const filtered = equipments.filter((item) => item.id !== id);
    if (filtered.length === equipments.length) throw new Error('Equipment not found');
    setData(filtered);
    return true;
};