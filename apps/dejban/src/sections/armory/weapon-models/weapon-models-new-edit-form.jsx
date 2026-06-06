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

export function WeaponModelNewEditForm({
  currentWeapon,
  open,
  onClose,
  setWeaponModels,
  weaponModels,
}) {
  const { t } = useTranslation('weapon-model');

  // آپشن‌های دسته‌بندی
  const categoryOptions = useMemo(
    () => [
      { value: 'pistol', label: t('categoryOptions.pistol') },
      { value: 'rifle', label: t('categoryOptions.rifle') },
      { value: 'shotgun', label: t('categoryOptions.shotgun') },
      { value: 'sniper', label: t('categoryOptions.sniper') },
      { value: 'machinegun', label: t('categoryOptions.machinegun') },
      { value: 'subMachinegun', label: t('categoryOptions.subMachinegun') },
    ],
    [t]
  );

  // آپشن‌های نظام عملیاتی
  const actionOptions = useMemo(
    () => [
      { value: 'semiAuto', label: t('actionOptions.semiAuto') },
      { value: 'auto', label: t('actionOptions.auto') },
      { value: 'bolt', label: t('actionOptions.bolt') },
      { value: 'lever', label: t('actionOptions.lever') },
      { value: 'pump', label: t('actionOptions.pump') },
      { value: 'break', label: t('actionOptions.break') },
    ],
    [t]
  );

  // آپشن‌های نوع خان
  const riflingOptions = useMemo(
    () => [
      { value: '', label: t('magazineOptions.none') },
      { value: 'polygonal', label: t('riflingOptions.polygonal') },
      { value: 'conventional', label: t('riflingOptions.conventional') },
      { value: 'button', label: t('riflingOptions.button') },
      { value: 'cut', label: t('riflingOptions.cut') },
    ],
    [t]
  );

  // آپشن‌های مدل خشاب
  const magazineOptions = useMemo(
    () => [
      { value: '', label: t('magazineOptions.none') },
      { value: 'stanag', label: t('magazineOptions.stanag') },
      { value: 'ak', label: t('magazineOptions.ak') },
      { value: 'glock', label: t('magazineOptions.glock') },
      { value: 'beretta', label: t('magazineOptions.beretta') },
      { value: 'm4', label: t('magazineOptions.m4') },
      { value: 'other', label: t('magazineOptions.other') },
    ],
    [t]
  );

  const defaultValues = useMemo(
    () => ({
      manufacturer: currentWeapon?.manufacturer || '',
      modelName: currentWeapon?.modelName || '',
      category: currentWeapon?.category || '',
      caliber: currentWeapon?.caliber || '',
      action: currentWeapon?.action || '',
      magazineModel: currentWeapon?.magazineModel || '',
      weightEmptyGrams: currentWeapon?.weightEmptyGrams || '',
      overallLengthMm: currentWeapon?.overallLengthMm || '',
      barrelLengthMm: currentWeapon?.barrelLengthMm || '',
      rifling: currentWeapon?.rifling || '',
    }),
    [currentWeapon]
  );

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const validateForm = (data) => {
    if (!data.manufacturer?.trim()) {
      toast.error(t('formValidationErrors.manufacturer.required'));
      return false;
    }
    if (!data.modelName?.trim()) {
      toast.error(t('formValidationErrors.modelName.required'));
      return false;
    }
    if (!data.category) {
      toast.error(t('formValidationErrors.category.required'));
      return false;
    }
    if (!data.caliber?.trim()) {
      toast.error(t('formValidationErrors.caliber.required'));
      return false;
    }
    if (!data.action) {
      toast.error(t('formValidationErrors.action.required'));
      return false;
    }
    if (data.weightEmptyGrams && data.weightEmptyGrams < 0) {
      toast.error(t('formValidationErrors.weightEmptyGrams.invalid'));
      return false;
    }
    if (data.overallLengthMm && data.overallLengthMm < 0) {
      toast.error(t('formValidationErrors.overallLengthMm.invalid'));
      return false;
    }
    if (data.barrelLengthMm && data.barrelLengthMm < 0) {
      toast.error(t('formValidationErrors.barrelLengthMm.invalid'));
      return false;
    }
    return true;
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!validateForm(data)) return;

    try {
      const payload = {
        manufacturer: data.manufacturer.trim(),
        modelName: data.modelName.trim(),
        category: data.category,
        caliber: data.caliber.trim(),
        action: data.action,
        magazineModel: data.magazineModel || null,
        weightEmptyGrams: data.weightEmptyGrams ? Number(data.weightEmptyGrams) : null,
        overallLengthMm: data.overallLengthMm ? Number(data.overallLengthMm) : null,
        barrelLengthMm: data.barrelLengthMm ? Number(data.barrelLengthMm) : null,
        rifling: data.rifling || null,
        createdAt: new Date().toISOString(),
      };

      if (currentWeapon) {
        setWeaponModels((prev) =>
          prev.map((w) => (w.id === currentWeapon.id ? { ...w, ...payload, id: w.id } : w))
        );
        toast.success(t('toastMessages.update'));
      } else {
        const newId = String(Date.now());
        setWeaponModels((prev) => [{ id: newId, ...payload }, ...prev]);
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
  }, [currentWeapon, open, reset, defaultValues]);

  useEffect(() => {
    if (!open) {
      reset({
        manufacturer: '',
        modelName: '',
        category: '',
        caliber: '',
        action: '',
        magazineModel: '',
        weightEmptyGrams: '',
        overallLengthMm: '',
        barrelLengthMm: '',
        rifling: '',
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle textAlign="center">
        {currentWeapon ? t('title.updateWeaponModel') : t('title.insertWeaponModel')}
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
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                sx={{ mt: 1 }}
              >
                {/* Manufacturer - سازنده */}
                <RHFTextField
                  name="manufacturer"
                  label={t('formsInputs.manufacturer')}
                  size="small"
                  required
                />

                {/* ModelName - نام مدل */}
                <RHFTextField
                  name="modelName"
                  label={t('formsInputs.modelName')}
                  size="small"
                  required
                />

                {/* Category - دسته‌بندی */}
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={t('formsInputs.category')}
                      size="small"
                      fullWidth
                      required
                    >
                      {categoryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                {/* Caliber - کالیبر */}
                <RHFTextField
                  name="caliber"
                  label={t('formsInputs.caliber')}
                  size="small"
                  placeholder="مثال: 9x19mm, 5.56x45mm"
                  required
                />

                {/* Action - نظام عملیاتی */}
                <Controller
                  name="action"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={t('formsInputs.action')}
                      size="small"
                      fullWidth
                      required
                    >
                      {actionOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                {/* MagazineModel - مدل خشاب */}
                <Controller
                  name="magazineModel"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={t('formsInputs.magazineModel')}
                      size="small"
                      fullWidth
                    >
                      {magazineOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                {/* WeightEmptyGrams - وزن خالی */}
                <Controller
                  name="weightEmptyGrams"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('formsInputs.weightEmptyGrams')}
                      size="small"
                      type="number"
                      fullWidth
                      placeholder="مثال: 625"
                      InputProps={{ inputProps: { min: 0, step: 100 } }}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  )}
                />

                {/* OverallLengthMm - طول کلی */}
                <Controller
                  name="overallLengthMm"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('formsInputs.overallLengthMm')}
                      size="small"
                      type="number"
                      fullWidth
                      placeholder="مثال: 186"
                      InputProps={{ inputProps: { min: 0, step: 10 } }}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  )}
                />

                {/* BarrelLengthMm - طول لوله */}
                <Controller
                  name="barrelLengthMm"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('formsInputs.barrelLengthMm')}
                      size="small"
                      type="number"
                      fullWidth
                      placeholder="مثال: 114"
                      InputProps={{ inputProps: { min: 0, step: 10 } }}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  )}
                />

                {/* Rifling - نوع خان */}
                <Controller
                  name="rifling"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={t('formsInputs.rifling')}
                      size="small"
                      fullWidth
                    >
                      {riflingOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>
            </Grid>
          </Grid>

          <Stack justifyContent="flex-end" direction="row" gap={1} sx={{ mt: 3 }}>
            <Button
              type="submit"
              color="success"
              variant="contained"
              disabled={isSubmitting}
              size="small"
            >
              {isSubmitting
                ? currentWeapon
                  ? t('buttons.updating')
                  : t('buttons.creating')
                : currentWeapon
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
