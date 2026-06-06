'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  MenuItem,
  TextField,
} from '@mui/material';
import { toast } from 'sonner';
import { Form, RHFTextField } from 'src/components/hook-form';
import { useTranslation } from 'react-i18next';

export function AmmunitionNewEditForm({
  currentAmmunition,
  open,
  onClose,
  setAmmunition,
  ammunition,
}) {
  const { t } = useTranslation('ammunition');

  // آپشن‌های نوع مهمات
  const typeOptions = useMemo(
    () => [
      { value: 'pistol', label: t('typeOptions.pistol'), color: '#2196f3' },
      { value: 'rifle', label: t('typeOptions.rifle'), color: '#4caf50' },
      { value: 'shotgun', label: t('typeOptions.shotgun'), color: '#ff9800' },
      { value: 'sniper', label: t('typeOptions.sniper'), color: '#9c27b0' },
      { value: 'machinegun', label: t('typeOptions.machinegun'), color: '#f44336' },
      { value: 'grenade', label: t('typeOptions.grenade'), color: '#795548' },
    ],
    [t]
  );

  const defaultValues = useMemo(
    () => ({
      name: currentAmmunition?.name || '',
      type: currentAmmunition?.type || 'pistol',
      quantity: currentAmmunition?.quantity ?? 0,
    }),
    [currentAmmunition]
  );

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const watchedQuantity = watch('quantity');

  // بررسی تکراری نبودن نام
  const isNameDuplicate = (name, excludeId) => {
    return ammunition.some((a) => a.name === name && a.id !== excludeId);
  };

  const validateForm = (data) => {
    if (!data.name?.trim()) {
      toast.error(t('formValidationErrors.name.required'));
      return false;
    }
    if (isNameDuplicate(data.name, currentAmmunition?.id)) {
      toast.error(t('formValidationErrors.name.duplicate'));
      return false;
    }
    if (!data.type) {
      toast.error(t('formValidationErrors.type.required'));
      return false;
    }
    if (data.quantity === undefined || data.quantity === null || data.quantity === '') {
      toast.error(t('formValidationErrors.quantity.required'));
      return false;
    }
    if (data.quantity < 0) {
      toast.error(t('formValidationErrors.quantity.min'));
      return false;
    }
    return true;
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!validateForm(data)) return;

    try {
      const payload = {
        name: data.name.trim(),
        type: data.type,
        quantity: Number(data.quantity),
        createdAt: new Date().toISOString(),
      };

      if (currentAmmunition) {
        setAmmunition((prev) =>
          prev.map((a) => (a.id === currentAmmunition.id ? { ...a, ...payload, id: a.id } : a))
        );
        toast.success(t('toastMessages.update'));
      } else {
        const newId = String(Date.now());
        setAmmunition((prev) => [{ id: newId, ...payload }, ...prev]);
        toast.success(t('toastMessages.create'));
      }

      onClose();
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'خطا رخ داد');
    }
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [currentAmmunition, open, reset, defaultValues]);

  useEffect(() => {
    if (!open) {
      reset({
        name: '',
        type: 'pistol',
        quantity: 0,
      });
    }
  }, [open, reset]);

  const getStockStatus = (quantity) => {
    if (quantity === 0)
      return {
        text: t('stockStatus.outOfStock'),
        color: '#f44336',
        bg: '#ffebee',
        border: '#f44336',
      };
    if (quantity < 500)
      return {
        text: t('stockStatus.lowStock'),
        color: '#ff9800',
        bg: '#fff3e0',
        border: '#ff9800',
      };
    return { text: t('stockStatus.inStock'), color: '#4caf50', bg: '#e8f5e9', border: '#4caf50' };
  };

  const stockStatus = getStockStatus(watchedQuantity);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">
        {currentAmmunition ? t('title.updateAmmunition') : t('title.insertAmmunition')}
      </DialogTitle>

      <DialogContent sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', p: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(1, 1fr)',
                  md: 'repeat(1, 1fr)',
                }}
                sx={{ mt: 1 }}
              >
                {/* Name - نام مهمات (اجباری) */}
                <RHFTextField
                  name="name"
                  label={t('formsInputs.name')}
                  size="small"
                  required
                  fullWidth
                />

                {/* Type - نوع مهمات (اجباری - SELECT) */}
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={t('formsInputs.type')}
                      size="small"
                      fullWidth
                      required
                      sx={{
                        '& .MuiSelect-select': {
                          color: typeOptions.find((opt) => opt.value === field.value)?.color,
                          fontWeight: 500,
                        },
                      }}
                    >
                      {typeOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          sx={{ color: option.color, fontWeight: 500 }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                {/* Quantity - تعداد (اجباری) */}
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('formsInputs.quantity')}
                      size="small"
                      type="number"
                      fullWidth
                      required
                      InputProps={{
                        inputProps: { min: 0, step: 1 },
                      }}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(value);
                      }}
                      helperText={
                        watchedQuantity < 500 && watchedQuantity > 0
                          ? `⚠️ ${t('stockStatus.lowStockWarning')}`
                          : watchedQuantity === 0 && watchedQuantity !== ''
                            ? `❌ ${t('stockStatus.outOfStock')}`
                            : ''
                      }
                      FormHelperTextProps={{
                        sx: {
                          color:
                            watchedQuantity < 500 && watchedQuantity > 0
                              ? '#ff9800'
                              : watchedQuantity === 0
                                ? '#f44336'
                                : '',
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>

          {/* نمایش خلاصه وضعیت موجودی */}
          {watchedQuantity !== undefined && watchedQuantity !== '' && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 1,
                bgcolor: stockStatus.bg,
                border: `1px solid ${stockStatus.border}`,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <span>وضعیت موجودی:</span>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: stockStatus.color,
                  }}
                >
                  {stockStatus.text}
                </span>
              </Stack>
            </Box>
          )}

          <Stack justifyContent="flex-end" direction="row" gap={1} sx={{ mt: 3 }}>
            <Button
              type="submit"
              color="success"
              variant="contained"
              disabled={isSubmitting}
              size="small"
            >
              {isSubmitting
                ? currentAmmunition
                  ? t('buttons.updating')
                  : t('buttons.creating')
                : currentAmmunition
                  ? t('buttons.update')
                  : t('buttons.create')}
            </Button>
            <Button onClick={onClose} color="error" variant="contained" size="small">
              {t('buttons.cancel')}
            </Button>
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
