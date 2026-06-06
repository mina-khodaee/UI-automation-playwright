// components/form-header.jsx
import { Box, Typography } from '@mui/material';

export function FormHeader({ title }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
    </Box>
  );
}