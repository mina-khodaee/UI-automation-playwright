'use client';

import { merge } from 'es-toolkit';
import { useConfig } from '@repo/ui/config';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

import { AuthSplitSection } from './section';
import { AuthSplitContent } from './content';
import { SettingsButton } from '../components/settings-button';
import { MainSection, LayoutSection, HeaderSection } from '../core';

// ----------------------------------------------------------------------

export function AuthSplitLayout({ sx, cssVars, children, slotProps, layoutQuery = 'md' }) {
  const config = useConfig();
  const renderFooter = () => null;

  const renderMain = () => (
    <MainSection
      {...slotProps?.main}
      sx={[
        (theme) => ({ [theme.breakpoints.up(layoutQuery)]: { flexDirection: 'row' } }),
        ...(Array.isArray(slotProps?.main?.sx) ? slotProps.main.sx : [slotProps?.main?.sx]),
      ]}
    >
      <AuthSplitSection
        layoutQuery={layoutQuery}
        method={config?.auth?.method}
        {...slotProps?.section}
        methods={[]}
      />
      <AuthSplitContent layoutQuery={layoutQuery} {...slotProps?.content}>
        {children}
      </AuthSplitContent>
    </MainSection>
  );

  return (
    <LayoutSection
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px', ...cssVars }}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
