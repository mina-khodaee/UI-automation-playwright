'use client';

import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Box,
  Button,
} from '@mui/material';

export function AppointmentDetailsView({ open, onClose, rowData }) {
  if (!rowData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>جزئیات قرار ملاقات</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Visitor Info */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" color="text.secondary">
              بازدیدکننده:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {rowData.visitor?.fullName}
            </Typography>
          </Grid>

          {/* Host Info */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              میزبان:
            </Typography>
            <Typography variant="body1">{rowData.host?.fullName}</Typography>
          </Grid>

          {/* Reason */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              دلیل بازدید:
            </Typography>
            <Typography variant="body1">{rowData.visitReason?.name}</Typography>
          </Grid>

          {/* Card Info */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              شماره کارت:
            </Typography>
            <Typography variant="body1">
              {rowData.visitorCard?.cardNumber} ({rowData.visitorCard?.cardType})
            </Typography>
          </Grid>

          {/* Counts */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              تعداد همراهان / اقلام:
            </Typography>
            <Typography variant="body1">
              {rowData.companionCount} همراه / {rowData.visitorItemCount} قلم
            </Typography>
          </Grid>

          {/* Note */}
          <Grid size={{ xs: 12}}>
            <Typography variant="subtitle2" color="text.secondary">
              توضیحات:
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {rowData.note || 'بدون توضیحات'}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>بستن</Button>
      </DialogActions>
    </Dialog>
  );
}

AppointmentDetailsView.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  rowData: PropTypes.object,
};
