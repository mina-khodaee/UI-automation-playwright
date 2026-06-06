import { MdDelete } from 'react-icons/md';
import { BiSolidPencil } from 'react-icons/bi';
import { IconifyLocal } from '@repo/ui/iconify-local';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Box, IconButton, Tooltip } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';


// ----------------------------------------------------------------------

export function APIKeyTableRow({ row, onDeleteRow, onEditRow }) {
  const { t: t_common } = useTranslate();
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.name}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{row.applicationUser.fullName || row.applicationUser.userName}</TableCell>
        <TableCell sx={{
          textAlign: 'center',
          maxWidth: 320,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}><Tooltip title={row?.scopes.join(', ') || ''} arrow>
            <Box
              sx={{
                maxWidth: '100%',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              {row.scopes.join(', ')}
            </Box>
          </Tooltip>
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
              {row?.description || '-'}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          {fDateTime(row.expirationDate)}
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{fDateTime(row.createdAt)}</TableCell>
        <TableCell sx={{ textAlign: 'center' }}>
          <Stack direction="row" alignItems="center">
            <Tooltip title={t_common('button.edit')} placement="top" arrow>
              <IconButton
                onClick={onEditRow}
              >
                <IconifyLocal><BiSolidPencil /></IconifyLocal>
              </IconButton>
            </Tooltip>
            <Tooltip title={t_common('button.delete')} placement="top" arrow>
              <IconButton onClick={onDeleteRow} sx={{ color: 'error.main' }}>
                <IconifyLocal><MdDelete /></IconifyLocal>
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}
