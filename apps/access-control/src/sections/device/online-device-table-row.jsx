import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export function OnlineDeviceTableRow({ row, selected, onSelectRow }) {

  return (
    <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1} onClick={onSelectRow}>
      <TableCell>
        {row.brand}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.terminalIP}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.terminalID}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.terminalMacAddress}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row?.port || '-'}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row?.serialNumber || '-'}
      </TableCell>
    </TableRow>

  );
}
