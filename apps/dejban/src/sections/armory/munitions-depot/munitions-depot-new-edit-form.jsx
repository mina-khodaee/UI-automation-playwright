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
  TextField,
  Autocomplete,
} from '@mui/material';
import { toast } from 'sonner';
import { Form, RHFTextField } from 'src/components/hook-form';
import { useTranslation } from 'react-i18next';

export function MunitionsDepotNewEditForm({
  currentLocation,
  open,
  onClose,
  setLocations,
  locations,
}) {
  const { t } = useTranslation('munitions-depot');

  // ماک دیتا برای سایت‌ها
  const mockSites = useMemo(
    () => [
      { id: 'site1', name: 'سایت تهران' },
      { id: 'site2', name: 'سایت اهواز' },
      { id: 'site3', name: 'سایت رشت' },
      { id: 'site4', name: 'سایت مشهد' },
      { id: 'site5', name: 'سایت کرمانشاه' },
      { id: 'site6', name: 'سایت اصفهان' },
      { id: 'site7', name: 'سایت شیراز' },
    ],
    []
  );

  const defaultValues = useMemo(
    () => ({
      name: currentLocation?.name || '',
      siteId: currentLocation?.siteId || null,
    }),
    [currentLocation]
  );

  const methods = useForm({
    mode: 'all',
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const validateForm = (data) => {
    if (!data.name?.trim()) {
      toast.error(t('formValidationErrors.name.required'));
      return false;
    }
    return true;
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!validateForm(data)) return;

    try {
      const payload = {
        name: data.name.trim(),
        siteId: data.siteId || null,
        createdAt: new Date().toISOString(),
      };

      if (currentLocation) {
        setLocations((prev) =>
          prev.map((l) => (l.id === currentLocation.id ? { ...l, ...payload, id: l.id } : l))
        );
        toast.success(t('toastMessages.update'));
      } else {
        const newId = String(Date.now());
        setLocations((prev) => [{ id: newId, ...payload }, ...prev]);
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
  }, [currentLocation, open, reset, defaultValues]);

  useEffect(() => {
    if (!open) {
      reset({
        name: '',
        siteId: null,
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">
        {currentLocation ? t('title.updateMunitionsDepot') : t('title.insertMunitionsDepot')}
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
                {/* Name - نام انبار (اجباری) */}
                <RHFTextField name="name" label={t('formsInputs.name')} size="small" required />

                {/* SiteId - سایت (اختیاری) */}
                <Controller
                  name="siteId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={mockSites}
                      getOptionLabel={(option) => option.name}
                      value={mockSites.find((s) => s.id === field.value) || null}
                      onChange={(_, newValue) => {
                        setValue('siteId', newValue?.id ?? null, {
                          shouldValidate: true,
                        });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('formsInputs.siteId')}
                          size="small"
                          placeholder={t('formsInputs.siteId')}
                        />
                      )}
                    />
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
                ? currentLocation
                  ? t('buttons.updating')
                  : t('buttons.creating')
                : currentLocation
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
