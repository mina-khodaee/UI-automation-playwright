'use client';

import { useMemo } from 'react';

import { CONFIG } from 'src/global-config';
import { useTranslate } from 'src/locales';
import { usePathname } from 'next/navigation';
import { DashboardLayout } from '@repo/ui/layouts-dashboard';

import { AuthGuard } from '@repo/ui/auth-guard';

import { navData } from 'src/layouts/nav-config-dashboard';
import { _account } from 'src/layouts/nav-config-account';

// ----------------------------------------------------------------------

function translateItem(item, t) {
  return {
    ...item,
    title: t(item.title),
    children: item.children ? item.children.map((child) => translateItem(child, t)) : undefined,
    caption: item.caption ? t(item.caption) : undefined,
  };
}

function NavWithTranslation({ children }) {
  const { t } = useTranslate('navbar');
  const pathname = usePathname();

  const translatedNavData = useMemo(
    () =>
      navData.map((group) => ({
        ...group,
        subheader: group.subheader ? t(group.subheader) : undefined,
        items: group.items.map((item) => translateItem(item, t)),
      })),
    [t]
  );

  return (
    <DashboardLayout pathname={pathname} slotProps={{ nav: { data: translatedNavData }, account: { data: _account } }}>{children}</DashboardLayout>
  );
}

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  if (CONFIG.auth.skip) {
    return <NavWithTranslation>{children}</NavWithTranslation>;
  }

  return (
    <AuthGuard>
      <NavWithTranslation>{children}</NavWithTranslation>
    </AuthGuard>
  );
}
