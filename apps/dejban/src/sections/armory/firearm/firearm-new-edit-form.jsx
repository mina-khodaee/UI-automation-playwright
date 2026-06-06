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
  Autocomplete,
} from '@mui/material';
import { toast } from 'sonner';
import { Form, RHFTextField } from 'src/components/hook-form';
import { useTranslation } from 'react-i18next'; // یا هر سیستم ترجمه‌ای که دارید

export function FirearmNewEditForm({
  currentFirearm,
  open,
  onClose,
  setFirearms,
  firearms,
  weaponModels,
  munitionsDepots,
  personnel,
}) {
  const { t } = useTranslation('firearm');

  const statusOptions = useMemo(
    () => [
      { value: 'operational', label: t('statusOptions.operational'), color: '#4caf50' },
      { value: 'maintenance', label: t('statusOptions.maintenance'), color: '#ff9800' },
      { value: 'damaged', label: t('statusOptions.damaged'), color: '#f44336' },
      { value: 'stored', label: t('statusOptions.stored'), color: '#2196f3' },
      { value: 'lost', label: t('statusOptions.lost'), color: '#9e9e9e' },
    ],
    [t]
  );

  const defaultValues = useMemo(
    () => ({
      weaponModelId: currentFirearm?.weaponModelId || '',
      serialNumber: currentFirearm?.serialNumber || '',
      manufactureYear: currentFirearm?.manufactureYear || '',
      status: currentFirearm?.status || 'operational',
      munitionsDepotId: currentFirearm?.munitionsDepotId || '',
      assignedPersonnelId: currentFirearm?.assignedPersonnelId || '',
    }),
    [currentFirearm]
  );

  const methods = useForm({ mode: 'all', defaultValues });
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const isSerialDuplicate = (serialNumber, excludeId) => {
    return firearms.some((f) => f.serialNumber === serialNumber && f.id !== excludeId);
  };

  const validateForm = (data) => {
    if (!data.weaponModelId) {
      toast.error(t('formValidationErrors.weaponModelId.required'));
      return false;
    }
    if (!data.serialNumber?.trim()) {
      toast.error(t('formValidationErrors.serialNumber.required'));
      return false;
    }
    if (isSerialDuplicate(data.serialNumber, currentFirearm?.id)) {
      toast.error(t('formValidationErrors.serialNumber.duplicate'));
      return false;
    }
    if (!data.status) {
      toast.error(t('formValidationErrors.status.required'));
      return false;
    }
    if (!data.munitionsDepotId) {
      toast.error(t('formValidationErrors.munitionsDepotId.required'));
      return false;
    }
    if (data.manufactureYear) {
      const year = Number(data.manufactureYear);
      const currentYear = new Date().getFullYear();
      if (year < 1800 || year > currentYear) {
        toast.error(t('formValidationErrors.manufactureYear.invalid'));
        return false;
      }
    }
    return true;
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!validateForm(data)) return;

    const payload = {
      weaponModelId: data.weaponModelId,
      serialNumber: data.serialNumber.trim(),
      manufactureYear: data.manufactureYear ? Number(data.manufactureYear) : null,
      status: data.status,
      munitionsDepotId: data.munitionsDepotId,
      assignedPersonnelId: data.assignedPersonnelId || null,
      // createdAt رو بک‌اند می‌ده، تو ایجاد نباید بفرستیم
    };

    if (currentFirearm) {
      setFirearms((prev) =>
        prev.map((f) => (f.id === currentFirearm.id ? { ...f, ...payload, id: f.id } : f))
      );
      toast.success(t('toastMessages.update'));
    } else {
      const newId = String(Date.now());
      setFirearms((prev) => [
        { id: newId, ...payload, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      toast.success(t('toastMessages.create'));
    }
    onClose();
    reset();
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [currentFirearm, open, reset, defaultValues]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle textAlign="center">
        {currentFirearm ? t('title.updateFirearm') : t('title.insertFirearm')}
      </DialogTitle>
      <DialogContent sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', p: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Box
                display="grid"
                gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
                gap={2}
                sx={{ mt: 1 }}
              >
                <Controller
                  name="weaponModelId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={weaponModels}
                      getOptionLabel={(opt) =>
                        `${opt.manufacturer} ${opt.modelName} (${opt.caliber})`
                      }
                      value={weaponModels.find((wm) => wm.id === field.value) || null}
                      onChange={(_, newValue) => setValue('weaponModelId', newValue?.id ?? '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('formsInputs.weaponModelId')}
                          size="small"
                          required
                        />
                      )}
                    />
                  )}
                />
                <RHFTextField
                  name="serialNumber"
                  label={t('formsInputs.serialNumber')}
                  size="small"
                  required
                />
                <Controller
                  name="manufactureYear"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('formsInputs.manufactureYear')}
                      size="small"
                      type="number"
                      fullWidth
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                      }
                    />
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={t('formsInputs.status')}
                      size="small"
                      fullWidth
                      required
                    >
                      {statusOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value} sx={{ color: opt.color }}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  name="munitionsDepotId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={munitionsDepots}
                      getOptionLabel={(opt) => opt.name}
                      value={munitionsDepots.find((d) => d.id === field.value) || null}
                      onChange={(_, newValue) => setValue('munitionsDepotId', newValue?.id ?? '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('formsInputs.munitionsDepotId')}
                          size="small"
                          required
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="assignedPersonnelId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={personnel}
                      getOptionLabel={(opt) => `${opt.rank} ${opt.name}`}
                      value={personnel.find((p) => p.id === field.value) || null}
                      onChange={(_, newValue) =>
                        setValue('assignedPersonnelId', newValue?.id ?? '')
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('formsInputs.assignedPersonnelId')}
                          size="small"
                        />
                      )}
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end" gap={1} sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="success" disabled={isSubmitting}>
              {isSubmitting
                ? currentFirearm
                  ? t('buttons.updating')
                  : t('buttons.creating')
                : currentFirearm
                  ? t('buttons.update')
                  : t('buttons.create')}
            </Button>
            <Button onClick={onClose} variant="contained" color="error">
              {t('buttons.cancel')}
            </Button>
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
