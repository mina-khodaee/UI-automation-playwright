
import { MdDelete } from 'react-icons/md';
import { IoMdMore } from 'react-icons/io';
import { useBoolean } from 'minimal-shared';
import { RiCommandLine } from 'react-icons/ri';
import { BiSolidPencil } from 'react-icons/bi';
import { usePopover } from 'minimal-shared/hooks';
import { BsCheckCircleFill } from 'react-icons/bs';
import { IoAnalyticsSharp } from "react-icons/io5";
import { IconifyLocal } from '@repo/ui/iconify-local';
import { TbCancel, TbListDetails } from 'react-icons/tb';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Avatar, Box, MenuItem, MenuList, SvgIcon } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover } from 'src/components/custom-popover';
import { Lightbox, useLightBox } from 'src/components/lightbox';

// ----------------------------------------------------------------------

export function DeviceTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onSyncDeviceGroup, onSecurityDialog, onSetOpenChangeGroupDialog,
  onSetSettingsDialog, onInterfaceDialog, onNetworkDialog, onView, onGetBiometric, onSendBiometric
}) {
  const router = useRouter();
  const confirm = useBoolean();
  const { t: t_common } = useTranslate();
  const { t: t_device } = useTranslate('device');
  const editPopover = usePopover();
  const settingPopover = usePopover();
  const commandPopover = usePopover();
  const lightbox = useLightBox(['/assets/images/mock/device/default-device.png']);
  const handleImageClick = () => {
    lightbox.onOpen();
  };
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={String(row.id)} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" sx={{ py: 2, width: 1 }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Label
                color={row?.isOnline ? 'success' : 'error'}
                variant="filled"
                sx={{
                  position: 'absolute',
                  top: -14,
                  left: '10%',
                  transform: 'translateX(-50%)',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 12,
                  minHeight: 12,
                }}
              />
              <Tooltip
                title={row?.isOnline ? t_device('filters.online') : t_device('filters.offline')}
                placement="top"
              >
                <Avatar
                  alt={row?.deviceType.brand}
                  src="/assets/images/mock/device/default-device1.png"
                  variant="rounded"
                  sx={{ width: 64, height: 64, cursor: 'pointer' }}
                  onClick={handleImageClick}
                />
              </Tooltip>
            </Box>
          </Stack>
          <Lightbox
            slides={[{ src: '/assets/images/mock/device/default-device1.png' }]}
            open={lightbox.open}
            close={lightbox.onClose}
            index={lightbox.selected}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Box component={RouterLink} href={paths.dashboard.device.details(row?.id)} sx={{ display: 'block', color: 'text.primary' }}>
            <Box>{row?.deviceType.brand}</Box>
            <Box>{row?.deviceType.model}</Box>
          </Box>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row?.terminalId}{row?.serialNumber}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}> {row?.accessGroup?.name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}> {row.usersLastSync ? fDateTime(row?.usersLastSync) : '-'}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          {(() => {
            switch (row?.syncUsersStatus) {
              case 'NotInitialized':
                return <Label color="info">{t_device('filters.notInitialized')}</Label>;
              case 'Syncing':
                return <Label color="warning">{t_device('filters.syncing')}</Label>;
              case 'SyncFailed':
                return <Label color="error">{t_device('filters.syncFailed')}</Label>;
              default:
                return <Label color="success">{t_device('filters.synced')}</Label>;
            }
          })()}
        </TableCell>

        <TableCell sx={{ textAlign: 'center' }}>
          {row?.isSyncWithAccessGroupUsers ? <Box sx={{ color: 'success.main', fontSize: 20, alignItems: 'center' }}>
            <BsCheckCircleFill />
          </Box> : <Box sx={{ color: 'error.main', fontSize: 20, alignItems: 'center' }}>
            <TbCancel />
          </Box>}
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <Box display="flex" sx={{ mx: 0, p: 0 }}>
            <IconButton
              color={commandPopover.open ? 'inherit' : 'default'}
              onClick={commandPopover.onOpen}
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <Tooltip title={t_device('button.commands')} arrow>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconifyLocal>
                    <RiCommandLine size={24} />
                  </IconifyLocal>
                </Box>
              </Tooltip>

            </IconButton>
            <IconButton
              color={settingPopover.open ? 'inherit' : 'default'}
              onClick={settingPopover.onOpen}
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <Tooltip title={t_common('button.settings')} arrow>
                <IconifyLocal>
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
                </IconifyLocal>
              </Tooltip>
            </IconButton>
            <IconButton
              color={editPopover.open ? 'inherit' : 'default'}
              onClick={editPopover.onOpen}
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <Tooltip title={t_common('button.more')} arrow>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconifyLocal>
                    <IoMdMore />
                  </IconifyLocal>
                </Box>
              </Tooltip>
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t_common('button.delete')}
        content={t_common('commonTexts.deleteConfirm')}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {t_common('button.delete')}
          </Button>
        }
      />

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
              onEditRow();
            }}
          >
            <IconifyLocal>
              <BiSolidPencil size={18} />
            </IconifyLocal>
            {t_common('button.edit')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              editPopover.onClose();
              onView();
            }}
          >
            <IconifyLocal><TbListDetails size={18} /></IconifyLocal>
            {t_common('button.details')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDeleteRow();
              editPopover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <IconifyLocal>
              <MdDelete size={18} />
            </IconifyLocal>
            {t_common('button.delete')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              editPopover.onClose();
              router.push(paths.dashboard.trafficReport.root, {
                deviceId: row.id,
              });
            }}
          >
            <IconifyLocal>
              <IoAnalyticsSharp size={18} />
            </IconifyLocal>
            {t_device('button.showDeviceReports')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
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
              onNetworkDialog();
            }}
          >
            {t_device('button.networkSettings')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              settingPopover.onClose();
              onInterfaceDialog();
            }}
          >
            {t_device('button.interfaceSettings')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              settingPopover.onClose();
              onSecurityDialog();
            }}
          >
            {t_device('button.securitySettings')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              settingPopover.onClose();
              onSetSettingsDialog();
            }}
          >
            {t_device('button.setSettings')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
      <CustomPopover
        open={commandPopover.open}
        anchorEl={commandPopover.anchorEl}
        onClose={commandPopover.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuItem
          onClick={() => {
            commandPopover.onClose();
            onSetOpenChangeGroupDialog();
          }}
        >
          {t_device('button.changeDeviceGroup')}
        </MenuItem>
        <MenuList>
          <MenuItem
            onClick={() => {
              commandPopover.onClose();
              onSyncDeviceGroup();
            }}
          >
            {t_device('button.syncDeviceWithAccessGroup')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              commandPopover.onClose();
              onGetBiometric();
            }}
          >
            {t_device('button.getBiometricDataFromDevice')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              commandPopover.onClose();
              onSendBiometric();
            }}
          >
            {t_device('button.sendBiometricDataToDevice')}
          </MenuItem>
        </MenuList>
      </CustomPopover>

    </>
  );
}
