'use client';

import { useServerInsertedHTML } from 'next/navigation';
import { themeConfig } from '@repo/ui/theme';

export function ColorSchemeInit() {
  useServerInsertedHTML(() => {
    const { modeStorageKey, cssVariables, defaultMode } = themeConfig;
    const attribute = cssVariables.colorSchemeSelector;

    return (
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var m=localStorage.getItem('${modeStorageKey}')||'${defaultMode}';var d=localStorage.getItem('mui-color-scheme-dark')||'dark';var l=localStorage.getItem('mui-color-scheme-light')||'light';var c='';if(m==='system'){c=window.matchMedia('(prefers-color-scheme:dark)').matches?d:l}else if(m==='light'){c=l}else if(m==='dark'){c=d}if(c){document.documentElement.setAttribute('${attribute}',c)}}catch(e){}})();`,
        }}
      />
    );
  });

  return null;
}
