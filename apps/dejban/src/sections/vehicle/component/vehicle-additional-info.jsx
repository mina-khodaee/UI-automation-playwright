'use client'

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { Field } from 'src/components/hook-form';
import { FUEL_TYPES } from './constants';

const VehicleAdditionalInfo = () => {
  return (
    <Accordion
      sx={{ gridColumn: { sm: 'span 4' }, boxShadow: 0, border: '1px solid #ddd' }}
      defaultExpanded={false}
    >
      <AccordionSummary
        expandIcon={<GridExpandMoreIcon />}
        sx={{ minHeight: 48, '& .MuiAccordionSummary-content.Mui-expanded': { margin: '12px 0' } }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          اطلاعات تکمیلی
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Field.Text name="model" label='مدل' size='small' />
          <Field.Text name="color" label='رنگ' size='small' />
          <Field.Select
            name="fuelType"
            label='نوع سوخت'
            data={FUEL_TYPES}
            displayExp="label"
            valueExp="value"
            size='small'
          />
          <Box></Box>
          {/* <Field.Text name="chassisNumber" label='شماره شاسی' size='small' /> */}
          <Field.Text name="vinNumber" label='شماره vin' size='small' />
          <Field.Text name="engineNumber" label='شماره موتور' size='small' />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default VehicleAdditionalInfo;