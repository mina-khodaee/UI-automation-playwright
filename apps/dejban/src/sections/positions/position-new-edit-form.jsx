'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Autocomplete, Button, Chip, Dialog, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { useTranslate } from 'src/locales';
import { useSiteAPI } from 'src/stores/site-api';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useCreatePosition, useGetPositionById, useUpdatePosition } from 'src/services/position/position.service';

// ----------------------------------------------------------------------

export function PositionNewEditForm({ currentPosition, open, onClose, onRefetch }) {
  const { t: t_common } = useTranslate();
  const { t: t_position } = useTranslate('positions');
  const { allSite, getSites } = useSiteAPI();

  useEffect(() => {
    getSites();
  }, [getSites]);


  const createPositions = useCreatePosition();
  const updatePositions = useUpdatePosition();

  const positionId = currentPosition?.id;
  // --------------------------------------------------
  const { data: currentData, isLoading: getRoleByIdLoading, error } = useGetPositionById(positionId, {
    enabled: open && !!positionId,
  });

  const NewPositionSchema = zod.object({
    description: zod
      .string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    name: zod.string().min(1, t_position('formValidationErrors.name.required')),
    siteIds: zod
      .array(zod.string())
      .min(1, t_position('formValidationErrors.sites.required'))
      .optional()
      .default([]),
  });

  const defaultValues = useMemo(
    () => ({
      description: currentData?.description || '',
      name: currentData?.name || '',
      siteIds: currentData?.siteIds || [],
    }),
    [currentData]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewPositionSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;


  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentPosition) {
        await updatePositions.mutateAsync({ id: currentPosition.id, ...data });
        toast.success(t_position('toastMessages.update'));
      } else {
        await createPositions.mutateAsync(data);
        toast.success(t_position('toastMessages.create'));
      }

      onClose();
      onRefetch();
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error.message || t_common('errors.unknownError'));
    }
  });


  useEffect(() => {
    if (open) {
      reset({
        description: currentData?.description || '',
        name: currentData?.name || '',
        siteIds: currentData?.sites?.map(site => site.id) || [],
      });
    }
  }, [currentData, open, reset]);

  useEffect(() => {
    if (!open) {
      reset({
        description: '',
        name: '',
        siteIds: [],
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle textAlign="center">
        {currentPosition ? t_position('title.updatePosition') : t_position('title.insertPosition')}
      </DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
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
                <Field.Text
                  name="name"
                  label={t_position('formsInputs.name')}
                  inputProps={{ type: 'text' }}
                  size="small"
                />

                <Field.Text
                  name="description"
                  label={t_position('formsInputs.description')}
                  multiline
                  rows={3}
                  size="small"
                />

                {/* Should Remove Field */}
                <Controller
                  name="siteIds"
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    // پیدا کردن آبجکت‌های سایت بر اساس IDهای موجود در field.value
                    const selectedSiteObjects = allSite.filter(site =>
                      field.value?.includes(site.id)
                    );

                    return (
                      <Autocomplete
                        multiple
                        options={allSite}
                        getOptionLabel={(option) => option.name || `Site ${option.id}`}
                        value={selectedSiteObjects}
                        onChange={(_, newValue) => {
                          const newSiteIds = newValue.map(site => site.id);
                          field.onChange(newSiteIds);
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t_position('formsInputs.sites')}
                            error={!!error}
                            helperText={error?.message}
                            placeholder={t_position('formsInputs.selectSites')}
                            size="small"
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option.id}
                              label={option.name || `Site ${option.id}`}
                              size="small"
                            />
                          ))
                        }
                      />
                    );
                  }}
                />


                <Box display="flex" justifyContent="flex-end" gap={2} sx={{ my: 2 }}>
                  <Button
                    type="submit"
                    color="success"
                    variant="contained"
                    loading={isSubmitting}
                    size="small"
                  >
                    {currentPosition ? t_common('button.update') : t_common('button.create')}
                  </Button>
                  <Button onClick={onClose} color="error" variant="contained" size="small">
                    {t_common('button.cancel')}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>
    </Dialog>
  );
}