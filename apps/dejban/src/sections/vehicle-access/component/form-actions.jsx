// components/form-actions.jsx
import { Box, Button } from '@mui/material';

export function FormActions({ isSubmitting, isVehicleSelected, isEditing, onCancel }) {
  const t_vehicleAccess = {
    buttons: {
      update: 'بروزرسانی',
      submitAccess: 'ثبت تردد',
      cancel: 'انصراف',
    },
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="medium"
        disabled={isSubmitting || !isVehicleSelected}
      >
        {isSubmitting
          ? 'در حال ارسال...'
          : isEditing
            ? t_vehicleAccess.buttons.update
            : t_vehicleAccess.buttons.submitAccess}
      </Button>
      <Button variant="outlined" color="error" size="medium" onClick={onCancel}>
        {t_vehicleAccess.buttons.cancel}
      </Button>
    </Box>
  );
}