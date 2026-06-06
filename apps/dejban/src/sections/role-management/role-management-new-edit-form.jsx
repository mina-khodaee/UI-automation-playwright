import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRole, useGetRoleById, useUpdateRole } from 'src/services/roleManagement/roleManagement.service';
import Box from '@mui/material/Box';
import { Autocomplete, Button, Chip, Dialog, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { useSiteAPI } from 'src/stores/site-api';

// ----------------------------------------------------------------------

export function RoleManagementNewEditForm({ currentRole, open, onClose, onRefetch }) {
  const { t: t_common } = useTranslate();
  const { t: t_roleManagement } = useTranslate('roleManagement');

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  const { allSite, getSites } = useSiteAPI();

  useEffect(() => {
    getSites();
  }, [getSites]);

  const roleManagementId = currentRole?.id;

  // --------------------------------------------------
  const {
    data: currentData,
    isLoading: getRoleByIdLoading,
    error,
  } = useGetRoleById(roleManagementId, {
    enabled: open && !!roleManagementId,
  });

  const RoleSchema = zod.object({
    name: zod
      .string()
      .min(1, { message: t_roleManagement('formValidationErrors.roleName.required') }),
    description: zod
      .string(zod.string())
      .min(1, { message: t_roleManagement('formValidationErrors.description.required') }),
    siteIds: zod
      .array(zod.string())
      .min(1, { message: t_roleManagement('formValidationErrors.sites.required') }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || '',
      description: currentData?.description || '',
      siteIds: currentData?.siteIds || [],
    }),
    [currentData]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(RoleSchema),
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

  const isLoading = createRoleMutation.isLoading || updateRoleMutation.isLoading;

    // Insert/Update Data
    const onSubmit = handleSubmit(async (data) => {
        try {
            if (currentRole) {
                await updateRoleMutation.mutateAsync({ id: currentRole.id, ...data });
                toast.success(t_roleManagement('toastMessages.updateRoleManagementSuccess'));
            } else {
                await createRoleMutation.mutateAsync(data);
                toast.success(t_roleManagement('toastMessages.createRoleManagementSuccess'));
            }

      onClose();
      onRefetch();
      reset();
    } catch (error) {
      toast.error(error || t_common('errors.unknownError'));
    }
  });

  const siteIds = watch('siteIds');


  const selectedSites = useMemo(() => {
    return allSite.filter((site) => siteIds.includes(site.id));
  }, [allSite, siteIds]);

  useEffect(() => {
    if (open) {
      reset({
        name: currentData?.name || '',
        description: currentData?.description || '',
        siteIds: currentData?.siteIds || [],
      });
    }
  }, [currentData, open, reset]);

  useEffect(() => {
    if (!open) {
      reset({
        name: '',
        description: '',
        siteIds: [],
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">
        {currentRole
          ? t_roleManagement('title.updateRoleManagement')
          : t_roleManagement('title.insertRoleManagement')}
      </DialogTitle>

      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid size={8}>
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
                  label={t_roleManagement('formsInputs.roleName')}
                  inputProps={{ type: 'text' }}
                  size="small"
                />

                <Controller
                  name="siteIds"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      multiple
                      options={allSite}
                      getOptionLabel={(option) =>
                        option.name || option.title || `Site ${option.id}`
                      }
                      value={selectedSites}
                      onChange={(event, newValue) => {
                        const newSiteIds = newValue.map((site) => site.id);
                        setValue('siteIds', newSiteIds, { shouldValidate: true });
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t_roleManagement('formsInputs.sites')}
                          error={!!error}
                          helperText={error?.message}
                          placeholder={t_roleManagement('formsInputs.selectSites')}
                          size="small"
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            label={option.name || option.title || `Site ${option.id}`}
                            size="small"
                          />
                        ))
                      }
                    />
                  )}
                />

                <Field.Text
                  name="description"
                  label={t_roleManagement('formsInputs.description')}
                  multiline
                  rows={3}
                  size="small"
                />

                <Box display="flex" justifyContent="flex-end" gap={2} sx={{ my: 2 }}>
                  <Button
                    type="submit"
                    color="success"
                    variant="contained"
                    loading={isLoading}
                    size="small"
                  >
                    {currentRole ? t_common('button.update') : t_common('button.create')}
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
