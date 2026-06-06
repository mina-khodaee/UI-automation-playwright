
import { BiSolidPencil } from 'react-icons/bi';
import { MdArrowBackIosNew } from 'react-icons/md';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export function DeviceUserDetailToolbar({
  backLink,
  editLink,
  sx,
  ...other
}) {
  const { t } = useTranslate();

  return (
    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{ mb: { xs: 3, md: 5 } }} {...other}>
      <Stack spacing={1} direction="row" alignItems="flex-start">
        <Button
          component={RouterLink}
          href={backLink}

          startIcon={<MdArrowBackIosNew width={16} />}
        >
          {t('button.back')}
        </Button>
      </Stack>

      <Stack
        flexGrow={1}
        spacing={1.5}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button color="inherit" component={RouterLink}
          href={editLink}
          variant="contained" startIcon={<BiSolidPencil />}>
          {t('button.edit')}
        </Button>
      </Stack>
    </Stack>
  );
}
