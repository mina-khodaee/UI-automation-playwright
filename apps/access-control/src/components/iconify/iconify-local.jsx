
import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

import { iconifyClasses } from './classes';

// ----------------------------------------------------------------------

export const IconifyLocal = ({ className, width = 25, sx, children, ...other }) => (
  <Box
    component="span"
    className={mergeClasses([iconifyClasses.root, className])}
    sx={[
      {
        width,
        flexShrink: 0,
        display: 'inline-flex',
        justifySelf: 'center'
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    {...other}
  >
    {children}
  </Box>
);
