import Stack from '@mui/material/Stack';

import { useTranslate } from 'src/locales';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellUserType({ params }) {
  const { currentLang } = useTranslate();
  const userType = params.row.original.aclUser?.userType;
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      {userType?.displayValues?.[currentLang?.value] ?? userType?.value ?? '-'}
    </Stack>
  );
}

export function RenderCellAuthorization({ params }) {
  const { t } = useTranslate('report');
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>

      <Label variant="soft" color={params.row.original.isAuthorized ? 'success' : 'error'} sx={{ display: 'flex', flexDirection: 'column' }}>
        {params.row.original.isAuthorized ? t('columns.authorized') : t('columns.unauthorized')}
      </Label>

    </Stack>
  );
}
