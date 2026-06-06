'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import {
  useCreatePatrolArea,
  useUpdatePatrolArea,
} from 'src/services/patrol-area/patrol-area.service';

import { useGetSites } from 'src/services/siteManagement/site.service';
// ----------------------------------------------------------------------

export function PatrolAreaNewEditForm({ open, onClose, onRefetch, currentItem }) {
  const { t: t_common } = useTranslate();
  const { t: t_patrolArea } = useTranslate('patrol-area');

  const createPatrolArea = useCreatePatrolArea();
  const updatePatrolArea = useUpdatePatrolArea();

  const PatrolAreaSchema = zod.object({
    name: zod.string().min(1, t_patrolArea('formValidationErrors.name.required')),

    siteId: zod.string().min(1, t_patrolArea('formValidationErrors.siteId.required')),

    description: zod
      .string()
      .optional()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
  });

  const { data, isLoading } = useGetSites();
  const getAllSites = data?.items || [];

  const sitesData = getAllSites.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  //  default values
  const defaultValues = useMemo(
    () => ({
      siteId: currentItem?.site?.id || '',
      name: currentItem?.name || '',
      description: currentItem?.description || '',
    }),
    [currentItem]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(PatrolAreaSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  //  Submit
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem) {
        await updatePatrolArea.mutateAsync({
          patrolAreaId: currentItem.id,
          ...data,
        });

        toast.success(t_patrolArea('toastMessages.update'));
      } else {
        await createPatrolArea.mutateAsync(data);

        toast.success(t_patrolArea('toastMessages.create'));
      }

      onClose();
      onRefetch?.();
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error.message || t_common('errors.unknownError'));
    }
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">
        {currentItem
          ? t_patrolArea('title.updatePatrolArea')
          : t_patrolArea('title.insertPatrolArea')}
      </DialogTitle>

      <DialogContent sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto', p: 2 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid size={12}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
                sx={{ mt: 1 }}
              >
                {/* siteId */}
                <Field.Select
                  name="siteId"
                  data={sitesData}
                  isLoading={isLoading}
                  displayExp="label"
                  valueExp="value"
                  label={t_patrolArea('formsInputs.siteId')}
                  size="small"
                >
                  {' '}
                  {sitesData.label}
                </Field.Select>

                {/* name */}
                <Field.Text name="name" label={t_patrolArea('formsInputs.name')} size="small" />
              </Box>

              <Box sx={{ mt: 2 }}>
                {/* description */}
                <Field.Text
                  name="description"
                  label={t_patrolArea('formsInputs.description')}
                  multiline
                  rows={3}
                  size="small"
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
              {currentItem ? t_common('button.update') : t_common('button.create')}
            </Button>

            <Button onClick={onClose} color="error" variant="contained" size="small">
              {t_common('button.cancel')}
            </Button>
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
