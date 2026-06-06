import jsPDF from 'jspdf';
import { toast } from 'sonner';
import autoTable from 'jspdf-autotable';
import { MdDelete } from 'react-icons/md';
import { IoMdDownload } from 'react-icons/io';
import { TbFileTypeCsv } from 'react-icons/tb';
import { GrDocumentPdf } from 'react-icons/gr';
import { TbListDetails } from 'react-icons/tb';
import { BiSolidPencil } from 'react-icons/bi';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MRT_Localization_FA } from 'material-react-table/locales/fa';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Popover,
  Typography,
} from '@mui/material';
import { useSearchParams } from 'src/routes/hooks';
import { fDateTime, formatUTCDate } from '../../utils/format-time';
import { useTranslate } from 'src/locales';
import { RTLLanguages } from 'src/locales/locales-config';
import { registerVazirmatnFont } from './Vazirmatn-Regular-normal';
import { useBaseGridStyles } from './use-base-grid-styles';
import { IconifyLocal } from '../iconify/iconify-local';
import { MRTColumnFiltersFromSearchParam } from '../../utils/mrt-utils';

// ----------------------------------------------------------------------

export const MRTDataTable = ({
  data = [],
  columns = [],
  rowCount = 0,
  isLoading = false,
  setQueryParams,
  initialFilters,
  enablePagination = true,
  enableRowVirtualization = false,
  enableRowActions = true,
  defaultPageSize = 10,
  rowsDensity = 'compact',
  onView,
  onEdit,
  onDelete,
  enableExportCSV = true,
  enableExportPDF = true,
  enableGlobalFilter = true,
  customRowActions = [],
  extraToolbarActions,
  renderTopToolbarCustomActions,
  enableExpanding,
  renderDetailPanel,
  enableRowSelection = true,
}) => {
  const initializedFromUrl = useRef(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState({});
  const { t: t_common, currentLang } = useTranslate();
  const { t: t_report } = useTranslate('report');
  const { direction } = useTheme();
  const searchParams = useSearchParams();
  const styles = useBaseGridStyles();

  const [columnFilters, setColumnFilters] = useState(() => {
    const urlFilters = MRTColumnFiltersFromSearchParam(searchParams.get('filters'), columns);
    return urlFilters.length > 0 ? urlFilters : initialFilters !== undefined ? initialFilters : [];
  });

  const [globalFilter, setGlobalFilter] = useState(searchParams.get('searchTerm') || '');
  const [sorting, setSorting] = useState(() =>
    searchParams.get('sortColumn')
      ? [
        {
          id: searchParams.get('sortColumn'),
          desc: searchParams.get('sortOrder')?.toLowerCase() === 'desc',
        },
      ]
      : []
  );

  const [pagination, setPagination] = useState({
    pageIndex: searchParams.get('page') ? +searchParams.get('page') - 1 : 0,
    pageSize: searchParams.get('pageSize')
      ? parseInt(searchParams.get('pageSize'), 10)
      : defaultPageSize,
  });

  const buildQueryParams = () => {
    const filters = columnFilters
      .map((item) => {
        const column = columns.find((col) => col.accessorKey === item.id);
        if (!column) return null;

        let itemId = item.id?.toLowerCase().split('.').pop();
        let operator = '';

        if (column.enableColumnFilterModes) {
          operator =
            {
              equals: 'eq',
              contains: 'contains',
              between: 'between',
            }[column._filterFn] || '';
        } else if (column.filterVariant && column.filterVariant !== 'datetime') {
          operator =
            {
              checkbox: 'eq',
              select: 'eq',
              text: 'eq',
            }[column.filterVariant] || '';
        } else if (column.filterVariant === 'datetime') {
          if (item.filterFn) {
            column['_filterFn'] =
              {
                between: 'between',
                lessThan: 'lessThan',
                greaterThan: 'greaterThan',
              }[item.filterFn] || '';
          }
          operator =
            {
              between: 'between',
              lessThan: 'lte',
              greaterThan: 'gte',
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
          if (column.filterVariant === 'datetime') {
            if (
              Array.isArray(item.value) &&
              item.value.length === 2 &&
              item.value.every((v) => v !== '')
            ) {
              return `${itemId}|${operator}|${item.value.map((v) => formatUTCDate(v)).join('_')}`;
            } else if (!Array.isArray(item.value) && item.value !== '') {
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
      sortOrder: sorting[0]?.desc ? 'desc' : '',
    };
  };

  const patchedColumns = useMemo(
    () =>
      columns.map((col) => {
        if (col.accessorKey === 'dateTime' && columnFilters) {
          const urlFilter = columnFilters.find((f) => f.id === col.accessorKey);
          if (urlFilter?.filterFn) {
            return {
              ...col,
              filterFn: urlFilter.filterFn,
              _filterFn: urlFilter.filterFn,
            };
          }
        }
        return col;
      }),
    [columns, columnFilters]
  );

  useEffect(() => {
    if (enableRowVirtualization) return;
    const queryParams = buildQueryParams();

    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([, value]) => value)
    );

    searchParams.set(cleanParams);

    setQueryParams?.(cleanParams);
  }, [pagination, globalFilter, sorting, columnFilters]);

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  // سپس تابع handleDelete اضافه کن
  const handleDelete = (row) => {
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  };

  // تابع handleConfirmDelete اضافه کن
  const handleConfirmDelete = () => {
    if (rowToDelete && onDelete) {
      onDelete(rowToDelete);
    }
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  const handleExportCSVRows = (rows) => {
    const visibleCols = table
      .getVisibleLeafColumns()
      .filter(
        (col) =>
          col.columnDef.exportable !== false &&
          col.id !== 'mrt-row-select' &&
          col.id !== 'mrt-row-actions'
      );

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
      .filter(
        (col) =>
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
          : (value ?? '');
      })
    );

    const tableHeaders = orderedCols.map((col) => col.columnDef.header);

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
      enableRowSelection: true,

      showColumnFilters: columnFilters ? columnFilters.length > 0 : false,
      density: rowsDensity,
    },
    enableExpandAll: true,
    onExpandedChange: setExpanded,

    // displayColumnDefOptions: {
    //   'mrt-row-actions': {
    //     size: 120,
    //     minSize: 100,
    //     maxSize: 150,
    //     muiTableHeadCellProps: {
    //       sx: {
    //         position: 'sticky',
    //         right: 0,
    //         backgroundColor: 'background.paper',
    //         zIndex: 2,
    //         '&::after': {
    //           content: '""',
    //           position: 'absolute',
    //           right: -1,
    //           top: 0,
    //           bottom: 0,
    //           width: '1px',
    //           backgroundColor: 'divider',
    //         },
    //       },
    //     },
    //     muiTableBodyCellProps: {
    //       sx: {
    //         position: 'sticky',
    //         right: 0,
    //         backgroundColor: 'background.paper',
    //         zIndex: 1,
    //         '&::after': {
    //           content: '""',
    //           position: 'absolute',
    //           right: -1,
    //           top: 0,
    //           bottom: 0,
    //           width: '1px',
    //           backgroundColor: 'divider',
    //         },
    //       },
    //     },
    //   },
    // },
   displayColumnDefOptions: {
  'mrt-row-actions': {
    size: 80,
    minSize: 60,
    maxSize: 100,
    muiTableHeadCellProps: {
      sx: {
        ...styles.stickyActionColumn.muiTableHeadCellProps.sx,
        zIndex: 2,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        ...styles.stickyActionColumn.muiTableBodyCellProps.sx,
        zIndex: 1,
      },
    },
  },
},


    positionExpandColumn: 'first',
    columns: patchedColumns,
    data,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      setPagination((prev) => {
        const newState = typeof updater === 'function' ? updater(prev) : updater;

        if (initializedFromUrl.current) {
          initializedFromUrl.current = false;
          newState.pageIndex = searchParams.get('page')
            ? +searchParams.get('page') - 1
            : newState.pageIndex;
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
      sorting,
      expanded,
    },
    rowCount,
    enablePagination,
    enableRowVirtualization,
    enableRowSelection: false,
    enableExpanding: !!renderDetailPanel,
    renderDetailPanel,
    // positionSelectColumn: 'first', // ستون انتخاب ردیف اول
    // positionExpandColumn: 'afterSelect', // ستون expand بعد از ستون انتخاب
    layoutMode: 'grid',
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
    // muiTableBodyCellProps: {
    //   align: direction === 'rtl' ? 'left' : 'right',
    // },
    // muiTableHeadCellProps: {
    //   align: direction === 'rtl' ? 'left' : 'right',
    // },

    muiTableHeadCellProps: {
  ...styles.headCellProps,
  align: 'center',
},
muiTableBodyCellProps: {
  ...styles.bodyCellProps,
  align: 'center',
},
    // muiTableContainerProps: {
    //   sx: {
    //     maxHeight: { xs: 600, md: 600 },
    //     overflowX: 'auto',
    //     position: 'relative',
    //   },
    // },
    muiTableContainerProps: {
  ...styles.tableContainerProps,
  sx: {
    ...styles.tableContainerProps.sx,
    maxHeight: { xs: 600, md: 600 },
    overflowX: 'auto',
    position: 'relative',
  },
},
    enableRowActions,
    positionActionsColumn: 'last',
    positionGlobalFilter: 'left',
    renderTopToolbarCustomActions: ({ tableAction }) => {
      const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => setAnchorEl(null);
      const open = Boolean(anchorEl);

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          {renderTopToolbarCustomActions && <Box>{renderTopToolbarCustomActions({ table })}</Box>}

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {extraToolbarActions?.()}

            {(enableExportCSV || enableExportPDF) && (
              <>
                <Button variant="standard" startIcon={<IoMdDownload />} onClick={handleOpen}>
                  {t_report('buttons.export')}
                </Button>

                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      minWidth: 220,
                      justifyContent: 'start',
                      alignItems: 'flex-start',
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
              </>
            )}
          </Box>
        </Box>
      );
    },
    //     renderRowActionMenuItems: ({ row }) => {
    //         const items = [];

    //         if (onEdit) {
    //             items.push(
    //                 <MenuItem onClick={() => onEdit(row.original)} key={`${row.id}-edit`}>
    //                     <IconifyLocal><BiSolidPencil size={18} /></IconifyLocal>
    //                     {t_common('button.edit')}
    //                 </MenuItem>
    //             );
    //         }

    //         if (onView) {
    //             items.push(
    //                 <MenuItem onClick={() => onView(row.original)} key={`${row.id}-view`}>
    //                     <IconifyLocal><TbListDetails size={18} /></IconifyLocal>
    //                     {t_common('button.details')}
    //                 </MenuItem>
    //             );
    //         }

    //         if (onDelete) {
    //             items.push(
    //                 <MenuItem
    //                     onClick={() => onDelete(row.original)}
    //                     sx={{ color: 'error.main' }}
    //                     key={`${row.id}-delete`}
    //                 >
    //                     <IconifyLocal><MdDelete size={18} /></IconifyLocal>
    //                     {t_common('button.delete')}
    //                 </MenuItem>
    //             );
    //         }

    //         if (Array.isArray(customRowActions)) {
    //             customRowActions.forEach((actionFnOrNode, index) => {
    //                 const result = typeof actionFnOrNode === 'function'
    //                     ? actionFnOrNode(row.original)
    //                     : actionFnOrNode;

    //                 if (result) {
    //                     items.push(
    //                         React.cloneElement(result, {
    //                             key: `${row.id}-custom-${index}`,
    //                         })
    //                     );
    //                 }
    //             });
    //         }

    //         return items;
    //     }
    // });
    renderRowActionMenuItems: ({ row }) => {
      const items = [];

      if (onEdit) {
        items.push(
          <MenuItem onClick={() => onEdit(row.original)} key={`${row.id}-edit`}>
            <IconifyLocal>
              <BiSolidPencil size={18} />
            </IconifyLocal>
            {t_common('button.edit')}
          </MenuItem>
        );
      }

      if (onView) {
        items.push(
          <MenuItem onClick={() => onView(row.original)} key={`${row.id}-view`}>
            <IconifyLocal>
              <TbListDetails size={18} />
            </IconifyLocal>
            {t_common('button.details')}
          </MenuItem>
        );
      }

      if (onDelete) {
        items.push(
          <MenuItem
            onClick={() => handleDelete(row.original)}
            sx={{ color: 'error.main' }}
            key={`${row.id}-delete`}
          >
            <IconifyLocal>
              <MdDelete size={18} />
            </IconifyLocal>
            {t_common('button.delete')}
          </MenuItem>
        );
      }

      // if (Array.isArray(customRowActions)) {
      //     customRowActions.forEach((actionFnOrNode, index) => {
      //         const result = typeof actionFnOrNode === 'function'
      //             ? actionFnOrNode(row.original)
      //             : actionFnOrNode;

      //         if (result) {
      //             items.push(
      //                 React.cloneElement(result, {
      //                     key: `${row.id}-custom-${index}`,
      //                 })
      //             );
      //         }
      //     });
      // }
      if (Array.isArray(customRowActions)) {
        customRowActions.forEach((actionFnOrNode, index) => {
          const result =
            typeof actionFnOrNode === 'function' ? actionFnOrNode(row.original) : actionFnOrNode;

          if (!result) return;

          // اگر آرایه برگردوند
          if (Array.isArray(result)) {
            result.forEach((item, i) => {
              if (React.isValidElement(item)) {
                items.push(
                  React.cloneElement(item, {
                    key: `${row.id}-custom-${index}-${i}`,
                  })
                );
              }
            });
            return;
          }

          // اگر Fragment بود
          if (result.type === React.Fragment) {
            React.Children.forEach(result.props.children, (child, i) => {
              if (React.isValidElement(child)) {
                items.push(
                  React.cloneElement(child, {
                    key: `${row.id}-custom-${index}-${i}`,
                  })
                );
              }
            });
            return;
          }

          // اگر MenuItem تکی بود
          if (React.isValidElement(result)) {
            items.push(
              React.cloneElement(result, {
                key: `${row.id}-custom-${index}`,
              })
            );
          }
        });
      }

      return items;
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>تأیید حذف</DialogTitle>
        <DialogContent>
          <Typography>آیا از حذف این آیتم اطمینان دارید؟ این عمل غیر قابل بازگشت است.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" size="small">
            حذف
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="primary"
            variant="contained"
            size="small"
          >
            انصراف
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
