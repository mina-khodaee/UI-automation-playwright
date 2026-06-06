'use client';

import { useState, useCallback } from 'react';
import { IconifyLocal } from '@repo/ui/iconify-local';
import { RiFullscreenLine, RiFullscreenExitLine } from "react-icons/ri";

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { useTranslate } from 'src/locales';


// ----------------------------------------------------------------------

export function FullScreenButton() {
  const { t } = useTranslate('navbar');
  const [fullscreen, setFullscreen] = useState(false);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  return (
    <Tooltip title={fullscreen ? t('sidebar.exit') : t('sidebar.fullscreen')}>
      <IconButton onClick={handleToggleFullscreen} color={fullscreen ? 'primary' : 'default'}>
        <IconifyLocal>
          {
            fullscreen
              ? <RiFullscreenExitLine />
              : <RiFullscreenLine />
          }
        </IconifyLocal>
      </IconButton>
    </Tooltip>
  );
}
