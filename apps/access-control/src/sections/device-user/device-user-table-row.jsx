import { MdDelete } from 'react-icons/md';
import { IoMdMore } from 'react-icons/io';
import { BiSolidPencil } from 'react-icons/bi';
import { TbListDetails } from 'react-icons/tb';
import { usePopover } from 'minimal-shared/hooks';
import { IconifyLocal } from '@repo/ui/iconify-local';
import { IoAnalyticsSharp, IoFingerPrint } from 'react-icons/io5';

import { Box, IconButton, MenuItem, MenuList, Tooltip } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function RenderCellActions({ params, onDelete, onDetails, onEdit, onEditConfigureType, onEditAccessGroup, onSendBiometric, onGetBiometric }) {
  const router = useRouter();
  const morePopover = usePopover();
  const quickEditPopover = usePopover();
  const { t: t_common } = useTranslate();
  const { t: t_user } = useTranslate('user');
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', justifyItems: 'center' }}>
        <IconButton
          color={quickEditPopover.open ? 'inherit' : 'default'}
          onClick={quickEditPopover.onOpen}
          sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
        >
          <Tooltip title={t_common('button.quickEdit')} arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 20, justifyContent: 'center' }}>
              <IconifyLocal>
                <BiSolidPencil />
              </IconifyLocal>
            </Box>
          </Tooltip>
        </IconButton>
        <IconButton
          color={morePopover.open ? 'inherit' : 'default'}
          onClick={morePopover.onOpen}
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
      <CustomPopover
        open={morePopover.open}
        anchorEl={morePopover.anchorEl}
        onClose={morePopover.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              morePopover.onClose();
              onDetails(params.row.userID);
            }}
          >
            <IconifyLocal>
              <TbListDetails size={18} />
            </IconifyLocal>
            {t_common('button.details')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              morePopover.onClose();
              onEdit(params.row.userID);
            }}
          >
            <IconifyLocal>
              <BiSolidPencil size={18} />
            </IconifyLocal>
            {t_common('button.edit')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              morePopover.onClose();
              onDelete();
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
              morePopover.onClose();
              router.push(paths.dashboard.trafficReport.root, {
                userId: params.row.userID,
              });
            }}
          >
            <IconifyLocal>
              <IoAnalyticsSharp size={18} />
            </IconifyLocal>
            {t_user('buttons.userReports')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              morePopover.onClose();
              onSendBiometric();
            }}
          >
            <IconifyLocal>
              <IoFingerPrint size={18} />
            </IconifyLocal>
            {t_user('buttons.sendUserBiometricDataToDevices')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              morePopover.onClose();
              onGetBiometric();
            }}
          >
            <IconifyLocal>
              <IoFingerPrint size={18} />
            </IconifyLocal>
            {t_user('buttons.getUserBiometricDataFromDevice')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
      <CustomPopover
        open={quickEditPopover.open}
        anchorEl={quickEditPopover.anchorEl}
        onClose={quickEditPopover.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              quickEditPopover.onClose();
              onEditConfigureType();
            }}
          >
            {t_user('buttons.editConfigureType')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              quickEditPopover.onClose();
              onEditAccessGroup();
            }}
          >
            {t_user('buttons.editAccessGroups')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
