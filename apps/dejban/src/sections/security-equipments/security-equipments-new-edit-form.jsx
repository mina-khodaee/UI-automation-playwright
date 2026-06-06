'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import {
  useCreateSecurityEquipments,
  useUpdateSecurityEquipments,
} from 'src/services/security-equipments/security-equipments.service';
import { useGetSecurityEquipmentTypes } from 'src/services/security-equipment-types/security-equipment-types.service';
import log from 'eslint-plugin-react/lib/util/log';

// ----------------------------------------------------------------------

export function SecurityEquipmentsNewEditForm({
  currentSecurityEquipments,
  open,
  onClose,
  onRefetch,
}) {
  const { t: t_securityEquipment } = useTranslate('security-equipments');
  const { t: t_common } = useTranslate();
  // const editId = currentSecurityEquipments.id;

  const [searchTerm, setSearchTerm] = useState('');

  const createSecurityEquipments = useCreateSecurityEquipments();
  const updateSecurityEquipments = useUpdateSecurityEquipments();

  // Get Data For equipmentTypeId Select Box Field
  const { data: getEquipmentTypeId } = useGetSecurityEquipmentTypes({ searchTerm });
  const getAllEquipmentTypeId = getEquipmentTypeId?.items || [];

  // ----------------------------
  const methods = useForm({
    mode: 'all',
  });

  const {
    watch,
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const selectedEquipmentTypeId = watch('equipmentTypeId');

  const equipmentTypeIdOptions =
    getAllEquipmentTypeId?.map((e) => ({
      label: e.name,
      value: e.id,
      isUnique: e.isUnique,
    })) || [];

  const isUnique = useMemo(() => {
    const selected = getAllEquipmentTypeId?.find((e) => e.id === selectedEquipmentTypeId);
    return selected?.isUnique ?? false;
  }, [selectedEquipmentTypeId, getAllEquipmentTypeId]);

  const NewEquipmentSchema = useMemo(
    () =>
      zod
        .object({
          equipmentTypeId: zod
            .string()
            .min(1, t_securityEquipment('formValidationErrors.equipmentTypeId.required')),

          serialNumber: zod
            .string()
            .optional()
            .nullable()
            .transform((value) => (value === '' ? null : value)),

          name: zod.string().min(1, t_securityEquipment('formValidationErrors.name.required')),

          count: zod.coerce
            .number({
              invalid_type_error: t_securityEquipment('formValidationErrors.count.invalid'),
            })
            .min(1, t_securityEquipment('formValidationErrors.count.required')),

          description: zod
            .string()
            .optional()
            .nullable()
            .transform((value) => (value === '' ? null : value)),
        })
        .superRefine((data, ctx) => {
          if (isUnique && !data.serialNumber) {
            ctx.addIssue({
              path: ['serialNumber'],
              message: t_securityEquipment('formValidationErrors.serialNumber.required'),
              code: 'custom',
            });
          }
        }),
    [isUnique]
  );

  //
  methods.control._options.resolver = zodResolver(NewEquipmentSchema);

  // ----------------------------
  // Submit
  // ----------------------------
  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentSecurityEquipments) {
        await updateSecurityEquipments.mutateAsync({
          securityEquipmentId: currentSecurityEquipments.id,
          ...data,
        });
        toast.success(t_securityEquipment('toastMessages.update'));
      } else {
        await createSecurityEquipments.mutateAsync(data);
        toast.success(t_securityEquipment('toastMessages.create'));
      }

      onClose();
      onRefetch();
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error.message || t_common('errors.unknownError'));
    }
  });

  // ✅ Reset
  useEffect(() => {
    if (open) {
      reset({
        name: currentSecurityEquipments?.name || '',
        equipmentTypeId: currentSecurityEquipments?.equipmentType.id || '',
        serialNumber: currentSecurityEquipments?.serialNumber || '',
        count: currentSecurityEquipments?.count ?? '',
        description: currentSecurityEquipments?.description || '',
      });
    }
  }, [currentSecurityEquipments, open, reset]);

  // ✅ Reset
  useEffect(() => {
    if (!open) {
      reset({
        name: '',
        equipmentTypeId: '',
        serialNumber: '',
        count: '',
        description: '',
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">
        {currentSecurityEquipments
          ? t_securityEquipment('title.updateSecurityEquipments')
          : t_securityEquipment('title.insertSecurityEquipments')}
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
                {/* equipmentTypeId */}

                {/* serialNumber */}
                <Field.Text
                  name="name"
                  label={t_securityEquipment('formsInputs.name')}
                  size="small"
                  type="text"
                />

                <Controller
                  name="equipmentTypeId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Autocomplete
                      freeSolo
                      options={equipmentTypeIdOptions}
                      getOptionLabel={(option) =>
                        typeof option === 'string' ? option : option.label
                      }
                      isOptionEqualToValue={(option, value) => option.value === value} // compare string with option.value
                      value={equipmentTypeIdOptions.find((o) => o.value === field.value) || null}
                      onInputChange={(_, value) => setSearchTerm(value)}
                      onChange={(_, value) => {
                        if (!value) field.onChange('');
                        else if (typeof value === 'string') field.onChange(value);
                        else field.onChange(value.value);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t_securityEquipment('formsInputs.equipmentTypeId')}
                          placeholder={t_securityEquipment('formsInputs.placeholder ')}
                          size="small"
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                    />
                  )}
                />

                {/* count */}
                <Field.Text
                  name="count"
                  label={t_securityEquipment('formsInputs.count')}
                  type="number"
                  size="small"
                />

                {/* serialNumber */}
                <Field.Text
                  name="serialNumber"
                  label={t_securityEquipment('formsInputs.serialNumber')}
                  size="small"
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                {/* description */}
                <Field.Text
                  name="description"
                  label={t_securityEquipment('formsInputs.description')}
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
              {currentSecurityEquipments ? t_common('button.update') : t_common('button.create')}
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
