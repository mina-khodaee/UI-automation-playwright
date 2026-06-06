'use client';

import { mergeClasses } from 'minimal-shared/utils';
import Box, { BoxProps } from '@mui/material/Box';
import { iconifyClasses } from './classes';

export interface IconifyLocalProps extends BoxProps {
  width?: number | string; // to allow both
  className?: string;
}

export const IconifyLocal = ({ 
  className, 
  width = 25, 
  sx, 
  children, 
  ...other 
}: IconifyLocalProps) => (
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