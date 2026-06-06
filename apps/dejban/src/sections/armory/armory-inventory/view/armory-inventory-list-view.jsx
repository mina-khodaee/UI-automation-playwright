// src/sections/armory-inventory/view/armory-inventory-list-view.jsx

'use client';

import { toast } from 'sonner';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Paper, IconButton, Tooltip, Chip } from '@mui/material';
import { useTranslate } from 'src/locales';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ArmoryInventoryNewEditForm } from '../armory-inventory-new-edit-form';
import {
    useGetInventory,
    useDeleteInventory,
    useDisableInventory,
    useEnableInventory,
    useChangeStatus
} from 'src/services/armory-inventory/armory-inventory.service';
import { useGetEquipments } from 'src/services/armory-equipments/armory-equipments.service';
import { useSiteAPI } from 'src/stores/site-api';
import { useGetArmoryLocations } from 'src/services/armory-locations/armory-locations.service';
import { MdBlock, MdCheckCircle, MdHistory, MdSwapHoriz } from 'react-icons/md';
import { useGetSites } from 'src/services/siteManagement/site.service';

export function ArmoryInventoryListView() {
    const { t: t_inventory } = useTranslate('armory-inventory');
    const { t: t_common, currentLang } = useTranslate();

    const [openDialog, setOpenDialog] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortOrder: ''
    });

    const { data, isLoading, refetch } = useGetInventory({
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        searchTerm: queryParams.searchTerm,
        sortColumn: queryParams.sortColumn,
        sortOrder: queryParams.sortOrder,
    });

    // گرفتن دیتاهای مرتبط برای نمایش نام‌ها
    const { data: equipmentsData } = useGetEquipments({ page: 1, pageSize: 100 });
    const { data: sitesData } = useGetSites({ page: 1, pageSize: 100 });

    const { data: locationsData } = useGetArmoryLocations({ page: 1, pageSize: 100 });

    const equipmentsMap = useMemo(() => {
        const map = new Map();
        (equipmentsData?.items || []).forEach((eq) => {
            map.set(eq.id, eq.name);
        });
        return map;
    }, [equipmentsData]);

    const sitesMap = useMemo(() => {
        const map = new Map();
        (sitesData?.items || []).forEach((site) => {
            map.set(site.id, site.name);
        });
        return map;
    }, [sitesData]);

    const locationsMap = useMemo(() => {
        const map = new Map();
        (locationsData?.items || []).forEach((loc) => {
            map.set(loc.id, loc.name);
        });
        return map;
    }, [locationsData]);

    const allItems = data?.items || [];
    const totalCount = data?.totalCount || 0;

    const handleRefetch = () => refetch();

    const handleCreate = () => {
        setCurrentItem(null);
        setOpenDialog(true);
    };

    const deleteItem = useDeleteInventory();
    const disableItem = useDisableInventory();
    const enableItem = useEnableInventory();
    const changeStatus = useChangeStatus();

    const handleDeleteRow = (row) => {
        deleteItem.mutate(row?.id, {
            onSuccess: () => {
                toast.success(t_inventory('toastMessages.deleteSuccess'));
            },
            onError: (error) => {
                toast.error(error.message || t_common('errors.unknownError'));
            },
        });
    };

    const handleDisableRow = (row) => {
        disableItem.mutate(row.id, {
            onSuccess: () => {
                toast.success(t_inventory('toastMessages.disableSuccess'));
            },
            onError: (error) => {
                toast.error(error.message || t_common('errors.unknownError'));
            },
        });
    };

    const handleEnableRow = (row) => {
        enableItem.mutate(row.id, {
            onSuccess: () => {
                toast.success(t_inventory('toastMessages.enableSuccess'));
            },
            onError: (error) => {
                toast.error(error.message || t_common('errors.unknownError'));
            },
        });
    };

    const handleEditRow = (row) => {
        setCurrentItem(row);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentItem(null);
    };

    const handleSort = (column, direction) => {
        setQueryParams(prev => ({ ...prev, sortColumn: column, sortOrder: direction }));
    };

    const handleSearch = (searchValue) => {
        setQueryParams(prev => ({ ...prev, searchTerm: searchValue, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setQueryParams(prev => ({ ...prev, page: newPage }));
    };

    const handlePageSizeChange = (newPageSize) => {
        setQueryParams(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
    };

    const statusColors = {
        'نو': 'success',
        'کارکرده': 'info',
        'تعمیری': 'warning',
        'از رده خارج': 'error',
    };


    const columns = useMemo(() => [
        {
            accessorKey: 'equipmentId',
            header: t_inventory('columns.equipment'),
            width: 200,
            Cell: ({ cell }) => equipmentsMap.get(cell.getValue()) || '-',
        },
        {
            accessorKey: 'serialNumber',
            header: t_inventory('columns.serialNumber'),
            width: 180,
            Cell: ({ cell }) => cell.getValue() || '-',
        },
        {
            accessorKey: 'quantity',
            header: t_inventory('columns.quantity'),
            width: 120,
            Cell: ({ cell }) => {
                const qty = cell.getValue();
                if (qty && qty > 0) {
                    return `${qty.toLocaleString()} عدد`;
                }
                return '-';
            },
        },
        {
            accessorKey: 'status',
            header: t_inventory('columns.status'),
            width: 120,
            Cell: ({ cell }) => {
                const status = cell.getValue();
                // eslint-disable-next-line no-shadow
                const statusColors = {
                    'نو': 'success',
                    'کارکرده': 'info',
                    'تعمیری': 'warning',
                    'از رده خارج': 'error',
                };
                return (
                    <Chip
                        label={status}
                        color={statusColors[status] || 'default'}
                        size="small"
                    />
                );
            },
        },
        {
            accessorKey: 'manufactureYear',
            header: t_inventory('columns.manufactureYear'),
            width: 100,
            Cell: ({ cell }) => cell.getValue() || '-',
        },
        {
            accessorKey: 'siteId',
            header: t_inventory('columns.site'),
            width: 150,
            Cell: ({ cell }) => {
                const siteId = cell.getValue();
                const site = sitesData?.items?.find(s => s.id === siteId);
                return site?.name || '-';
            },
        },
        {
            accessorKey: 'locationId',
            header: t_inventory('columns.location'),
            width: 150,
            Cell: ({ cell }) => {
                const locationId = cell.getValue();
                const location = locationsData?.items?.find(l => l.id === locationId);
                return location?.name || '-';
            },
        },
        {
            accessorKey: 'isActive',
            header: t_inventory('columns.status'),
            width: 100,
            Cell: ({ cell }) => (
                <Chip
                    label={cell.getValue() ? t_common('status.active') : t_common('status.inactive')}
                    color={cell.getValue() ? 'success' : 'error'}
                    size="small"
                />
            ),
        },
        {
            accessorKey: 'notes',
            header: t_common('formsInputs.description'),
            width: 200,
            Cell: ({ cell }) => cell.getValue() || '-',
        },
    ], [currentLang, t_inventory, t_common, equipmentsMap, sitesData, locationsData]);


    console.log('=== دیباگ سایت ===');
    console.log('sitesData:', sitesData);
    console.log('allItems:', allItems);
    console.log('اولین آیتم siteId:', allItems[0]?.siteId);
    console.log('sitesMap:', sitesMap);
    console.log('sitesMap get first siteId:', sitesMap.get(allItems[0]?.siteId));
    return (
        <>
            <DashboardContent maxWidth="xxl">
                <CustomBreadcrumbs
                    heading={t_inventory('breadcrumb.title')}
                    action={
                        <Button
                            color="inherit"
                            onClick={handleCreate}
                            variant="contained"
                            startIcon={<HiOutlinePlus />}
                        >
                            {t_inventory('buttons.newItem')}
                        </Button>
                    }
                    sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
                />

                <Paper elevation={12}>
                    <Card>
                        <MRTDataTable
                            data={allItems}
                            columns={columns}
                            isLoading={isLoading}
                            rowCount={totalCount}
                            setQueryParams={setQueryParams}
                            refetchMethod={handleRefetch}
                            page={queryParams.page}
                            pageSize={queryParams.pageSize}
                            onSort={handleSort}
                            onSearch={handleSearch}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            onDelete={handleDeleteRow}
                            onEdit={handleEditRow}
                            extraActions={[
                                {
                                    icon: <MdBlock size={20} />,
                                    tooltip: t_inventory('actions.disable'),
                                    onClick: handleDisableRow,
                                    show: (row) => row.isActive === true,
                                },
                                {
                                    icon: <MdCheckCircle size={20} />,
                                    tooltip: t_inventory('actions.enable'),
                                    onClick: handleEnableRow,
                                    show: (row) => row.isActive === false,
                                },
                            ]}
                        />
                    </Card>
                </Paper>
            </DashboardContent>

            <ArmoryInventoryNewEditForm
                open={openDialog}
                onClose={handleCloseDialog}
                currentItem={currentItem}
                onRefetch={handleRefetch}
            />
        </>
    );
}