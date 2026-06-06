// src/services/armory-inventory/armory-inventory.mock.js

const STORAGE_KEY = 'armory_inventory';
// src/services/armory-inventory/armory-inventory.mock.js

// IDهای واقعی از بک‌اند (از console.log sitesData گرفتی)
const SITE_UUIDS = {
    MAIN: 'a6daa242-9669-4077-8338-a6ef9ac0af17',   // پارک فناوری فاوا
    SUB: '45c4f4b8-d345-4044-bc16-c9ec4b7084b9',    // پیام گستر فاوا
};

const initialData = [
    {
        id: '1',
        equipmentId: '1',
        serialNumber: 'SN-001-2024-001',
        status: 'نو',
        manufactureYear: 2024,
        image: null,
        siteId: SITE_UUIDS.MAIN,  // ✅ استفاده از UUID واقعی
        locationId: '1',
        isActive: true,
        notes: 'سلاح تحویل جدید',
        createdAt: '2024-01-15T08:30:00.000Z',
        updatedAt: '2024-01-15T08:30:00.000Z',
    },
    {
        id: '2',
        equipmentId: '1',
        serialNumber: 'SN-001-2024-002',
        status: 'کارکرده',
        manufactureYear: 2023,
        image: null,
        siteId: SITE_UUIDS.MAIN,  // ✅
        locationId: '1',
        isActive: true,
        notes: '',
        createdAt: '2024-01-20T10:15:00.000Z',
        updatedAt: '2024-01-20T10:15:00.000Z',
    },
    {
        id: '3',
        equipmentId: '2',
        serialNumber: 'SN-002-2024-001',
        status: 'نو',
        manufactureYear: 2024,
        image: null,
        siteId: SITE_UUIDS.SUB,  // ✅
        locationId: '2',
        isActive: true,
        notes: 'تجهیزات ویژه',
        createdAt: '2024-02-01T09:00:00.000Z',
        updatedAt: '2024-02-01T09:00:00.000Z',
    },
    {
        id: '4',
        equipmentId: '3',
        serialNumber: 'SN-003-2024-001',
        status: 'تعمیری',
        manufactureYear: 2018,
        image: null,
        siteId: SITE_UUIDS.MAIN,  // ✅
        locationId: '1',
        isActive: false,
        notes: 'نیاز به تعمیر اساسی',
        createdAt: '2024-02-10T14:20:00.000Z',
        updatedAt: '2024-02-10T14:20:00.000Z',
    },
    {
        id: '5',
        equipmentId: '4',
        serialNumber: 'SN-004-2024-001',
        status: 'نو',
        manufactureYear: 2024,
        image: null,
        siteId: SITE_UUIDS.SUB,  // ✅
        locationId: '3',
        isActive: true,
        notes: '',
        createdAt: '2024-03-01T11:45:00.000Z',
        updatedAt: '2024-03-01T11:45:00.000Z',
    },
    {
        id: '6',
        equipmentId: '6', 
        serialNumber: null,
        quantity: 500,
        status: 'نو',
        manufactureYear: 2024,
        siteId: 'a6daa242-9669-4077-8338-a6ef9ac0af17',
        locationId: '1',
        isActive: true,
        notes: 'مهمات ۹ میلی‌متر',
        createdAt: '2024-03-01T09:00:00.000Z',
        updatedAt: '2024-03-01T09:00:00.000Z',
    },
    {
        id: '7',
        equipmentId: '6', 
        serialNumber: null,
        quantity: 300,
        status: 'نو',
        manufactureYear: 2024,
        siteId: '45c4f4b8-d345-4044-bc16-c9ec4b7084b9',
        locationId: '2',
        isActive: true,
        notes: 'مهمات ۹ میلی‌متر - انبار شمال',
        createdAt: '2024-03-05T10:00:00.000Z',
        updatedAt: '2024-03-05T10:00:00.000Z',
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

export const getInventoryList = async ({
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
                item.serialNumber?.toLowerCase().includes(term) ||
                item.status?.toLowerCase().includes(term) ||
                item.notes?.toLowerCase().includes(term)
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

export const getInventoryById = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const data = getData();
    // eslint-disable-next-line no-shadow
    const item = data.find((item) => item.id === id);
    if (!item) throw new Error('Inventory item not found');
    return item;
};

export const createInventory = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const inventory = getData();
    const newItem = {
        id: generateId(),
        ...data,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    inventory.push(newItem);
    setData(inventory);
    return newItem;
};

export const updateInventory = async ({ id, ...payload }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const inventory = getData();
    const index = inventory.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Inventory item not found');
    const updatedItem = {
        ...inventory[index],
        ...payload,
        updatedAt: new Date().toISOString(),
    };
    inventory[index] = updatedItem;
    setData(inventory);
    return updatedItem;
};

export const deleteInventory = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const inventory = getData();
    const filtered = inventory.filter((item) => item.id !== id);
    if (filtered.length === inventory.length) throw new Error('Inventory item not found');
    setData(filtered);
    return true;
};

// غیرفعال کردن تجهیز (Disable)
export const disableInventory = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const inventory = getData();
    const index = inventory.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Inventory item not found');
    inventory[index].isActive = false;
    inventory[index].updatedAt = new Date().toISOString();
    setData(inventory);
    return inventory[index];
};

// فعال کردن تجهیز (Enable)
export const enableInventory = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const inventory = getData();
    const index = inventory.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Inventory item not found');
    inventory[index].isActive = true;
    inventory[index].updatedAt = new Date().toISOString();
    setData(inventory);
    return inventory[index];
};

// تغییر وضعیت
export const changeStatus = async (id, newStatus) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const inventory = getData();
    const index = inventory.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Inventory item not found');
    inventory[index].status = newStatus;
    inventory[index].updatedAt = new Date().toISOString();
    setData(inventory);
    return inventory[index];
};