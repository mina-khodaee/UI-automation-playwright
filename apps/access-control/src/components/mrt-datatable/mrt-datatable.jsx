import jsPDF from 'jspdf';
import { toast } from 'sonner';
import autoTable from 'jspdf-autotable';
import { MdDelete } from 'react-icons/md';
import { IoMdDownload } from "react-icons/io";
import { TbFileTypeCsv } from "react-icons/tb";
import { GrDocumentPdf } from "react-icons/gr";
import { TbListDetails } from 'react-icons/tb';
import { BiSolidPencil } from 'react-icons/bi';
import { IconifyLocal } from '@repo/ui/iconify-local';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { MRTColumnFiltersFromSearchParam } from '@repo/ui/utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

import { useTheme } from '@mui/material/styles';
import { Box, Button, MenuItem, Popover } from '@mui/material';

import { useSearchParams } from 'src/routes/hooks';

import { fDateTime, formatUTCDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { RTLLanguages } from 'src/locales/locales-config';

import { registerVazirmatnFont } from './Vazirmatn-Regular-normal';

// ----------------------------------------------------------------------

export const MRTDataTable = ({ data = [], columns = [], rowCount = 0, isLoading = false, refetchMethod, initialFilters, enablePagination = true, enableRowVirtualization = false, enableRowActions = true, defaultPageSize = 10, rowsDensity = 'compact',
    onView, onEdit, onDelete, enableExportCSV = true, enableExportPDF = true, enableGlobalFilter = true, customRowActions = []
}) => {
    const initializedFromUrl = useRef(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const { t: t_common, currentLang } = useTranslate();
    const { t: t_report } = useTranslate('report');
    const { direction } = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();
    const [columnFilters, setColumnFilters] = useState(() => {
        const urlFilters = MRTColumnFiltersFromSearchParam(searchParams.get('filters'), columns);
        return urlFilters.length > 0
            ? urlFilters
            : initialFilters !== undefined
                ? initialFilters
                : [];
    });

    const [globalFilter, setGlobalFilter] = useState(searchParams.get('searchTerm') || '');
    const [sorting, setSorting] = useState(() =>
        searchParams.get('sortColumn')
            ? [{ id: searchParams.get('sortColumn'), desc: searchParams.get('sortOrder')?.toLowerCase() === 'desc' }]
            : []
    );

    const [pagination, setPagination] = useState({
        pageIndex: searchParams.get('page') ? +searchParams.get('page') - 1 : 0,
        pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize'), 10) : defaultPageSize
    });

    const buildQueryParams = () => {
        const filters = columnFilters
            .map((item) => {
                const column = columns.find((col) => col.accessorKey === item.id);
                if (!column) return null;

                let itemId = item.id?.toLowerCase().split('.').pop();
                let operator = '';

                if (column.enableColumnFilterModes) {
                    operator = {
                        equals: 'eq',
                        contains: 'contains',
                        between: 'between'
                    }[column._filterFn] || '';
                }
                else if (column.filterVariant && column.filterVariant !== 'datetime') {
                    operator = {
                        checkbox: 'eq',
                        select: 'eq',
                        text: 'eq'
                    }[column.filterVariant] || '';
                }
                else if (column.filterVariant === "datetime") {
                    if (item.filterFn) {
                        column["_filterFn"] = {
                            between: 'between',
                            lessThan: 'lessThan',
                            greaterThan: 'greaterThan',
                        }[item.filterFn] || '';
                    }
                    operator = {
                        between: 'between',
                        lessThan: 'lte',
                        greaterThan: 'gte'
                    }[column._filterFn] || '';
                    if (operator === 'between' && Array.isArray(item.value)) {
                        const [from, to] = item.value;
                        if (from && to && new Date(from) > new Date(to)) {
                            toast.error(t_report('filterValidations.invalidBetweenDate'));
                            return null;
                        }
                    }
                }
                if (itemId && operator && item.value) {
                    if (column.filterVariant === "datetime") {
                        if (Array.isArray(item.value) && item.value.length === 2 && item.value.every(v => v !== '')) {
                            return `${itemId}|${operator}|${item.value
                                .map((v) => formatUTCDate(v))
                                .join('_')}`;
                        }
                        else if (!Array.isArray(item.value) && item.value !== '') {
                            return `${itemId}|${operator}|${formatUTCDate(item.value)}`;
                        } else {
                            return null;
                        }
                    } else {
                        return `${itemId}|${operator}|${item.value}`;
                    }
                } else {
                    return null;
                }
            })
            .filter(Boolean)
            .join(' AND ');
        return {
            searchTerm: globalFilter,
            filters,
            page: pagination.pageIndex === 0 ? '' : pagination.pageIndex + 1,
            pageSize: pagination.pageSize === defaultPageSize ? '' : pagination.pageSize,
            sortColumn: sorting[0]?.id || '',
            sortOrder: sorting[0]?.desc ? 'desc' : ''
        };
    };

    const patchedColumns = useMemo(() =>
        columns.map((col) => {
            if (col.accessorKey === 'dateTime' && columnFilters) {
                const urlFilter = columnFilters.find((f) => f.id === col.accessorKey);
                if (urlFilter?.filterFn) {
                    return {
                        ...col,
                        filterFn: urlFilter.filterFn,
                        _filterFn: urlFilter.filterFn
                    };
                }
            }
            return col;
        }), [columns, columnFilters]);

    useEffect(() => {
        if (enableRowVirtualization) return;
        const queryParams = buildQueryParams();
        const cleanParams = Object.fromEntries(
            Object.entries(queryParams).filter(([, value]) => value)
        );

        setSearchParams(new URLSearchParams(cleanParams));
        refetchMethod(cleanParams);
    }, [pagination, globalFilter, sorting, columnFilters]);

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    const handleExportCSVRows = (rows) => {
        const visibleCols = table
            .getVisibleLeafColumns()
            .filter((col) => col.columnDef.exportable !== false && col.id !== 'mrt-row-select' && col.id !== 'mrt-row-actions');

        const rowData = rows.map((row) => {
            const obj = {};

            visibleCols.forEach((col) => {
                const value = row.getValue(col.id);
                let formattedValue = value;

                if (col.columnDef.type === 'dateTime') {
                    formattedValue = fDateTime(value, true);
                } else if (col.columnDef.type === 'boolean') {
                    formattedValue = value === 'true' ? t_common('labels.yes') : t_common('labels.no');
                }
                obj[col.columnDef.header] = formattedValue;
            });

            return obj;
        });
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    registerVazirmatnFont();
    const handleExportPDFRows = (rows) => {
        const exportableCols = table
            .getVisibleLeafColumns()
            .filter(col =>
                col.columnDef.exportable !== false &&
                col.id !== 'mrt-row-select' &&
                col.id !== 'mrt-row-actions'
            );

        // Reverse column order in RTL
        const orderedCols = RTLLanguages.includes(currentLang.value)
            ? [...exportableCols].reverse()
            : exportableCols;

        const flatRows = rows.map((row) =>
            orderedCols.map((col) => {
                const value = row.getValue(col.id);
                if (col.columnDef.type === 'dateTime') return fDateTime(value, true);
                if (col.columnDef.type === 'boolean')
                    return value === 'true' ? t_common('labels.yes') : t_common('labels.no');
                return typeof value === 'object'
                    ? value?.displayValues?.[currentLang.value] || value?.value || JSON.stringify(value)
                    : value ?? '';
            })
        );

        const tableHeaders = orderedCols.map(col => col.columnDef.header);

        const doc = new jsPDF({ orientation: 'landscape' });
        doc.setFont('Vazirmatn');

        autoTable(doc, {
            head: [tableHeaders],
            body: flatRows,
            styles: {
                font: 'Vazirmatn',
                fontStyle: 'normal',
                halign: RTLLanguages.includes(currentLang.value) ? 'right' : 'left',
            },
            headStyles: {
                font: 'Vazirmatn',
                fontStyle: 'normal',
                halign: RTLLanguages.includes(currentLang.value) ? 'right' : 'left',
            },
        });

        doc.save('exported-table.pdf');
    };

    const table = useMaterialReactTable({
        initialState: {
            showGlobalFilter: true,
            showColumnFilters: columnFilters ? columnFilters.length > 0 : false,
            density: rowsDensity
        },
        columns: patchedColumns,
        data,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: (updater) => {
            setPagination((prev) => {
                const newState = typeof updater === 'function' ? updater(prev) : updater;

                if (initializedFromUrl.current) {
                    initializedFromUrl.current = false;
                    newState.pageIndex = searchParams.get('page') ? +searchParams.get('page') - 1 : newState.pageIndex;
                }

                return newState.pageIndex !== prev.pageIndex || newState.pageSize !== prev.pageSize
                    ? newState
                    : prev;
            });
        },
        onSortingChange: (updater) =>
            setSorting((prev) => updater(prev.length > 0 ? [prev[prev.length - 1]] : prev)),
        state: {
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            sorting
        },
        rowCount,
        enablePagination,
        enableRowVirtualization,
        enableRowSelection: true,
        enableColumnOrdering: false,
        enableGlobalFilter,
        enableTopToolbar: true,
        enableStickyHeader: true,
        enableFullScreenToggle: false,
        manualFiltering: true,
        manualPagination: true,
        enableColumnFilterModes: true,
        manualSorting: true,
        localization: currentLang?.value === 'fa-IR' ? MRT_Localization_FA : MRT_Localization_EN,
        getRowId: (row) => row.id,
        muiTableBodyCellProps: {
            align: direction === 'rtl' ? 'left' : 'right'
        },
        muiTableHeadCellProps: {
            align: direction === 'rtl' ? 'left' : 'right'
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: { xs: 600, md: 600 }
            }
        },
        enableRowActions,
        positionActionsColumn: 'last',
        positionGlobalFilter: 'left',
        renderTopToolbarCustomActions: () => {
            const handleOpen = (event) => {
                setAnchorEl(event.currentTarget);
            };

            const handleClose = () => {
                setAnchorEl(null);
            };

            const open = Boolean(anchorEl);

            if (!enableExportCSV && !enableExportPDF) return null;

            return (
                <Box sx={{ ml: 'auto' }}>
                    <Button
                        variant="standard"
                        startIcon={<IoMdDownload />}
                        onClick={handleOpen}
                    >
                        {t_report('buttons.export')}
                    </Button>

                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                                minWidth: 220,
                                justifyContent: 'start',
                                alignItems: 'flex-start'
                            }}
                        >
                            {enableExportCSV && (
                                <>
                                    <Button
                                        disabled={table.getRowModel().rows.length === 0}
                                        onClick={() => {
                                            handleExportCSVRows(table.getRowModel().rows);
                                            handleClose();
                                        }}
                                        startIcon={<TbFileTypeCsv />}
                                    >
                                        {t_report('buttons.exportPageCsv')}
                                    </Button>
                                    <Button
                                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                                        onClick={() => {
                                            handleExportCSVRows(table.getSelectedRowModel().rows);
                                            handleClose();
                                        }}
                                        startIcon={<TbFileTypeCsv />}
                                    >
                                        {t_report('buttons.exportSelectedCsv')}
                                    </Button>
                                </>
                            )}

                            {enableExportPDF && (
                                <>
                                    <Button
                                        disabled={table.getRowModel().rows.length === 0}
                                        onClick={() => {
                                            handleExportPDFRows(table.getRowModel().rows);
                                            handleClose();
                                        }}
                                        startIcon={<GrDocumentPdf />}
                                    >
                                        {t_report('buttons.exportPagePdf')}
                                    </Button>
                                    <Button
                                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                                        onClick={() => {
                                            handleExportPDFRows(table.getSelectedRowModel().rows);
                                            handleClose();
                                        }}
                                        startIcon={<GrDocumentPdf />}
                                    >
                                        {t_report('buttons.exportSelectedPdf')}
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Popover>
                </Box>
            );
        },
        renderRowActionMenuItems: ({ row }) => {
            const items = [];

            if (onEdit) {
                items.push(
                    <MenuItem onClick={() => onEdit(row.original)} key={`${row.id}-edit`}>
                        <IconifyLocal><BiSolidPencil size={18} /></IconifyLocal>
                        {t_common('button.edit')}
                    </MenuItem>
                );
            }

            if (onView) {
                items.push(
                    <MenuItem onClick={() => onView(row.original)} key={`${row.id}-view`}>
                        <IconifyLocal><TbListDetails size={18} /></IconifyLocal>
                        {t_common('button.details')}
                    </MenuItem>
                );
            }

            if (onDelete) {
                items.push(
                    <MenuItem
                        onClick={() => onDelete(row.original)}
                        sx={{ color: 'error.main' }}
                        key={`${row.id}-delete`}
                    >
                        <IconifyLocal><MdDelete size={18} /></IconifyLocal>
                        {t_common('button.delete')}
                    </MenuItem>
                );
            }

            if (Array.isArray(customRowActions)) {
                customRowActions.forEach((actionFnOrNode, index) => {
                    const result = typeof actionFnOrNode === 'function'
                        ? actionFnOrNode(row.original)
                        : actionFnOrNode;

                    if (result) {
                        items.push(
                            React.cloneElement(result, {
                                key: `${row.id}-custom-${index}`,
                            })
                        );
                    }
                });
            }

            return items;
        }
    });
    return <MaterialReactTable table={table} />
};
