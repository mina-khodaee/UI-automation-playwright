'use client'

import Box from '@mui/material/Box';
import { Field } from 'src/components/hook-form';
import { PLATE_LETTERS } from './constants';

const VehiclePlateInput = ({ activeStep }) => {
  if (activeStep === 2) {
    return (
      <Box sx={{ gridColumn: { sm: 'span 2' } }}>
        <Field.Text
          name="customPlateInput"
          label="شماره پلاک"
          size="small"
          placeholder=" _   _   _   _   _"
          fullWidth
          sx={{ mt: 3 }}
        />
      </Box>
    );
  }

  if (activeStep === 3) {
    return (
      <Box sx={{
        gridColumn: { sm: 'span 2' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 0.5,
        px: 1,
        border: '1px solid #333',
        borderRadius: 1,
        backgroundColor: '#fff',
        direction: 'rtl',
        gap: 0.5,
        width: '100%',
        maxWidth: '100px'
      }}>
        <Field.Text
          name="motorPlateTop"
          size='small'
          sx={{ width: '110%', textAlign: 'center', '& .MuiInputBase-input': { py: 0.5, height: '1.5em' } }}
          placeholder=" _   _   _ "
          inputProps={{ maxLength: 3, style: { textAlign: 'center', fontSize: '1.2rem' } }}
          onInput={(e) => { if (e.target.value.length > 3) e.target.value = e.target.value.slice(0, 3); }}
        />
        <Box sx={{ width: '100%', height: '1px', backgroundColor: '#333' }} />
        <Field.Text
          name="motorPlateBottom"
          size='small'
          sx={{ width: '110%', textAlign: 'center', '& .MuiInputBase-input': { py: 0.5, height: '1.5em' } }}
          placeholder=" _  _  _  _  _ "
          inputProps={{ maxLength: 5, style: { textAlign: 'center', fontSize: '1.2rem' } }}
          onInput={(e) => { if (e.target.value.length > 5) e.target.value = e.target.value.slice(0, 5); }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{
      gridColumn: { sm: 'span 2' },
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      py: 0.5,
      px: 1,
      border: '1px solid #333',
      borderRadius: 1,
      backgroundColor: '#fff',
      direction: 'rtl',
      gap: 0.5,
      width: '100%',
      maxWidth: '400px'
    }}>
      <Field.Text
        name="plateTwoDigits"
        size='small'
        placeholder=" _  _"
        sx={{
          width: '18%',
          textAlign: 'center',
          '& input::placeholder': {
            color: '#999',
            opacity: 0.7
          }
        }}
        inputProps={{ maxLength: 2, style: { textAlign: 'center', fontSize: '1.2rem' } }}
        onInput={(e) => { if (e.target.value.length > 2) e.target.value = e.target.value.slice(0, 2); }}
      />
      <Field.Select
        name="plateLetters"
        data={PLATE_LETTERS}
        displayExp="label"
        valueExp="value"
        size='small'
        sx={{ width: '30%', textAlign: 'center', mt: 2.5 }}
      />
      <Field.Text
        name="plateThreeDigits"
        size='small'
        placeholder="_ _ _"
        sx={{
          width: '18%',
          textAlign: 'center',
          '& input::placeholder': {
            color: '#999',
            opacity: 0.7
          }
        }}
        inputProps={{ maxLength: 3, style: { textAlign: 'center', fontSize: '1.2rem' } }}
        onInput={(e) => { if (e.target.value.length > 3) e.target.value = e.target.value.slice(0, 3); }}
      />
      <Box sx={{ width: '2px', height: '30px', backgroundColor: '#333' }} />
      <Field.Text
        name="plateCode"
        size='small'
        placeholder="ایران"
        sx={{
          width: '18%',
          textAlign: 'center',
          '& input::placeholder': {
            color: '#999',
            opacity: 0.7
          }
        }}
        inputProps={{
          maxLength: 2,
          style: { textAlign: 'center', fontSize: '1.2rem' }
        }}
        onInput={(e) => {
          if (e.target.value.length > 2)
            e.target.value = e.target.value.slice(0, 2);
        }}
      />
    </Box>
  );
};

export default VehiclePlateInput;