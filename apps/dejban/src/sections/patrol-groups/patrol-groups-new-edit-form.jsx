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
  useCreatePatrolGroups,
  useUpdatePatrolGroups,
} from 'src/services/patrol-groups/patrol-groups.service';

import { useGetSites } from 'src/services/siteManagement/site.service';
import { values } from 'es-toolkit/compat';
// ----------------------------------------------------------------------

export function PatrolGroupsNewEditForm({ open, onClose, onRefetch, currentItem }) {
  const { t: t_common } = useTranslate();
  const { t: t_patrolGrups } = useTranslate('patrol-groups');

  const createPatrolGroups = useCreatePatrolGroups();
  const updatePatrolGroups = useUpdatePatrolGroups();

  // ✅ Schema مطابق مدل جدید
  const PatrolGroupsSchema = zod.object({
    name: zod.string().min(1, t_patrolGrups('formValidationErrors.name.required')),

    siteId: zod.string().min(1, t_patrolGrups('formValidationErrors.siteId.required')),

    description: zod
      .string()
      .optional()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
  });

  const { data, isLoading, refetch } = useGetSites();
  const getAllSites = data?.items || [];

  const sitesData = getAllSites.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  // ✅ default values
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
    resolver: zodResolver(PatrolGroupsSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // ✅ Submit
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentItem) {
        await updatePatrolGroups.mutateAsync({
          patrolGroupId: currentItem.id,
          ...data,
        });

        toast.success(t_patrolGrups('toastMessages.update'));
      } else {
        await createPatrolGroups.mutateAsync(data);

        toast.success(t_patrolGrups('toastMessages.create'));
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
          ? t_patrolGrups('title.updatePatrolGroups')
          : t_patrolGrups('title.insertPatrolGroups')}
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
                  displayExp="label"
                  valueExp="value"
                  label={t_patrolGrups('formsInputs.siteId')}
                  size="small"
                >
                  {' '}
                  {sitesData.label}
                </Field.Select>

                {/* name */}
                <Field.Text name="name" label={t_patrolGrups('formsInputs.name')} size="small" />
              </Box>

              <Box sx={{ mt: 2 }}>
                {/* description */}
                <Field.Text
                  name="description"
                  label={t_patrolGrups('formsInputs.description')}
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
