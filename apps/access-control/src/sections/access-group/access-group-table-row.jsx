import { MdDelete } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import { TbCancel } from "react-icons/tb";
import { BiSolidPencil } from "react-icons/bi";
import { TbListDetails } from 'react-icons/tb';
import { IoFingerPrint } from "react-icons/io5";
import { usePopover } from "minimal-shared/hooks";
import { BsCheckCircleFill } from "react-icons/bs";
import { IconifyLocal } from '@repo/ui/iconify-local';

import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Box, MenuItem, MenuList } from "@mui/material";

import { useTranslate } from 'src/locales';

import { CustomPopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

export function AccessGroupTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onViewRow,onSendBiometric }) {
  const { t } = useTranslate();
  const { t: t_device } = useTranslate('device');
  const morePopover = usePopover();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={String(row.id)} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.aclCalendar.name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.description ?? '-'}</TableCell>

        <TableCell sx={{ textAlign: 'center' }}>
          {row.isDefault ? (
            <Box sx={{ color: 'success.main', fontSize: 20, alignItems: 'center' }}>
              <IconifyLocal><BsCheckCircleFill /></IconifyLocal>
            </Box>
          ) : (
            <Box sx={{ color: 'error.main', fontSize: 20, alignItems: 'center' }}>
              <IconifyLocal><TbCancel /></IconifyLocal>
            </Box>
          )}
        </TableCell>

        <TableCell sx={{ textAlign: 'center' }}>
          <Stack direction="row" alignItems="center">
            <IconButton
              color={morePopover.open ? 'inherit' : 'default'}
              onClick={morePopover.onOpen}
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <Tooltip title={t('button.more')} arrow>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconifyLocal>
                    <IoMdMore />
                  </IconifyLocal>
                </Box>
              </Tooltip>
            </IconButton>
            <Tooltip title={t('button.edit')} placement="top" arrow>
              <IconButton
                onClick={onEditRow}
              >
                <IconifyLocal><BiSolidPencil /></IconifyLocal>
              </IconButton>
            </Tooltip>
            <Tooltip title={t('button.delete')} placement="top" arrow>
              <IconButton onClick={onDeleteRow} sx={{ color: 'error.main' }}>
                <IconifyLocal><MdDelete /></IconifyLocal>
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
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
              onViewRow();
            }}
          >
            <IconifyLocal>
              <TbListDetails size={18}/>
            </IconifyLocal>
            {t('button.details')}
          </MenuItem>
          <MenuItem
            onClick={() => {
              morePopover.onClose();
              onSendBiometric();
            }}
          >
            <IconifyLocal>
              <IoFingerPrint size={18}/>
            </IconifyLocal>
            {t_device('button.sendBiometricDataToDevices')}
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
