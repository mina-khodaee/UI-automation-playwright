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
import {
  useGetSites,
  useCreateSite,
  useUpdateSite,
} from 'src/services/siteManagement/site.service';

export function SiteNewEditForm({ currentSite, open, onClose, onRefetch }) {
  const { t } = useTranslation('site');

  const { data: sitesData } = useGetSites({
    page: 1,
    pageSize: 1000,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const allSites = sitesData?.items || [];

  const createSite = useCreateSite();
  const updateSite = useUpdateSite();

  const defaultValues = useMemo(
    () => ({
      name: currentSite?.name || '',
      parentSiteId: currentSite?.parentSiteId || null,
      description: currentSite?.description || '',
    }),
    [currentSite]
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
        parentSiteId: data.parentSiteId || null,
        description: data.description?.trim() || null,
      };

      if (currentSite) {
        await updateSite.mutateAsync({ id: currentSite.id, ...payload });
        toast.success(t('toastMessages.update'));
      } else {
        await createSite.mutateAsync(payload);
        toast.success(t('toastMessages.create'));
      }

      onClose();
      onRefetch();
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
  }, [currentSite, open, reset, defaultValues]);

  useEffect(() => {
    if (!open) {
      reset({
        name: '',
        parentSiteId: null,
        description: '',
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">
        {currentSite ? t('title.updateSite') : t('title.insertSite')}
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
                {/* Name - نام مرکز (اجباری) */}
                <RHFTextField
                  name="name"
                  label={t('formsInputs.name')}
                  size="small"
                  required
                  fullWidth
                />

                {/* ParentSiteId - مرکز والد (اختیاری - SELECT از API) */}
                <Controller
                  name="parentSiteId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={allSites}
                      getOptionLabel={(option) => option.name}
                      value={allSites.find((s) => s.id === field.value) || null}
                      onChange={(_, newValue) => {
                        setValue('parentSiteId', newValue?.id ?? null, {
                          shouldValidate: true,
                        });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('formsInputs.parentSiteId')}
                          size="small"
                          placeholder={t('formsInputs.parentSiteId')}
                        />
                      )}
                    />
                  )}
                />

                {/* Description - توضیحات (اختیاری) */}
                <RHFTextField
                  name="description"
                  label={t('formsInputs.description')}
                  size="small"
                  multiline
                  rows={3}
                  fullWidth
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
                ? currentSite
                  ? t('buttons.updating')
                  : t('buttons.creating')
                : currentSite
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
