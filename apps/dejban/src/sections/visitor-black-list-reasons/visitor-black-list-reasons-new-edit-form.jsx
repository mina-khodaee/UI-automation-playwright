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
import { useCreateVisitorBlackListReason } from 'src/services/visitor-black-list-reason/visitor-black-list-reason.service';

// ----------------------------------------------------------------------
export function VisitorBlackListReasonNewEditForm({ open, onClose, onRefetch }) {
  const { t: t_common } = useTranslate();
  const { t: t_visitorBlackListReason } = useTranslate('visitor-black-list-reason');
  const createBlockUsers = useCreateVisitorBlackListReason();

  const NewPositionSchema = zod.object({
    name: zod.string().min(1, t_visitorBlackListReason('formValidationErrors.name.required')),
    description: zod.string().nullable().optional(),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
    }),
    []
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewPositionSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await createBlockUsers.mutateAsync(data);
      toast.success(t_visitorBlackListReason('toastMessages.create'));
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
        name: '',
        description: '',
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle textAlign="center">
        {t_visitorBlackListReason('title.insertBlockUsers')}
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
                  label={t_visitorBlackListReason('formsInputs.name')}
                  inputProps={{ type: 'text' }}
                  size="small"
                />
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
                  label={t_visitorBlackListReason('formsInputs.description')}
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
              {t_common('button.create')}
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
