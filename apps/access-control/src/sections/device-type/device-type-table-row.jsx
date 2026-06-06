import { TbCancel } from 'react-icons/tb';
import { MdDelete } from 'react-icons/md';
import { BiSolidPencil } from 'react-icons/bi';
import { BsCheckCircleFill } from 'react-icons/bs';

import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function DeviceTypeTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { t } = useTranslate();
  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={String(row.id)} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.brand}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.model}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.description ?? '-'}</TableCell>

        <TableCell sx={{ textAlign: 'center' }}>

          {row.usesTerminalId ? (
            <Box sx={{ color: 'success.main', fontSize: 20, alignItems: 'center' }}>
              <BsCheckCircleFill />
            </Box>
          ) : (
            <Box sx={{ color: 'error.main', fontSize: 20, alignItems: 'center' }}>
              <TbCancel />
            </Box>

          )}
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          {row.usesSerialNumber ? (
            <Box sx={{ color: 'success.main', fontSize: 20, alignItems: 'center' }}>
              <BsCheckCircleFill />
            </Box>
          ) : (
            <Box sx={{ color: 'error.main', fontSize: 20, alignItems: 'center' }}>
              <TbCancel />
            </Box>
          )}
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          {row.hasCamera ? (
            <Box sx={{ color: 'success.main', fontSize: 20, alignItems: 'center' }}>
              <BsCheckCircleFill />
            </Box>
          ) : (
            <Box sx={{ color: 'error.main', fontSize: 20, alignItems: 'center' }}>
              <TbCancel />
            </Box>
          )}
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <Stack direction="row" alignItems="center">
            <Tooltip title={t('button.edit')} placement="top" arrow>
              <IconButton
                onClick={onEditRow}
              >
                <BiSolidPencil />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('button.delete')} placement="top" arrow>
              <IconButton onClick={onDeleteRow} sx={{ color: 'error.main' }}>
                <MdDelete/>
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}
