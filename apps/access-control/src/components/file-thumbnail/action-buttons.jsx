import { varAlpha } from 'minimal-shared/utils';
import { RiFolderCloseLine } from "react-icons/ri";
import { IoArrowDownCircle } from "react-icons/io5";
import { IconifyLocal } from '@repo/ui/iconify-local';

import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';


// ----------------------------------------------------------------------

export function DownloadButton({ sx, ...other }) {
  return (
    <ButtonBase
      sx={[
        (theme) => ({
          p: 0,
          top: 0,
          right: 0,
          width: 1,
          height: 1,
          zIndex: 9,
          opacity: 0,
          position: 'absolute',
          color: 'common.white',
          borderRadius: 'inherit',
          transition: theme.transitions.create(['opacity']),
          '&:hover': {
            ...theme.mixins.bgBlur({
              color: varAlpha(theme.vars.palette.grey['900Channel'], 0.64),
            }),
            opacity: 1,
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <IconifyLocal width={24} >
        <IoArrowDownCircle />
      </IconifyLocal>
    </ButtonBase>
  );
}

// ----------------------------------------------------------------------

export function RemoveButton({ sx, ...other }) {
  return (
    <IconButton
      size="small"
      sx={[
        (theme) => ({
          p: 0.35,
          top: 4,
          right: 4,
          position: 'absolute',
          color: 'common.white',
          bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.48),
          '&:hover': { bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.72) },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <IconifyLocal width={12} >
        <RiFolderCloseLine />
      </IconifyLocal>
    </IconButton>
  );
}
