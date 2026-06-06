import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { useTranslate } from 'src/locales';

import { EmptyContent } from '../empty-content';

// ----------------------------------------------------------------------

export function TableNoData({ notFound, sx }) {
  const {t} = useTranslate();
  return (
    <TableRow>
      {notFound ? (
        <TableCell colSpan={12}>
          <EmptyContent title={t('commonTexts.noData')} filled sx={[{ py: 10 }, ...(Array.isArray(sx) ? sx : [sx])]} />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
