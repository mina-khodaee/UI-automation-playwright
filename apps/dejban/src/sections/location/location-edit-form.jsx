import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Form, Field } from 'src/components/hook-form';

const EditLocationDialog = ({
  open,
  onClose,
  selectedItem,
  onSubmit,
  isSubmitting = false,
}) => {
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      enName: '',
      latitude: '',
      longitude: '',
      phoneCode: '',
      twoLetterCountryCode: '',
      twoLetterLanguageCode: '',
    },
  });

  const { reset } = methods;


  useEffect(() => {
    if (open && selectedItem?.data) {
      const { data } = selectedItem;

      reset({
        name: data.name || '',
        enName: data.enName || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        phoneCode: data.phoneCode || '',
        twoLetterCountryCode:
          selectedItem.type === 'country'
            ? data.twoLetterCountryCode || ''
            : '',
        twoLetterLanguageCode:
          selectedItem.type === 'country'
            ? data.twoLetterLanguageCode || ''
            : '',
      });
    }
  }, [open, selectedItem, reset]);


  useEffect(() => {
    if (!open) {
      reset({
        name: '',
        enName: '',
        latitude: '',
        longitude: '',
        phoneCode: '',
        twoLetterCountryCode: '',
        twoLetterLanguageCode: '',
      });
    }
  }, [open, reset]);

  const renderEditForm = () => {
    if (!selectedItem) return null;

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

    switch (selectedItem.type) {
      case 'country':
        return (
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

      case 'province':
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
              color="text.secondary"
              sx={{ gridColumn: 'span 4' }}
            >
              کشور والد: {selectedItem.parentLabel || 'نامشخص'}
            </Typography>
          </>
        );

      case 'city':
        return (
          <>
            {commonFields}
            {coordinateFields}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ gridColumn: 'span 4' }}
            >
              استان والد: {selectedItem.parentLabel || 'نامشخص'}
            </Typography>
          </>
        );

      default:
        return commonFields;
    }
  };

  const getDialogTitle = () => {
    if (!selectedItem) return 'ویرایش';

    const typeLabels = {
      country: 'کشور',
      province: 'استان',
      city: 'شهر',
    };

    return `ویرایش ${typeLabels[selectedItem.type]} ${selectedItem.label}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>

      <DialogContent>
        <Form
          methods={methods}
          onSubmit={methods.handleSubmit(async (data) => {
            try {
              await onSubmit(data, selectedItem);
              onClose();
              reset();
            } catch (error) {
              console.error(error);
            }
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
            {renderEditForm()}
          </Box>

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>انصراف</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLocationDialog;
