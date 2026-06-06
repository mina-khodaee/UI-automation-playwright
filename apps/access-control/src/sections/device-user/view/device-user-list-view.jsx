import { toast } from 'sonner';
import { BiSolidPencil } from 'react-icons/bi';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useState, useCallback, useMemo } from 'react';
import { useBoolean, usePopover } from 'minimal-shared/hooks';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { IoAnalyticsSharp, IoFingerPrint } from 'react-icons/io5';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { MenuItem, MenuList, Paper } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useDeviceUserStore } from 'src/stores/device-user-store';
import { deleteDeviceUsers, setUserBiometricDataToDevices } from 'src/actions/device-user';

import { IconifyLocal } from 'src/components/iconify';
import { MRTDataTable } from 'src/components/mrt-datatable';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QuicEditAccessGroup } from '../quick-edit-access-group-dialog';
import { QuickCreateDeviceUser } from '../device-user-quick-create-dialog';
import { GetDeviceUserBiometricData } from '../get-device-user-biometric-data';
import { QuicEditAuthTypeConfig } from '../quick-edit-auth-type-config-dialog';

// ----------------------------------------------------------------------

export function DeviceUserListView() {
  const { setCards, setFingerprints, getDeviceUsers, totalCount, loading, items, userTypes, getUserTypes } = useDeviceUserStore();
  const router = useRouter();
  const deleteConfirm = useBoolean(false);
  const setBiomericDataToDevicesConfirm = useBoolean(false);
  const addPopover = usePopover();
  const { t: t_user } = useTranslate('user');
  const { t: t_common, currentLang } = useTranslate();

  const [selectedRowId, setSelectedRowId] = useState();
  const [syncFlag, setSyncFlag] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openQuickAddDialog, setOpenQuickAddDialog] = useState(false);
  const [openEditConfigureTypeDialog, setOpenEditConfigureTypeDialog] = useState(false);
  const [openEditAccessGroupsDialog, setOpenEditAccessGroupsDialog] = useState(false);
  const [currentAccessGroups, setCurrentAccessGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [sendUserBiometricLoading, setSendUserBiometricLoading] = useState(false);
  const [openGetUserBiometricDialog, setOpenGetUserBiometricDialog] = useState(false);

  const handleDeleteRow = async () => {
    setDeleteLoading(true);
    try {
      await deleteDeviceUsers(selectedRowId, syncFlag);
      toast.success(t_user('toastMessages.deleteDeviceUser'));
      deleteConfirm.onFalse();
      getDeviceUsers();
    } catch (error) {
      toast.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSendUserBiometricDataToDevices = async (Id) => {
    setSendUserBiometricLoading(true);
    try {
      await setUserBiometricDataToDevices({ Id });
      toast.success(t_user('toastMessages.sendUserBiometricDataToDevices'));
      setBiomericDataToDevicesConfirm.onFalse();
    } catch (error) {
      toast.error(error);
    } finally {
      setSendUserBiometricLoading(false);
    }
  };

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.aclUserManagement.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.aclUserManagement.details(id));
    },
    [router]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'userId',
        header: t_user('columns.userId'),
        accessorFn: (row) => row.userID || '',
        enableColumnFilterModes: false,
        filterVariant: 'text',
        size: 50,
        Cell: ({ cell }) => cell.getValue() || '',
      },
      {
        accessorKey: 'userName',
        header: t_user('columns.userName'),
        width: 180,
        columnFilterModeOptions: ['equals', 'contains'],
        filterFn: 'equals',
      },
      {
        accessorKey: 'userType',
        header: t_user('columns.userType'),
        size: 160,
        enableColumnFilterModes: false,
        enableSorting: false,
        filterVariant: 'select',
        filterSelectOptions: userTypes.map(opt => opt.value),
        muiFilterTextFieldProps: {
          select: true,
          onFocus: () => {
            getUserTypes();
          },
          children: userTypes.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.displayValues[currentLang?.value]}
            </MenuItem>
          )),
        },
        accessorFn: (row) =>
          row.userType?.displayValues?.[currentLang?.value] || '',
        Cell: ({ cell }) => cell.getValue() || '',
      },
      {
        accessorKey: 'createdAt',
        accessorFn: (row) => new Date(row.createdAt),
        type: 'dateTime',
        header: t_user('columns.createdAt'),
        filterFn: 'between',
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'],
        filterVariant: 'datetime',
        size: 250,
        Cell: ({ cell }) => fDateTime(cell.getValue()),
      }
    ],
    [currentLang, userTypes],
  );

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading={t_user('breadcrumb.deviceUsers')}
          links={[
            { name: t_user('breadcrumb.dashboard'), href: paths.dashboard.root },
            { name: t_user('breadcrumb.deviceUsers') },
          ]}
          action={
            <Button
              color='inherit'
              onClick={addPopover.onOpen}
              variant="contained"
              startIcon={<HiOutlinePlus />}
            >
              {t_user('buttons.newDeviceUser')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />


        <Paper elevation={12}>
          <Card
          >
            <MRTDataTable
              data={items}
              columns={columns}
              isLoading={loading.getDeviceUsers}
              rowCount={totalCount}
              refetchMethod={getDeviceUsers}
              onView={(row) => handleViewRow(row.userID)}
              onDelete={(row) => { deleteConfirm.onTrue(); setSelectedRowId(row.userID); setCurrentUser(row) }}
              onEdit={(row) => handleEditRow(row.userID)}
              customRowActions={[
                (row) => (
                  <MenuItem onClick={() => router.push(paths.dashboard.trafficReport.root, { userId: row.userID })}>
                    <IconifyLocal>
                      <IoAnalyticsSharp size={18} />
                    </IconifyLocal>
                    {t_user('buttons.userReports')}
                  </MenuItem>
                ),
                (row) => (
                  <MenuItem onClick={() => { setOpenEditConfigureTypeDialog(true); setCurrentUser(row); setCards(row.cards); setFingerprints(row.fingerPrints) }}>
                    <IconifyLocal><BiSolidPencil size={18} /></IconifyLocal>
                    {t_user('buttons.editConfigureType')}
                  </MenuItem>
                ),
                (row) => (
                  <MenuItem onClick={() => { setOpenEditAccessGroupsDialog(true); setCurrentAccessGroups(row.aclUserAccessGroups); setSelectedRowId(row.userID) }}>
                    <IconifyLocal><BiSolidPencil size={18} /></IconifyLocal>
                    {t_user('buttons.editAccessGroups')}
                  </MenuItem>
                ),
                (row) => (
                  <MenuItem onClick={() => { setBiomericDataToDevicesConfirm.onTrue(); setCurrentUser(row) }}>
                    <IconifyLocal>
                      <IoFingerPrint size={18} />
                    </IconifyLocal>
                    {t_user('buttons.sendUserBiometricDataToDevices')}
                  </MenuItem>
                ),
                (row) => (
                  <MenuItem onClick={() => { setOpenGetUserBiometricDialog(true); setSelectedRowId(row.userID); setCurrentAccessGroups(row.aclUserAccessGroups); }}>
                    <IconifyLocal>
                      <IoFingerPrint size={18} />
                    </IconifyLocal>
                    {t_user('buttons.getUserBiometricDataFromDevice')}
                  </MenuItem>
                ),
              ]}
            />
          </Card>
        </Paper>

      </DashboardContent >
      <ConfirmDialog
        open={deleteConfirm.value}
        onClose={deleteConfirm.onFalse}
        title={t_common('button.delete')}
        content={t_common('commonTexts.deleteConfirm')}
        flag={syncFlag}
        onFlagChange={setSyncFlag}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow();
            }}
            disabled={deleteLoading}
          >
            {deleteLoading ? t_common('button.deleteLoading') : t_common('button.delete')}
          </Button>
        }
      />
      <ConfirmDialog
        open={setBiomericDataToDevicesConfirm.value}
        onClose={setBiomericDataToDevicesConfirm.onFalse}
        title={t_user('buttons.sendUserBiometricDataToDevices')}
        content={t_user('texts.sendUserBiometricDataToDevices')}
        action={
          <Button variant="contained" color='success' onClick={() => handleSendUserBiometricDataToDevices(currentUser.userID)} disabled={sendUserBiometricLoading}>
            {sendUserBiometricLoading ? t_common('button.sending') : t_user('buttons.sendUserBiometricDataToDevices')}
          </Button>
        }
      />
      <CustomPopover
        open={addPopover.open}
        anchorEl={addPopover.anchorEl}
        onClose={addPopover.onClose}
        slotProps={{ arrow: { placement: 'left-center' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              addPopover.onClose();
              router.push(paths.dashboard.aclUserManagement.create);
            }}
          >
            {t_user('buttons.addNewDeviceUser')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              addPopover.onClose();
              setOpenQuickAddDialog(true);
            }}
          >
            {t_user('buttons.quickAddNewDeviceUser')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
      {openEditConfigureTypeDialog && <QuicEditAuthTypeConfig open={openEditConfigureTypeDialog} onClose={() => setOpenEditConfigureTypeDialog(false)} currentUser={currentUser} onMutate={() => getDeviceUsers()} />}
      {openQuickAddDialog && <QuickCreateDeviceUser open={openQuickAddDialog} onClose={() => setOpenQuickAddDialog(false)} onMutate={() => getDeviceUsers()} />}
      {openEditAccessGroupsDialog && <QuicEditAccessGroup open={openEditAccessGroupsDialog} onClose={() => setOpenEditAccessGroupsDialog(false)} currentAccessGroups={currentAccessGroups} userID={selectedRowId} onMutate={() => getDeviceUsers()} />}
      {openGetUserBiometricDialog && <GetDeviceUserBiometricData open={openGetUserBiometricDialog} onClose={() => setOpenGetUserBiometricDialog(false)} currentAccessGroups={currentAccessGroups} userID={selectedRowId} />}
    </>
  );
}

