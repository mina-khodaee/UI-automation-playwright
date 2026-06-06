// src/app/claim-types/claim-type-new-edit-form.jsx

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
  useCreateClaimType,
  useUpdateClaimType,
} from 'src/services/claim-management/claim-management.service';

// ----------------------------------------------------------------------

export function ClaimTypeNewEditForm({ currentClaimType, open, onClose, onRefetch }) {
  const { t: t_common } = useTranslate();
  const { t: t_claimType } = useTranslate('claim-type');

  const createClaimType = useCreateClaimType();
  const updateClaimType = useUpdateClaimType();

  const NewClaimTypeSchema = zod.object({
    name: zod.string().min(1, t_claimType('formValidationErrors.name.required')),
    description: zod
      .string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentClaimType?.name || '',
      description: currentClaimType?.description || '',
    }),
    [currentClaimType]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewClaimTypeSchema),
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
      if (currentClaimType) {
        await updateClaimType.mutateAsync({ id: currentClaimType.id, ...data });
        toast.success(t_claimType('toastMessages.update'));
      } else {
        await createClaimType.mutateAsync(data);
        toast.success(t_claimType('toastMessages.create'));
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
        name: currentClaimType?.name || '',
        description: currentClaimType?.description || '',
      });
    }
  }, [currentClaimType, open, reset]);

  useEffect(() => {
    if (!open) {
      reset({
        name: '',
        description: '',
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle textAlign="center">
        {currentClaimType
          ? t_claimType('title.updateClaimType')
          : t_claimType('title.insertClaimType')}
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
                  sm: 'repeat(1, 1fr)',
                  md: 'repeat(1, 1fr)',
                }}
                sx={{ mt: 1 }}
              >
                <Field.Text
                  name="name"
                  label={t_claimType('formsInputs.name')}
                  inputProps={{ type: 'text' }}
                  size="small"
                />

                <Field.Text
                  name="description"
                  label={t_claimType('formsInputs.description')}
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
              loading={isSubmitting}
              size="small"
            >
              {currentClaimType ? t_common('button.update') : t_common('button.create')}
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
