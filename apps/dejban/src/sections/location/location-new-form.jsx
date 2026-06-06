'use client';

import React, { useMemo, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Form, Field } from 'src/components/hook-form';

const AddLocationDialog = ({
  open,
  onClose,
  mode,
  selectedItem,
  onSubmit,
  isSubmitting = false,
}) => {

  const defaultValues = useMemo(
    () => ({
      name: '',
      enName: '',
      latitude: '',
      longitude: '',
      phoneCode: '',
      twoLetterCountryCode: '',
      twoLetterLanguageCode: '',
    }),
    []
  );

  const methods = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const { reset } = methods;


  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open, reset, defaultValues]);

  const renderDialogForm = () => {
    const commonFields = (
      <>
        <Field.Text
          name="name"
          label="نام فارسی"
          required
          sx={{ gridColumn: 'span 2' }}
        />
        <Field.Text
          name="enName"
          label="نام انگلیسی"
          sx={{ gridColumn: 'span 2' }}
        />
      </>
    );

    const coordinateFields = (
      <>
        <Field.Text
          name="latitude"
          label="عرض جغرافیایی"
          sx={{ gridColumn: 'span 2' }}
        />
        <Field.Text
          name="longitude"
          label="طول جغرافیایی"
          sx={{ gridColumn: 'span 2' }}
        />
      </>
    );

    const countryFields = (
      <>
        {commonFields}
        <Field.Text
          name="phoneCode"
          label="کد تلفن"
          sx={{ gridColumn: 'span 1' }}
        />
        <Field.Text
          name="twoLetterCountryCode"
          label="کد کشور (دو حرفی)"
          sx={{ gridColumn: 'span 1' }}
        />
        <Field.Text
          name="twoLetterLanguageCode"
          label="کد زبان (دو حرفی)"
          sx={{ gridColumn: 'span 2' }}
        />
      </>
    );

    switch (mode) {
      case 'addCountry':
        return countryFields;

      case 'addProvince':
        return (
          <>
            {commonFields}
            {coordinateFields}
            <Field.Text
              name="phoneCode"
              label="کد تلفن استان"
              sx={{ gridColumn: 'span 2' }}
            />
            <Typography
              variant="body2"
              color="primary"
              sx={{ gridColumn: 'span 4' }}
            >
              کشور والد: {selectedItem?.label}
            </Typography>
          </>
        );

      case 'addCity':
        return (
          <>
            {commonFields}
            {coordinateFields}
            <Typography
              variant="body2"
              color="primary"
              sx={{ gridColumn: 'span 4' }}
            >
              استان والد: {selectedItem?.label}
            </Typography>
          </>
        );

      default:
        return commonFields;
    }
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'addCountry':
        return 'افزودن کشور جدید';
      case 'addProvince':
        return `افزودن استان جدید به ${selectedItem?.label}`;
      case 'addCity':
        return `افزودن شهر جدید به ${selectedItem?.label}`;
      default:
        return 'افزودن مکان جدید';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>

      <DialogContent>
        <Form
          methods={methods}
          onSubmit={methods.handleSubmit(async (data) => {
            await onSubmit(data, mode, selectedItem);
            onClose();
            reset(defaultValues);
          })}
        >

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 2,
              mt: 1,
            }}
          >
            {renderDialogForm()}
          </Box>

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>انصراف</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'در حال ذخیره...' : 'ذخیره'}
            </Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationDialog;
