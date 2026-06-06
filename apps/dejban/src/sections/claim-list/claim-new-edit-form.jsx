// src/app/claims/claim-new-edit-form.jsx

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
  useCreateClaim,
  useUpdateClaim,
  useGetClaimType,
} from 'src/services/claim-management/claim-management.service';

// ----------------------------------------------------------------------

export function ClaimNewEditForm({ currentClaim, open, onClose, onRefetch }) {
  const { t: t_common } = useTranslate();
  const { t: t_claim } = useTranslate('claim');

  const createClaim = useCreateClaim();
  const updateClaim = useUpdateClaim();
  const { data: claimTypesData } = useGetClaimType();

  // تبدیل داده ClaimTypes به فرمت dropdown
  const claimTypeOptions = useMemo(
    () =>
      claimTypesData?.items?.map((item) => ({
        id: item.id,
        title: item.name,
      })) || [],
    [claimTypesData]
  );

  const NewClaimSchema = zod.object({
    value: zod.string().min(1, t_claim('formValidationErrors.value.required')),
    displayValue: zod.string().min(1, t_claim('formValidationErrors.displayValue.required')),
    claimTypeId: zod.string().min(1, t_claim('formValidationErrors.claimTypeId.required')),
    description: zod.string().nullable().optional(),
  });

  const defaultValues = useMemo(
    () => ({
      value: currentClaim?.value || '',
      displayValue: currentClaim?.displayValue || '',
      claimTypeId: currentClaim?.claimType?.id?.toString() || '',
      description: currentClaim?.description || '',
    }),
    [currentClaim]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewClaimSchema),
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
      const submitData = {
        ...data,
        claimTypeId: parseInt(data.claimTypeId, 10),
      };

      if (currentClaim) {
        await updateClaim.mutateAsync({ id: currentClaim.id, ...submitData });
        toast.success(t_claim('toastMessages.update'));
      } else {
        await createClaim.mutateAsync(submitData);
        toast.success(t_claim('toastMessages.create'));
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
        value: currentClaim?.value || '',
        displayValue: currentClaim?.displayValue || '',
        claimTypeId: currentClaim?.claimType?.id?.toString() || '',
        description: currentClaim?.description || '',
      });
    }
  }, [currentClaim, open, reset]);

  useEffect(() => {
    if (!open) {
      reset({
        value: '',
        displayValue: '',
        claimTypeId: '',
        description: '',
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle textAlign="center">
        {currentClaim ? t_claim('title.updateClaim') : t_claim('title.insertClaim')}
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
                  name="value"
                  label={t_claim('formsInputs.value')}
                  inputProps={{ type: 'text' }}
                  size="small"
                />

                <Field.Text
                  name="displayValue"
                  label={t_claim('formsInputs.displayValue')}
                  inputProps={{ type: 'text' }}
                  size="small"
                />

                <Field.Select
                  name="claimTypeId"
                  label={t_claim('formsInputs.claimType')}
                  size="small"
                  data={claimTypeOptions}
                  valueExp="id"
                  displayExp="title"
                />

                <Field.Text
                  name="description"
                  label={t_claim('formsInputs.description')}
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
              {currentClaim ? t_common('button.update') : t_common('button.create')}
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
