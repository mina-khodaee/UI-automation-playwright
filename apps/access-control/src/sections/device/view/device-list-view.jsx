import { toast } from 'sonner';
import { useDebounce } from 'minimal-shared';
import { useState, useCallback } from 'react';
import { HiOutlinePlus } from 'react-icons/hi2';
import { varAlpha } from 'minimal-shared/utils';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import { Tab, Tabs, Button, Card, Paper, TablePagination, TableBody, Skeleton, TableCell, TableRow, Table, TableContainer, Box, Menu, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { STATUS_FILTERS } from 'src/_mock';
import { useDeviceActions } from 'src/stores/device-actions-store';
import { deleteDevice, saveDeviceUsersBiometricData, sendBiometricDataToDevice, useGetDevices } from 'src/actions/device';

import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { emptyRows, TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedAction, useTable } from 'src/components/table';

import { DeviceSyncInfo } from '../device-sync-info';
import { DeviceTableRow } from '../device-table-row';
import { OnlineDeviceList } from '../online-device-list';
import { DeviceTableToolbar } from '../device-table-toolbar';
import { DeviceSetSettings } from '../device-set-settings-dialog';
import { DeviceChangeGroup } from '../device-change-group-dialog';
import { DeviceNetworkSettings } from '../device-network-settings-dialog';
import { DeviceSecuritySettings } from '../device-security-settings-dialog';
import { DeviceInterfacekSettings } from '../device-interface-settings-dialog';

// ----------------------------------------------------------------------

export function DeviceListView() {
  const syncDevicesGroup = useDeviceActions((state) => state.syncDevicesWithAccessGroup);
  const { t: t_device } = useTranslate('device');
  const { t: t_common } = useTranslate();

  const table = useTable();
  const router = useRouter();
  const syncDevicesGroupConfirm = useBoolean();
  const deleteConfirm = useBoolean();
  const syncDeviceGroupConfirm = useBoolean();
  const getBiometricData = useBoolean();
  const sendBiometricData = useBoolean();
  const getMultiBiometricData = useBoolean();

  const TABLE_HEAD = [
    { id: 'picture', label: t_device('formsInputs.picture'), align: 'center', width: 30 },
    { id: 'brand/model', label: t_device('formsInputs.deviceModel'), align: 'center', width: 30 },
    { id: 'terminalId/serialNumber', label: `${t_device('formsInputs.terminalId')}/${t_device('formsInputs.serialNumber')}`, align: 'center', width: 30 },
    { id: 'accessGroupName', label: t_device('formsInputs.accessGroupName'), align: 'center', width: 30 },
    { id: 'usersLastSync', label: t_device('formsInputs.usersLastSync'), align: 'center', width: 30 },
    { id: 'syncUsersStatus', label: t_device('formsInputs.syncUsersStatus'), align: 'center', width: 30 },
    { id: 'isSyncWithAccessGroupUsers', label: t_device('formsInputs.isSyncWithAccessGroupUsers'), align: 'center', width: 30 },
    { id: 'editDelete', label: '', width: 50 },
  ];

  const [searchQuery, setSearchQuery] = useState();
  const debouncedQuery = useDebounce(searchQuery);
  const [pageQuery, setPageQuery] = useState(0);
  const [pageSizeQuery, setPageSizeQuery] = useState(5);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [getBiometricLoading, setGetBiometricLoading] = useState(false);
  const [getMultiBiometricLoading, setGetMultiBiometricLoading] = useState(false);
  const [sendBiometricLoading, setSendBiometricLoading] = useState(false);
  const [syncDeviceGroupLoading, setSyncDeviceGroupLoading] = useState(false);
  const filters = useSetState({ search: '' });
  const [selectedRowId, setSelectedRowId] = useState();
  const [openNetworkDialog, setOpenNetworkDialog] = useState(false);
  const [openSecurityDialog, setOpenSecurityDialog] = useState(false);
  const [openInterfaceDialog, setOpenInterfaceDialog] = useState(false);
  const [openSetSettingsDialog, setOpenSetSettingsDialog] = useState(false);
  const [openChangeGroupDialog, setOpenChangeGroupDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState();

  const [filterQuery, setFilterQuery] = useState();
  const { devices, devicesLoading, devicesEmpty, devicesTotalCount, mutate } = useGetDevices(filterQuery, debouncedQuery);
  const [filter, setFilter] = useState('all');
  const [onlineDevices, setOnlineDevices] = useState([]);
  const [syncInfo, setSyncInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnlineDevices = (OnlineDevicesList) => {
    setOnlineDevices(OnlineDevicesList);
  };

  const updatedDevices = devices.map((device) => {
    const isOnline = onlineDevices.some(
      (onlineDevice) =>
      {
        const match = (onlineDevice?.terminalID != null && onlineDevice?.terminalID === device?.terminalId) 
          || (onlineDevice?.serialNumber != null && onlineDevice?.serialNumber === device?.serialNumber);
    
        return match;
      }
    );
    const isSyncWithAccessGroupUsers = syncInfo?.deviceId === device.id && syncInfo?.syncUsersStatus === 'Synced' ? true : false;

    if (syncInfo && device.id === syncInfo.deviceId) {
      return { ...device, ...syncInfo, isOnline, isSyncWithAccessGroupUsers };
    }
    return {
      ...device,
      isOnline,
    };
  });
  const handleSyncDevicesWithAccessGroup = async (ids) => {
    try {
      setSyncDeviceGroupLoading(true);
      await syncDevicesGroup(ids);
      await mutate();
      toast.success(t_device('toastMessages.syncDeviceWithAccessGroup'));
      syncDeviceGroupConfirm.onFalse();
      syncDevicesGroupConfirm.onFalse();
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      setSyncDeviceGroupLoading(false);
    }
  };
  const handleGetBiometricDataFromDevice = async (ids) => {
    setGetBiometricLoading(true);
    try {
      await saveDeviceUsersBiometricData({ deviceIds: ids });
      toast.success(t_device('toastMessages.getBiometricDataFromDevice'));
      getBiometricData.onFalse();
    } catch (error) {
      toast.error(error);
    } finally {
      setGetBiometricLoading(false);
    }
  };

  const handleGetBiometricDataFromMultipleDevices = async (ids) => {
    setGetMultiBiometricLoading(true);
    try {
      await saveDeviceUsersBiometricData({ deviceIds: ids });
      toast.success(t_device('toastMessages.getBiometricDataFromMultipleDevices'));
      getMultiBiometricData.onFalse();
    } catch (error) {
      toast.error(error);
    } finally {
      setGetMultiBiometricLoading(false);
    }
  };

  const handleSendBiometricDataToDevice = async (id) => {
    setSendBiometricLoading(true);
    try {
      await sendBiometricDataToDevice({ deviceId: id });
      toast.success(t_device('toastMessages.sendBiometricDataToDevice'));
      sendBiometricData.onFalse();
    } catch (error) {
      toast.error(error);
    } finally {
      setSendBiometricLoading(false);
    }
  };
  const handleSearch = useCallback((e) => {
    if (e.target.value?.length > 2) {
      setSearchQuery(e.target.value)
    }
    else {
      setSearchQuery();
    }
    filters.setState({ search: e.target.value });
  }, [filters]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteDevice(selectedRowId);
      await mutate();
      toast.success(t_device('toastMessages.delete'));
      deleteConfirm.onFalse();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.device.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback((event, newValue) => {
    setFilter(newValue);
    switch (newValue) {
      case 'active':
        setFilterQuery("isactive|eq|true");
        break;
      case 'inactive':
        setFilterQuery("isactive|eq|false");
        break;
      default:
        setFilterQuery(null);
    }
  }, []);
  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.device.edit(id));
    },
    [router]
  );

  return (
    <>
      <DashboardContent>

        <CustomBreadcrumbs
          heading={t_device('breadCrumb.device')}
          links={[
            { name: t_device('breadCrumb.dashboard'), href: paths.dashboard.root },
            { name: t_device('breadCrumb.device') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.device.create}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_device('button.new')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <OnlineDeviceList onGet={handleOnlineDevices} />
        <DeviceSyncInfo onGet={(e) => setSyncInfo(e)} />
        <Paper elevation={12}>
          <Card sx={{ boxShadow: 'none' }}>
            <Tabs
              value={filter}
              onChange={handleFilterStatus}
              sx={[
                (theme) => ({
                  boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                }),
              ]}>
              {STATUS_FILTERS.map((tab) => (
                <Tab
                  key={tab}
                  iconPosition="end"
                  value={tab}
                  label={
                    <Label
                      variant={tab === filter || tab === 'all' ? 'filled' : 'soft'}
                      color={getTabColor(tab)}
                    >
                      {t_device(`filters.${tab}`)}
                    </Label>
                  }
                  sx={{ textTransform: 'capitalize' }}
                />
              ))}
            </Tabs>

            <DeviceTableToolbar
              filters={filters}
              onSearch={handleSearch}
            />
            <Box sx={{ position: 'relative' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={devices.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    devices.map((row) => row.id)
                  )
                }
                action={
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleOpen}
                      size="small"
                      sx={{
                        fontSize: { xs: '0.7rem', md: '0.875rem' },
                        px: 2,
                        py: 0.5,
                        textTransform: 'none',
                      }}
                    >
                      {t_device('button.groupActions')}
                    </Button>

                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                      <MenuItem
                        onClick={() => {
                          handleClose();
                          getMultiBiometricData.onTrue();
                        }}
                      >
                        {t_device('button.getBiometricDataFromMultipleDevices')}
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          handleClose();
                          syncDevicesGroupConfirm.onTrue();
                        }}
                      >
                        {t_device('button.syncDevicesWithAccessGroup')}
                      </MenuItem>
                    </Menu>
                  </Box>
                }
              />
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={devicesTotalCount}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        devices.map((row) => row.id)
                      )
                    }
                  />
                  {devicesLoading ? (
                    <TableBody>{
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={1}>
                            <Skeleton variant="rectangular" width="100%" height={50} />
                          </TableCell>
                          <TableCell colSpan={2}>
                            <Skeleton variant="rectangular" width="100%" height={50} />
                          </TableCell>
                          <TableCell colSpan={2}>
                            <Skeleton variant="rectangular" width="100%" height={50} />
                          </TableCell>
                          <TableCell colSpan={2}>
                            <Skeleton variant="rectangular" width="100%" height={50} />
                          </TableCell>
                          <TableCell colSpan={3}>
                            <Skeleton variant="rectangular" width="100%" height={50} />
                          </TableCell>
                        </TableRow>
                      ))}</TableBody>
                  ) : (
                    <TableBody>
                      {updatedDevices
                        .map((row) => (
                          <DeviceTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onView={() => handleViewRow(row.id)}
                            onDeleteRow={() => { deleteConfirm.onTrue(); setSelectedRowId(row.id) }}
                            onEditRow={() => handleEditRow(row.id)}
                            onSyncDeviceGroup={() => { syncDeviceGroupConfirm.onTrue(); setSelectedRowId(row.id); setSelectedDevice(row) }}
                            onSecurityDialog={() => { setOpenSecurityDialog(true); setSelectedDevice(row) }}
                            onSetOpenChangeGroupDialog={() => { setOpenChangeGroupDialog(true); setSelectedDevice(row) }}
                            onSetSettingsDialog={() => { setOpenSetSettingsDialog(true); setSelectedRowId(row.id) }}
                            onInterfaceDialog={() => { setOpenInterfaceDialog(true); setSelectedDevice(row) }}
                            onNetworkDialog={() => { setOpenNetworkDialog(true); setSelectedDevice(row) }}
                            onGetBiometric={() => { getBiometricData.onTrue(); setSelectedRowId(row.id) }}
                            onSendBiometric={() => { sendBiometricData.onTrue(); setSelectedRowId(row.id) }}
                          />
                        ))}
                      <TableEmptyRows
                        height={56 + 20}
                        emptyRows={emptyRows(pageQuery - 1, pageSizeQuery, devicesTotalCount)}
                      />
                      <TableNoData notFound={devicesEmpty} />
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Box>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              page={pageQuery}
              count={devicesTotalCount}
              rowsPerPage={pageSizeQuery}
              onPageChange={(event, newPage) =>
                setPageQuery(newPage)
              }
              onRowsPerPageChange={(e) => setPageSizeQuery(parseInt(e.target.value, 10))
              }
              component="div"
              sx={{ borderTopColor: 'transparent' }}
            />
          </Card>
        </Paper>

      </DashboardContent>
      <ConfirmDialog
        open={sendBiometricData.value}
        onClose={sendBiometricData.onFalse}
        title={t_device('button.sendBiometricDataToDevice')}
        content={t_device('texts.sendBiometricDataToDevice')}
        action={
          <Button variant="contained" color='success' onClick={() => handleSendBiometricDataToDevice(selectedRowId)} loading={sendBiometricLoading}>
            {t_device('button.sendBiometricDataToDevice')}
          </Button>
        }
      />
      <ConfirmDialog
        open={getMultiBiometricData.value}
        onClose={getMultiBiometricData.onFalse}
        title={t_device('button.getBiometricDataFromMultipleDevices')}
        content={t_device('texts.getBiometricDataFromMultipleDevices')}
        action={
          <Button variant="contained" color='success' onClick={() => handleGetBiometricDataFromMultipleDevices(table.selected)} loading={getMultiBiometricLoading}>
            {t_device('button.getBiometricDataFromMultipleDevices')}
          </Button>
        }
      />
      <ConfirmDialog
        open={syncDevicesGroupConfirm.value}
        onClose={syncDevicesGroupConfirm.onFalse}
        title={t_device('button.syncDevicesWithAccessGroup')}
        content={t_device('texts.syncDeviceWithAccessGroup')}
        action={
          <Button variant="contained" color='success' onClick={() => handleSyncDevicesWithAccessGroup(table.selected)}>
            {t_device('button.syncDevicesWithAccessGroup')}
          </Button>
        }
      />
      <ConfirmDialog
        open={deleteConfirm.value}
        onClose={deleteConfirm.onFalse}
        title={t_common('button.delete')}
        content={t_common('commonTexts.deleteConfirm')}
        action={
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? t_common('button.deleteLoading') : t_common('button.delete')}
          </Button>
        }
      />
      <ConfirmDialog
        open={syncDeviceGroupConfirm.value}
        onClose={syncDeviceGroupConfirm.onFalse}
        title={t_device('button.syncDeviceWithAccessGroup')}
        content={t_device('texts.syncDeviceWithAccessGroup')}
        action={
          <Button variant="contained" color='success' onClick={() => handleSyncDevicesWithAccessGroup(selectedRowId)} disabled={syncDeviceGroupLoading}>
            {syncDeviceGroupLoading ? t_device('button.syncing') : t_device('button.syncDeviceWithAccessGroup')}
          </Button>
        }
      />
      <ConfirmDialog
        open={getBiometricData.value}
        onClose={getBiometricData.onFalse}
        title={t_device('button.getBiometricDataFromDevice')}
        content={t_device('texts.getBiometricDataFromDevice')}
        action={
          <Button variant="contained" color='success' onClick={() => handleGetBiometricDataFromDevice([selectedRowId])} disabled={getBiometricLoading}>
            {getBiometricLoading ? t_common('button.sending') : t_device('button.getBiometricDataFromDevice')}
          </Button>
        }
      />
      {openNetworkDialog && <DeviceNetworkSettings open={openNetworkDialog} onClose={() => setOpenNetworkDialog(false)} device={selectedDevice} />}
      {openInterfaceDialog && <DeviceInterfacekSettings open={openInterfaceDialog} onClose={() => setOpenInterfaceDialog(false)} device={selectedDevice} />}
      {openSecurityDialog && <DeviceSecuritySettings open={openSecurityDialog} onClose={() => setOpenSecurityDialog(false)} device={selectedDevice} />}
      <DeviceSetSettings open={openSetSettingsDialog} onClose={() => setOpenSetSettingsDialog(false)} id={selectedRowId} />
      {openChangeGroupDialog && <DeviceChangeGroup open={openChangeGroupDialog} onClose={() => setOpenChangeGroupDialog(false)} device={selectedDevice} />}
    </>
  );
}
const getTabColor = (tab) => {
  if (tab === 'active') return 'success';
  if (tab === 'inactive') return 'error';
  return 'default';
};


