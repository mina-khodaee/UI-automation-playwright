import moment from "moment-jalaali";

export const MRTColumnFiltersFromSearchParam = (filters = "", columns = []) => {
    if (!filters) return [];
    let filtersArray = [];
    if (filters.includes("AND")) filtersArray = filters.split('AND')?.map(item => item.trim());
    else filtersArray = [filters];

    return filtersArray.flatMap(item => {
        let [itemId, operator, value] = item.split('|');
        if (!itemId || !operator || !value) return [];

        const column = columns.find((col) => {
            let accessorKey = col.accessorKey?.toLowerCase();
            if (accessorKey && accessorKey.includes(".")) {
                const accessorKeyParts = accessorKey.split('.');
                accessorKey = accessorKeyParts[accessorKeyParts.length - 1]
            }

            return accessorKey === itemId;
        });

        if (!column) return [];

        let filterFn = 'equals';
        let filterVariant = '';
        if (column.enableColumnFilterModes) {
            switch (operator) {
                case 'eq':
                    filterFn = 'equals';
                    break;
                case 'contains':
                    filterFn = 'contains';
                    break;
                case 'between':
                    filterFn = 'between'
                    break;
                default:
                    break;
            }
        } else if (column.filterVariant && column.filterVariant !== 'datetime') {
            switch (column.filterVariant) {
                case 'select':
                    filterVariant = 'select';
                    break;
                case 'checkbox':
                    filterVariant = 'checkbox';
                    break;
                case 'text':
                    filterVariant = 'text';
                    break;
                default:
                    break;
            }
        } else if (column.filterVariant === "datetime") {
            filterVariant = 'datetime';
            switch (operator) {
                case 'between':
                    filterFn = 'between'; 
                    value = value.split('_').map((v) => moment(v.trim()));   
                    break;
                case 'lte':
                    filterFn = 'lessThan';
                    value = moment(value).utc(); 
                    break;
                case 'gte':
                    filterFn = 'greaterThan';
                    value = moment(value).utc(); 
                    break;
                default:
                    break;
            }
        }
        return [{
            id: column.accessorKey,
            value,
            filterFn,
            filterVariant,
        }];
    });
}