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
  useCreateSecurityEquipmentTypes,
  useUpdateSecurityEquipmentTypes,
} from 'src/services/security-equipment-types/security-equipment-types.service';

// ----------------------------------------------------------------------

export function SecurityEquipmentTypesNewEditForm({
  currentSecurityEquipmentTypes,
  open,
  onClose,
  onRefetch,
}) {
  const { t: t_securityEquipmentTypes } = useTranslate('security-equipment-types');
  const { t: t_common, currentLang } = useTranslate();

  const createSecurityEquipmentTypes = useCreateSecurityEquipmentTypes();
  const updateSecurityEquipmentTypes = useUpdateSecurityEquipmentTypes();

  const NewSecurityEquipmentTypesSchema = zod.object({
    description: zod
      .string()
      .optional()
      .nullable()
      .transform((value) => (value === '' ? null : value)),

    name: zod.string().min(1, t_securityEquipmentTypes('formValidationErrors.name.required')),
    isUnique: zod.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      description: currentSecurityEquipmentTypes?.description || '',
      name: currentSecurityEquipmentTypes?.name || '',
      isUnique: currentSecurityEquipmentTypes?.isUnique || false,
    }),
    [currentSecurityEquipmentTypes]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewSecurityEquipmentTypesSchema),
    isUnique: false,
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentSecurityEquipmentTypes) {
        await updateSecurityEquipmentTypes.mutateAsync({
          securityEquipmentTypeId: currentSecurityEquipmentTypes.id,
          ...data,
        });
        toast.success(t_securityEquipmentTypes('toastMessages.update'));
      } else {
        await createSecurityEquipmentTypes.mutateAsync({
          ...data,
          isUnique: data.isUnique ?? false,
        });
        toast.success(t_securityEquipmentTypes('toastMessages.create'));
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
        description: currentSecurityEquipmentTypes?.description || '',
        name: currentSecurityEquipmentTypes?.name || '',
        isUnique: currentSecurityEquipmentTypes?.isUnique || false,
      });
    }
  }, [currentSecurityEquipmentTypes, open, reset]);

  useEffect(() => {
    if (!open) {
      reset({
        description: '',
        name: '',
        isUnique: false,
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">
        {currentSecurityEquipmentTypes
          ? t_securityEquipmentTypes('title.updateSecurityEquipmentTypes')
          : t_securityEquipmentTypes('title.insertSecurityEquipmentTypes')}
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
                  md: 'repeat(2, 1fr)',
                }}
                sx={{ mt: 1 }}
              >
                <Field.Text
                  name="name"
                  label={t_securityEquipmentTypes('formsInputs.name')}
                  inputProps={{ type: 'text' }}
                  size="small"
                />

                <Box>
                  <Field.Checkbox
                    name="isUnique"
                    label={t_securityEquipmentTypes('formsInputs.isUnique')}
                  />
                </Box>
              </Box>

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
                  name="description"
                  label={t_securityEquipmentTypes('formsInputs.description')}
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
              {currentSecurityEquipmentTypes
                ? t_common('button.update')
                : t_common('button.create')}
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
