'use client';

import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from  '../../locales';
import { SimpleLayout } from '../../layouts/simple/index';
import { PageNotFoundIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export function NotFoundView() {
  const { t } = useTranslate();
  return (
    <SimpleLayout
    slotProps={{
      content: { compact: true },
    }}
  >
     <Container component={MotionContainer}>
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            {t('commonTexts.notFoundPage')}
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
          {t('commonTexts.notFoundText')}
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <PageNotFoundIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
        {t('button.goToHome')}
        </Button>
      </Container>
    </SimpleLayout>
  );
}
