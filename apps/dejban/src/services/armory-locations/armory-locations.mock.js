// src/services/armory-locations/armory-locations.mock.js

const STORAGE_KEY = 'armory_locations';

// دیتای اولیه (seed data) با اضافه کردن siteId
const initialData = [
    {
        id: '1',
        name: 'زاغه مرکزی',
        code: 'ARM-001',
        siteName: 'کرج',
        location: 'طبقه منفی یک، ساختمان اصلی',
        capacity: 500,
        responsiblePerson: 'سرهنگ علی محمدی',
        contactNumber: '021-12345678',
        type: 'both',
        status: true,
        // siteId: 'a6daa242-9669-4077-8338-a6ef9ac0af17',
        description: 'انبار اصلی سلاح‌ها و مهمات',
        createdAt: '2024-01-15T08:30:00.000Z',
        updatedAt: '2024-01-15T08:30:00.000Z',
    },
    {
        id: '2',
        name: 'انبار شمال',
        code: 'ARM-002',
        siteName: 'مهرشهر',
        location: 'پادگان شمال، ساختمان شماره ۳',
        capacity: 300,
        responsiblePerson: 'سرگرد رضا کریمی',
        contactNumber: '021-87654321',
        type: 'weapon',
        status: true,
        // siteId: 'a6daa242-9669-4077-8338-a6ef9ac0af17',
        description: 'انبار تخصصی سلاح‌های گرم',
        createdAt: '2024-01-20T10:15:00.000Z',
        updatedAt: '2024-01-20T10:15:00.000Z',
    },
    {
        id: '3',
        name: 'انبار جنوب',
        code: 'ARM-003',
        siteName: 'پارچین',
        location: 'پادگان جنوب، انبار شماره ۲',
        capacity: 200,
        responsiblePerson: 'سروان احمد حسینی',
        contactNumber: '021-11223344',
        type: 'ammo',
        status: true,
        // siteId: 'a6daa242-9669-4077-8338-a6ef9ac0af17',
        description: 'انبار تخصصی مهمات',
        createdAt: '2024-02-01T09:00:00.000Z',
        updatedAt: '2024-02-01T09:00:00.000Z',
    },
    {
        id: '4',
        name: 'زاغه شرق',
        code: 'ARM-004',
        siteName: 'ورامین',
        location: 'منطقه شرق، خیابان شهید رجایی',
        capacity: 150,
        responsiblePerson: 'ستوان محمدرضا نوری',
        contactNumber: '021-44332211',
        type: 'both',
        status: false,
        // siteId: 'a6daa242-9669-4077-8338-a6ef9ac0af17',
        description: 'در دست تعمیرات',
        createdAt: '2024-02-10T14:20:00.000Z',
        updatedAt: '2024-02-10T14:20:00.000Z',
    },
    {
        id: '5',
        name: 'انبار غرب',
        code: 'ARM-005',
        siteName: 'اندیشه',
        location: 'منطقه غرب، بلوار آزادگان',
        capacity: 100,
        responsiblePerson: 'سرهنگ دوم مجید رضایی',
        contactNumber: '021-99887766',
        type: 'weapon',
        status: true,
        // siteId: 'a6daa242-9669-4077-8338-a6ef9ac0af17',
        description: 'انبار سلاح‌های ویژه',
        createdAt: '2024-03-01T11:45:00.000Z',
        updatedAt: '2024-03-01T11:45:00.000Z',
    },
];

// راه‌اندازی دیتا در localStorage (اگر وجود نداشته باشه)
const initData = () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    }
};

// گرفتن همه دیتا از localStorage
const getData = () => {
    initData();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

// ذخیره دیتا در localStorage
const setData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// تولید ID جدید
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 6);

// ----------------------------------------------------------------------
// توابع Mock CRUD

// GET List با صفحه‌بندی، جستجو و مرتب‌سازی
export const getArmoryLocationsList = async ({
    page = 1,
    pageSize = 10,
    searchTerm = '',
    sortColumn = '',
    sortOrder = '',
} = {}) => {
    // شبیه‌سازی تاخیر شبکه
    await new Promise((resolve) => setTimeout(resolve, 500));

    let data = [...getData()];

    // فیلتر بر اساس searchTerm
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        data = data.filter(
            (item) =>
                item.name.toLowerCase().includes(term) ||
                item.code.toLowerCase().includes(term) ||
                item.responsiblePerson?.toLowerCase().includes(term) ||
                item.location?.toLowerCase().includes(term)
        );
    }

    // مرتب‌سازی
    if (sortColumn && sortOrder) {
        data.sort((a, b) => {
            let aVal = a[sortColumn];
            let bVal = b[sortColumn];

            // مرتب‌سازی برای رشته‌ها
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

    // صفحه‌بندی
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = data.slice(startIndex, endIndex);

    return {
        items,
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
    };
};

// GET By ID
export const getArmoryLocationById = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const data = getData();
    // eslint-disable-next-line no-shadow
    const item = data.find((item) => item.id === id);

    if (!item) {
        throw new Error('Armory location not found');
    }

    return item;
};

// CREATE
export const createArmoryLocation = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const locations = getData();
    const newLocation = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    locations.push(newLocation);
    setData(locations);

    return newLocation;
};

// UPDATE
export const updateArmoryLocation = async ({ id, ...payload }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const locations = getData();
    const index = locations.findIndex((item) => item.id === id);

    if (index === -1) {
        throw new Error('Armory location not found');
    }

    const updatedLocation = {
        ...locations[index],
        ...payload,
        updatedAt: new Date().toISOString(),
    };

    locations[index] = updatedLocation;
    setData(locations);

    return updatedLocation;
};

// DELETE
export const deleteArmoryLocation = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const locations = getData();
    const filtered = locations.filter((item) => item.id !== id);

    if (filtered.length === locations.length) {
        throw new Error('Armory location not found');
    }

    setData(filtered);
    return true;
};