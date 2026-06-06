'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslate } from 'src/locales';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import {
  useGetClaim,
  useGetClaimType,
} from 'src/services/claim-management/claim-management.service';
import {
  useAssignClaimToRole,
  useGetRoleClaim,
} from 'src/services/roleManagement/roleManagement.service';
import { skipToken } from '@tanstack/react-query';
import { useGetPositionById } from 'src/services/position/position.service';

// ----------------------------------------------------------------------

export function AssignClaimToRolesNewEditForm({ currentRoleId, open, onClose, onRefetch }) {
  // Translate Hook For Different Languages
  const { t: t_roleManagement } = useTranslate('roleManagement');
  const { t: t_common } = useTranslate();

  // AssignClaim  To Role Hook Api
  const assignClaimToRole = useAssignClaimToRole();
  const getPositionById = useGetPositionById();
  // Get Data For Select Box Fields
  const { data: getClaimType, isLoading: isLoadingClaimTypes } = useGetClaimType();
  const allClaimTypes = getClaimType?.items || [];

  const claimTypeOption = allClaimTypes?.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  const [currentData, setCurrentData] = useState();
  const roleManagementId = currentRoleId?.id;

  useEffect(() => {
    if (roleManagementId) {
      getPositionById(roleManagementId).then((res) => {
        setCurrentData(res);
      });
    }
  }, [roleManagementId]);

  // Required Validation For Form Fields
  const RoleSchema = zod.object({
    claimType: zod.string().min(1, {
      message: t_roleManagement('formValidationErrors.claimType.required'),
    }),
    claimIds: zod.array(zod.string()).min(1, {
      message: t_roleManagement('formValidationErrors.claims.required'),
    }),
  });

  // Form Field Default Values
  const defaultValues = useMemo(
    () => ({
      claimType: currentData?.claimType || '',
      claimIds: currentData?.claimIds || [],
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
    getValues,
  } = methods;

  const claimTypeValue = watch('claimType');
  const claimIdsValue = watch('claimIds');
  const values = watch();

  // Get RoleClaim With RoleId
  const roleId = currentRoleId;

  const roleClaimArg = roleId ? roleId : skipToken;

  const {
    data: claimsData,
    isLoading: isLoadingClaims,
    isFetching: isFetchingClaims,
    error: claimsError,
    refetch: refetchClaims,
  } = useGetClaim(claimTypeValue);
  const { data: roleClaimsData } = useGetRoleClaim(roleClaimArg);

  const allClaims = claimsData?.items || [];

  // Role Claim Select Box Display
  const claimOptions = useMemo(() => {
    return allClaims.map((claim) => ({
      id: claim.id,
      name: claim.name || claim.value || `Claim ${claim.id}`,
    }));
  }, [allClaims]);

  // Set Default Value TO Role Claim Select Box Fields
  const selectedClaimObjects = useMemo(() => {
    return claimOptions.filter(
      (claim) => Array.isArray(claimIdsValue) && claimIdsValue.includes(claim.id)
    );
  }, [claimOptions, claimIdsValue]);

  // Insert/Update Date
  const onSubmit = handleSubmit(async (data) => {
    try {
      const obj = {
        claimIds: values.claimIds,
        roleId: currentRoleId,
      };

      await assignClaimToRole.mutateAsync(obj);
      toast.success(t_roleManagement('toastMessages.createRoleManagementSuccess'));

      onClose();
      onRefetch();
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error.message || t_common('errors.unknownError'));
    }
  });

  // Reset ClaimIds When ClaimType Changed
  useEffect(() => {
    if (claimTypeValue && claimTypeValue !== getValues('claimType')) {
      setValue('claimIds', [], { shouldValidate: true });
    }
  }, [claimTypeValue, setValue, getValues]);

  useEffect(() => {
    if (open && currentData) {
      reset({
        claimType: currentData?.claimType || '',
        claimIds: currentData?.claimIds || [],
      });
    }
  }, [currentData, open, reset]);

  useEffect(() => {
    if (!open) {
      reset({
        claimType: '',
        claimIds: [],
      });
    }
  }, [open, reset]);

  const prevClaimTypeRef = useRef(null);

  useEffect(() => {
    if (prevClaimTypeRef.current && prevClaimTypeRef.current !== claimTypeValue) {
      setValue('claimIds', [], { shouldValidate: true });
    }

    prevClaimTypeRef.current = claimTypeValue;
  }, [claimTypeValue, setValue]);

  useEffect(() => {
    if (!claimTypeValue || !roleClaimsData?.items?.length) return;

    const relatedRoleClaims = roleClaimsData.items.filter(
      (rc) => rc.claimType?.name === claimTypeValue
    );

    if (!relatedRoleClaims.length) return;

    setValue(
      'claimIds',
      relatedRoleClaims.map((rc) => rc.id),
      { shouldValidate: true }
    );
  }, [claimTypeValue, roleClaimsData, setValue]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">
        {currentRoleId
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
                <Field.Select
                  name="claimType"
                  label="نوع دسترسی"
                  data={claimTypeOption}
                  displayExp="label"
                  valueExp="value"
                />

                <Controller
                  name="claimIds"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Autocomplete
                      multiple
                      disabled={!claimTypeValue || isLoadingClaims}
                      options={claimOptions}
                      getOptionLabel={(option) => option.name || `Claim ${option.id}`}
                      value={selectedClaimObjects}
                      onChange={(_, newValue) => {
                        // استخراج فقط IDها از آبجکت‌های انتخاب شده
                        const newClaimIds = newValue.map((claim) => claim.id);
                        field.onChange(newClaimIds);
                      }}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      loading={isLoadingClaims || isFetchingClaims}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="دسترسی‌ها"
                          error={!!error}
                          helperText={error?.message}
                          placeholder={
                            claimTypeValue ? 'انتخاب دسترسی‌ها' : 'ابتدا نوع دسترسی را انتخاب کنید'
                          }
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isLoadingClaims || isFetchingClaims ? (
                                  <Typography>s</Typography>
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            {...getTagProps({ index })}
                            key={option.id}
                            label={option.name}
                            size="small"
                          />
                        ))
                      }
                    />
                  )}
                />

                <Box display="flex" justifyContent="flex-end" gap={2} sx={{ my: 2 }}>
                  <Button
                    type="submit"
                    color="success"
                    variant="contained"
                    loading={isSubmitting}
                    size="small"
                  >
                    {currentRoleId ? t_common('button.update') : t_common('button.create')}
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
