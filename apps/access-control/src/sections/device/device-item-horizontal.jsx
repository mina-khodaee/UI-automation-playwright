import { toast } from 'sonner';
import { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { useTheme } from '@emotion/react';
import { IoMdMore } from 'react-icons/io';
import { BiSolidPencil } from 'react-icons/bi';
import { RiCommandLine } from "react-icons/ri";
import { useBoolean, usePopover } from 'minimal-shared';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Button, SvgIcon, Tooltip, useMediaQuery } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fDate, fToNow } from 'src/utils/format-time';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales';
import { deleteDevice, useGetDevices } from 'src/actions/device';
import { useDeviceActions } from 'src/stores/device-actions-store';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';

import { DeviceDoorStatus } from './devcie-door-status-dialog';
import { DeviceSetSettings } from './device-set-settings-dialog';
import { DeviceChangeGroup } from './device-change-group-dialog';
import { DeviceNetworkSettings } from './device-network-settings-dialog';
import { DeviceSecuritySettings } from './device-security-settings-dialog';
import { DeviceInterfacekSettings } from './device-interface-settings-dialog';

// ----------------------------------------------------------------------

export function DeviceItemHorizontal({ device, onSelect, sx, ...other }) {
  const setMaintenanceMode = useDeviceActions((state) => state.setMaintenanceMode);
  const syncDevicesGroup = useDeviceActions((state) => state.syncDevicesWithAccessGroup);
  const editPopover = usePopover();
  const settingPopover = usePopover();
  const commandPopover = usePopover();
  const setMaintenanceModeConfirm = useBoolean();
  const syncDeviceGroupConfirm = useBoolean();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const confirm = useBoolean();
  const router = useRouter();
  const { t: t_common } = useTranslate();
  const { t: t_device } = useTranslate('device');

  const { mutate } = useGetDevices();
  const [openNetworkDialog, setOpenNetworkDialog] = useState(false);
  const [openSecurityDialog, setOpenSecurityDialog] = useState(false);
  const [openInterfaceDialog, setOpenInterfaceDialog] = useState(false);
  const [openSetSettingsDialog, setOpenSetSettingsDialog] = useState(false);
  const [openDoorStatusDialog, setOpenDoorStatusDialog] = useState(false);
  const [openChangeGroupDialog, setOpenChangeGroupDialog] = useState(false);
  const [syncDeviceGroupLoading, setSyncDeviceGroupLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [maintenaceModeLoading, setMaintenaceModeLoading] = useState(false);

  const handleMaintenanceMode = async () => {
    try {
      setMaintenaceModeLoading(true);
      await setMaintenanceMode({ deviceId: device.id, maintenanceMode: !device.maintenanceMode });
      await mutate();
      toast.success(t_device('toastMessages.changeMaintenanceMode'));
      setMaintenanceModeConfirm.onFalse();
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      setMaintenaceModeLoading(false);
    }
  };
  const handleSyncDevicesGroup = async () => {
    try {
      setSyncDeviceGroupLoading(true);
      await syncDevicesGroup({ deviceIds: [device.id] });
      await mutate();
      toast.success(t_device('toastMessages.syncDeviceWithAccessGroup'));
      syncDeviceGroupConfirm.onFalse();
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      setSyncDeviceGroupLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteDevice(device.id);
      await mutate();
      toast.success(t_device('toastMessages.delete'));
      confirm.onFalse();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Card sx={{
        mx: 0.5,
        maxWidth: { xs: 560, md: 700, lg: 560 },
        mb: 0.5,
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 2,
        boxShadow: 6,
        overflow: 'hidden',
        ...sx
      }}
        onClick={() => onSelect(device.id)}
        {...other}>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          sx={{
            flexGrow: 1,
            maxWidth: { isSmUp } ? '100%' : '90%',
            color: 'text.primary',
            paddingLeft: 1,
            paddingY: 1
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" >
            <Box display="flex" flexDirection="column" flexWrap={{ xs: 'wrap' }} alignItems="flex-start" sx={{ mt: 1 }}>
              <Box display="flex" gap={0.3} flexWrap={{ xs: 'wrap' }} justifyContent="flex-start">
                <Label variant="soft" ratio="10" color={device?.isActive ? 'success' : 'error'}>
                  {device?.isActive ? t_device('filters.active') : t_device('filters.inactive')}
                </Label>
                {device?.isOnline ? (
                  <Label color="success">{t_device('filters.online')}</Label>
                ) : (
                  <Label color="error">{t_device('filters.offline')}</Label>
                )}
                {device?.isSyncWithAccessGroupUsers ? (
                  <Label color="success">{t_device('formsInputs.isSyncWithAccessGroupUsers')}</Label>
                ) : (
                  <Label color="error">{t_device('formsInputs.notSyncWithAccessGroup')}</Label>
                )}
              </Box>

              {device.isOnline && <Box component="span" display='flex' sx={{
                typography: 'caption',
                alignContent: 'center',
                color: 'text.dark',
                justifyContent: 'flex-start',
                whiteSpace: 'nowrap',
                mt: 1,
              }}>
                {t_device('formsInputs.uptime')}:{fToNow(device?.lastConnected) ?? '-'}
              </Box>}
            </Box>

            <Box display="flex" sx={{ mx: 0, p: 0 }}>
              <IconButton
                color={commandPopover.open ? 'inherit' : 'default'}
                onClick={commandPopover.onOpen}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <Tooltip title={t_device('button.commands')} arrow>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RiCommandLine size={24} />
                  </Box>
                </Tooltip>

              </IconButton>
              <IconButton
                color={settingPopover.open ? 'inherit' : 'default'}
                onClick={settingPopover.onOpen}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <Tooltip title={t_common('button.settings')} arrow>
                  <SvgIcon>
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2.008 2.008 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.615 1.615 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.026 2.026 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361c0 .558-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a1.99 1.99 0 0 0-.399 1.479c.053.394.287.798.757 1.605c.47.807.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2.008 2.008 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a1.99 1.99 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361c0-.558.306-1.064.782-1.36c.324-.203.533-.364.682-.556a1.99 1.99 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605c-.47-.807-.704-1.21-1.022-1.453a2.026 2.026 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.615 1.615 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2.007 2.007 0 0 0-1.09-1.083"
                      clipRule="evenodd"
                      opacity="0.5"
                    />
                    <path
                      fill="currentColor"
                      d="M15.523 12c0 1.657-1.354 3-3.023 3c-1.67 0-3.023-1.343-3.023-3S10.83 9 12.5 9c1.67 0 3.023 1.343 3.023 3"
                    />
                  </SvgIcon>
                </Tooltip>
              </IconButton>
              <IconButton
                color={editPopover.open ? 'inherit' : 'default'}
                onClick={editPopover.onOpen}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <Tooltip title={t_common('button.more')} arrow>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IoMdMore />
                  </Box>
                </Tooltip>
              </IconButton>
            </Box>
          </Box>
          <Stack spacing={1} sx={{ p: 1 }} display='flex'>
            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  color: 'grey.700',
                  fontSize: '0.875rem',
                  fontWeight: 'normal',
                  mr: 1,
                }}
              >
                {t_device('formsInputs.deviceModel')}:
              </Typography>
              <Link
                component={RouterLink}
                href={paths.dashboard.device.details(device.id)}
              >
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  {device?.deviceType.brand}/{device?.deviceType.model}
                </Typography>
              </Link>

            </Box>

            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  color: 'grey.700',
                  fontSize: '0.875rem',
                  fontWeight: 'normal',
                  mr: 1,
                }}
              >
                {t_device('formsInputs.terminalIP')}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {device?.networkOptions.terminalIP}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  color: 'grey.700',
                  fontSize: '0.875rem',
                  fontWeight: 'normal',
                  mr: 1,
                }}
              >
                {t_device('formsInputs.serialNumber')}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {device?.serialNumber}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  color: 'grey.700',
                  fontSize: '0.875rem',
                  fontWeight: 'normal',
                  mr: 1,
                }}
              >
                {t_device('formsInputs.terminalId')}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {device?.terminalId}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  color: 'grey.700',
                  fontSize: '0.875rem',
                  fontWeight: 'normal',
                  mr: 1,
                }}
              >
                {t_device('formsInputs.accessGroup')}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {device?.accessGroup?.name}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  color: 'grey.700',
                  fontSize: '0.875rem',
                  fontWeight: 'normal',
                  mr: 1,
                }}
              >
                {t_device('formsInputs.lastUpdated')}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {device?.updatedAt ? fDate(device?.updatedAt) : '-'}
              </Typography>
            </Box>
          </Stack>
        </Box>
        {isSmUp && (
          <Box
            sx={{
              maxWidth: 155,
              minHeight: 270,
              display: 'flex',
              justifyContent: 'flex-end',
              borderRadius: 1,
              borderLeft: '1px solid #e0e0e0',
            }}
          >
            <Image
              alt={device.deviceType.brand}
              src={`${CONFIG.serverUrl}/${device.deviceType?.imageUrl}`}
              onError={event => {
                event.target.src = '/assets/images/mock/device/default-device.png';
                event.target.onerror = null;
              }}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        )}
      </Card>

      <CustomPopover
        open={editPopover.open}
        anchorEl={editPopover.anchorEl}
        onClose={editPopover.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              editPopover.onClose();
              router.push(paths.dashboard.device.edit(device.id));
            }}
          >
            <BiSolidPencil />
            {t_common('button.edit')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              editPopover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <MdDelete />
            {t_common('button.delete')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
      {openNetworkDialog && <DeviceNetworkSettings open={openNetworkDialog} onClose={() => setOpenNetworkDialog(false)} device={device} />}
      {openInterfaceDialog && <DeviceInterfacekSettings open={openInterfaceDialog} onClose={() => setOpenInterfaceDialog(false)} device={device} />}
      {openSecurityDialog && <DeviceSecuritySettings open={openSecurityDialog} onClose={() => setOpenSecurityDialog(false)} device={device} />}
      <DeviceSetSettings open={openSetSettingsDialog} onClose={() => setOpenSetSettingsDialog(false)} id={device.id} />

      <CustomPopover
        open={settingPopover.open}
        anchorEl={settingPopover.anchorEl}
        onClose={settingPopover.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              settingPopover.onClose();
              setOpenNetworkDialog(true);
            }}
          >
            {t_device('button.networkSettings')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              settingPopover.onClose();
              setOpenInterfaceDialog(true);
            }}
          >
            {t_device('button.interfaceSettings')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              settingPopover.onClose();
              setOpenSecurityDialog(true);
            }}
          >
            {t_device('button.securitySettings')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              settingPopover.onClose();
              setOpenSetSettingsDialog(true);
            }}
          >
            {t_device('button.setSettings')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
      {openChangeGroupDialog && <DeviceChangeGroup open={openChangeGroupDialog} onClose={() => setOpenChangeGroupDialog(false)} device={device} />}
      {openDoorStatusDialog && <DeviceDoorStatus open={openDoorStatusDialog} onClose={() => setOpenDoorStatusDialog(false)} device={device} />}
      <CustomPopover
        open={commandPopover.open}
        anchorEl={commandPopover.anchorEl}
        onClose={commandPopover.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuItem
          onClick={() => {
            commandPopover.onClose();
            setOpenChangeGroupDialog(true);
          }}
        >
          {t_device('button.changeDeviceGroup')}
        </MenuItem>
        <MenuList>
          <MenuItem
            onClick={() => {
              commandPopover.onClose();
              setOpenDoorStatusDialog(true);
            }}
          >
            {t_device('button.setDeviceDoorStatus')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              commandPopover.onClose();
              setMaintenanceModeConfirm.onTrue();
            }}
          >
            {t_device('button.setMaintenanceMode')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              commandPopover.onClose();
              syncDeviceGroupConfirm.onTrue();
            }}
          >
            {t_device('button.syncDeviceWithAccessGroup')}
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t_common('button.delete')}
        content={t_common('commonTexts.deleteConfirm')}
        action={
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? t_common('button.deleteLoading') : t_common('button.delete')}
          </Button>
        }
      />
      <ConfirmDialog
        open={setMaintenanceModeConfirm.value}
        onClose={setMaintenanceModeConfirm.onFalse}
        title={t_device('button.setMaintenanceMode')}
        content={!device.maintenanceMode ? t_device('texts.setMaintenanceModeTrue') : t_device('texts.setMaintenanceModeFalse')}
        action={
          <Button variant="contained" color='success' onClick={handleMaintenanceMode} disabled={maintenaceModeLoading}>
            {maintenaceModeLoading ? t_device('button.changeDeviceMaintenanceModeLoading') : t_device('button.changeDeviceMaintenanceMode')}
          </Button>
        }
      />
      <ConfirmDialog
        open={syncDeviceGroupConfirm.value}
        onClose={syncDeviceGroupConfirm.onFalse}
        title={t_device('button.syncDeviceWithAccessGroup')}
        content={device.isSyncWithAccessGroupUsers ? t_device('texts.alreadySynced') : t_device('texts.syncDeviceWithAccessGroup')}
        action={
          <Button variant="contained" color='success' onClick={handleSyncDevicesGroup} disabled={syncDeviceGroupLoading || device.isSyncWithAccessGroupUsers}>
            {syncDeviceGroupLoading ? t_device('button.syncing') : t_device('button.syncDeviceWithAccessGroup')}
          </Button>
        }
      />

    </>
  );
}
