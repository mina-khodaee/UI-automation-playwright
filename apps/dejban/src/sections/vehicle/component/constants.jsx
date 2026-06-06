
export const OWNERSHIP_TYPES = [
  { label: 'شخصی', value: 1 },
  { label: 'سازمانی', value: 4 },
];

export const PLATE_TYPES = [
  { label: 'استاندارد', value: 1 },
  { label: 'موتور', value: 2 },
  { label: 'داخلی', value: 3 },
  { label: 'دیپلمات', value: 4 },
];

export const VEHICLE_TYPES = [
  { label: 'سدان', value: 1 },
  { label: 'SUV', value: 2 },
  { label: 'هاچبک', value: 3 },
  { label: 'وانت', value: 4 },
  { label: 'ون', value: 5 },
  { label: 'کامیون', value: 6 },
  { label: 'اتوبوس', value: 7 },
  { label: 'موتورسیکلت', value: 8 },
  { label: 'لیفتراک', value: 9 },
  { label: 'لیفتراک بالابر', value: 10 },
  { label: 'تراکتور یدک‌کش', value: 11 },
  { label: 'پالت جک', value: 12 },
  { label: 'لودر', value: 13 },
  { label: 'بیل مکانیکی', value: 14 },
  { label: 'جرثقیل', value: 15 },
  { label: 'سایر', value: 16 }
];

export const PLATE_LETTERS = [
  { label: 'الف', value: 'A' },
  { label: 'ب', value: 'B' },
  { label: 'پ', value: 'P' },
  { label: 'ت', value: 'T' },
  { label: 'ث', value: 'c' },
  { label: 'ج', value: 'J' },
  { label: 'د', value: 'D' },
  { label: 'ز', value: 'Z' },
  { label: 'س', value: 'S' },
  { label: 'ع', value: 'E' },
  { label: 'ف', value: 'F' },
  { label: 'ق', value: 'G' },
  { label: 'ل', value: 'L' },
  { label: 'م', value: 'M' },
  { label: 'ن', value: 'N' },
  { label: 'و', value: 'V' },
  { label: 'ه', value: 'H' },
  { label: 'ی', value: 'Y' },
  { label: 'ک', value: 'K' },
  { label: 'ر', value: 'R' },
  { label: 'ص', value: 'I' },
  { label: 'ش', value: 'O' },
  { label: 'ط', value: 'Q' },
  { label: 'چ', value: 'U' },
  { label: 'گ', value: 'W' },
];

export const CARGO_TYPES = [
  { label: 'بار عمومی', value: 1 },
  { label: 'بار مایع', value: 2 },
  { label: 'بار یخچالی', value: 3 },
  { label: 'مواد خطرناک', value: 4 },
  { label: 'بار فوق‌العاده', value: 5 }
];
export const FUEL_TYPES = [
  { label: 'بنزین', value: 1 },
  { label: 'گازوئیل', value: 2 },
  { label: 'برقی', value: 3 },
  { label: 'هیبرید', value: 4 },
  { label: 'CNG', value: 5 },
  { label: 'LPG', value: 6 },
  { label: 'بدون سوخت', value: 7 }
];

export const STEPPER_LIST = [
  { title: 'سواری', value: 0 },
  { title: 'باری', value: 1 },
  { title: 'صنعتی', value: 2 },
  { title: 'موتور', value: 3 },
  { title: 'متفرقه', value: 4 },
];

// Persian Vehicle Type Map
export const VEHICLE_TYPE_NAMES = {
  'Sedan': 'سدان',
  'SUV': 'شاسی بلند',
  'Hatchback': 'هاچ بک',
  'Pickup': 'وانت',
  'Van': 'ون',
  'Truck': 'کامیون',
  'Bus': 'اتوبوس',
  'Motorcycle': 'موتورسیکلت',
  'Forklift': 'لیفتراک',
  'Liftrack': 'لیفتراک بالابر',
  'TowTractor': 'تراکتور یدک‌کش',
  'PalletJack': 'پالت جک',
  'Loader': 'لودر',
  'Excavator': 'بیل مکانیکی',
  'Crane': 'جرثقیل',
  'Other': 'سایر'
};

// Persian Status Map
export const STATUS_NAMES = {
  'Active': 'فعال',
  'Inactive': 'غیرفعال',
  'Maintenance': 'در تعمیرات',
  'OutOfService': 'خارج از سرویس'
};