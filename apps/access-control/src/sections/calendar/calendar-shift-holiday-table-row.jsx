import { MdDelete } from 'react-icons/md';
import { TbCancel } from 'react-icons/tb';
import { BsCheckCircleFill } from 'react-icons/bs';

import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';


// ----------------------------------------------------------------------

export function ShiftTableRow({ row, onDeleteRow }) {
  const { t } = useTranslate();
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell sx={{ textAlign: 'center' }}>
          {row?.shiftNumber}
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          {row?.hasBreak ? (
            <Box sx={{ color: 'success.main', fontSize: 20, alignItems: 'center' }}>
              <BsCheckCircleFill />
            </Box>
          ) : (
            <Box sx={{ color: 'error.main', fontSize: 20, alignItems: 'center' }}>
              <TbCancel />
            </Box>
          )}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {row?.startTime}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {row?.endTime}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {row?.breakStart || '-'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {row?.breakEnd || '-'}
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <Stack direction="row" alignItems="center">
            <Tooltip title={t('button.delete')} placement="top" arrow>
              <IconButton onClick={onDeleteRow} sx={{ color: 'error.main' }}>
                <MdDelete/>
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow >
    </>
  );
}
export function HolidayTableRow({ row, onDeleteRow }) {
  const { t } = useTranslate();
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell sx={{ textAlign: 'center' }}>
          {row?.name}
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          {fDate(row?.date)}
        </TableCell>
        <TableCell sx={{
          textAlign: 'center',
          maxWidth: 320,
          overflow: 'hidden', 
          whiteSpace: 'nowrap', 
          textOverflow: 'ellipsis',
        }}>
          <Tooltip title={row?.description || ''} arrow>
            <Box
              sx={{
                maxWidth: '100%',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              {row?.description}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <Stack direction="row" alignItems="center">
            <Tooltip title={t('button.delete')} placement="top" arrow>
              <IconButton onClick={onDeleteRow} sx={{ color: 'error.main' }}>
                <MdDelete />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow >
    </>
  );
}
