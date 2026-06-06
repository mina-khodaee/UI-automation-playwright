'use client';

import { z as zod } from 'zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Divider,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  Chip,
  Paper,
  TableContainer,
} from '@mui/material';
import { FiX, FiUser, FiEye, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useTranslate } from 'src/locales';
import { Form, Field } from 'src/components/hook-form';
// API Hooks
import { useGetPersonnels } from 'src/services/personnels/personnels.servise';
import { useGetSites } from 'src/services/siteManagement/site.service';
import { useGetUserRoles } from 'src/services/account-management/account-management.service';
import { useGetRoleClaim } from 'src/services/roleManagement/roleManagement.service';
import { useGetPositionClaim } from 'src/services/position/position.service';

// ----------------------------------------------------------------------
export function ExceptionFilters({ open, onClose }) {
  const { t } = useTranslate();

  const [openRows, setOpenRows] = useState({});

  const exceptionUsers = [
    {
      id: '1',
      userName: 'علی محمدی',
      personnelCode: 'EMP-001',
      permissions: [
        { id: 'p1', permissionName: 'مشاهده کاربران', type: 'نقش' },
        { id: 'p2', permissionName: 'ویرایش گزارشات', type: 'سمت' },
      ],
    },
    {
      id: '2',
      userName: 'رضا احمدی',
      personnelCode: 'EMP-002',
      permissions: [{ id: 'p3', permissionName: 'حذف محصولات', type: 'نقش' }],
    },
  ];

  // ✅ Schema
  const ExceptionSchema = zod.object({
    userId: zod.string().min(1, 'انتخاب پرسنل الزامی است'),
    siteId: zod.string().min(1, 'انتخاب مرکز الزاری است'),
    selectedRoles: zod.array(zod.string()).optional(),
    selectedPositions: zod.array(zod.string()).optional(),
    rolePermissions: zod.array(zod.string()).optional(),
    positionPermissions: zod.array(zod.string()).optional(),
  });

  // ✅ default values
  const defaultValues = useMemo(
    () => ({
      userId: '',
      siteId: '',
      selectedRoles: [],
      selectedPositions: [],
      rolePermissions: [],
      positionPermissions: [],
    }),
    []
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(ExceptionSchema),
    defaultValues,
  });

  const { reset, handleSubmit, watch, setValue } = methods;

  // ✅ Watch values
  const selectedUserId = watch('userId');
  const selectedSiteId = watch('siteId');
  const selectedRoles = watch('selectedRoles');
  const selectedPositions = watch('selectedPositions');

  // ✅ Search term for personnel
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ API: Personnel search
  const { data: personsData, isLoading: personsLoading } = useGetPersonnels(
    selectedUserId ? null : searchTerm
  );

  // ✅ API: Sites
  const { data: sitesData, isLoading: sitesLoading } = useGetSites(
    selectedSiteId ? null : searchTerm
  );
  const getAllSites = sitesData?.items || [];
  const sites = getAllSites.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const { data: userRolesData, isLoading: userRolesLoading } = useGetUserRoles(
    selectedUserId && selectedSiteId
      ? { UserId: selectedUserId, SiteId: selectedSiteId }
      : undefined
  );

  const mockPositions = [
    { id: 'pos-1', title: 'مدیر' },
    { id: 'pos-2', title: 'کارشناس' },
    { id: 'pos-3', title: 'نگهبان' },
  ];

  const { data: roleClaimsData, isLoading: roleClaimsLoading } = useGetRoleClaim(
    selectedRoles && selectedRoles.length > 0 ? { UserId: selectedUserId } : undefined
  );

  const { data: positionClaimsData, isLoading: positionClaimsLoading } = useGetPositionClaim(
    selectedPositions && selectedPositions.length > 0 ? { UserId: selectedUserId } : undefined
  );

  const personnelOptions = useMemo(
    () =>
      personsData?.items?.map((item) => ({
        label: `${item.firstName} ${item.lastName}`,
        value: item.id,
      })) || [],
    [personsData]
  );

  const userRolesOptions = useMemo(
    () =>
      userRolesData?.items?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [],
    [userRolesData]
  );

  const rolePermissionsOptions = useMemo(
    () =>
      roleClaimsData?.map((item) => ({
        label: item.displayValue || item.title,
        value: item.id,
      })) || [],
    [roleClaimsData]
  );

  const positionPermissionsOptions = useMemo(
    () =>
      positionClaimsData?.map((item) => ({
        label: item.displayValue || item.title,
        value: item.id,
      })) || [],
    [positionClaimsData]
  );

  // ✅ Submit
  const onSubmit = handleSubmit(async (formData) => {
    const payload = {
      userId: formData.userId,
      siteId: formData.siteId,
      claimIds: [...(formData.rolePermissions || []), ...(formData.positionPermissions || [])],
    };
  });

  // ✅ Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset(defaultValues);
      setOpenRows({});
    }
  }, [open, defaultValues, reset]);

  // ✅ Clear dependent fields when personnel or site changes
  useEffect(() => {
    setValue('selectedRoles', []);
    setValue('selectedPositions', []);
    setValue('rolePermissions', []);
    setValue('positionPermissions', []);
  }, [selectedUserId, selectedSiteId, setValue]);

  // ✅ Clear permission fields when roles or positions change
  useEffect(() => {
    setValue('rolePermissions', []);
  }, [selectedRoles, setValue]);

  useEffect(() => {
    setValue('positionPermissions', []);
  }, [selectedPositions, setValue]);

  // ✅ تغییر ردیف‌های مستر
  const toggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FiUser />
          <Typography variant="h6" fontWeight="bold">
            مدیریت سلب دسترسی
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <FiX />
        </IconButton>
      </DialogTitle>
      <Divider />
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
                <Field.Autocomplete
                  name="userId"
                  label="جستجوی پرسنل"
                  placeholder="نام یا کد پرسنل را وارد کنید"
                  options={personnelOptions}
                  loading={personsLoading}
                  getOptionLabel={(option) => option.label}
                  onInputChange={(_, value) => setSearchTerm(value)}
                  size="small"
                />

                <Field.Select
                  name="siteId"
                  data={sites}
                  displayExp="label"
                  valueExp="value"
                  label="مرکز"
                  size="small"
                />
              </Box>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
                sx={{ mt: 3 }}
              >
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    نقش‌ها
                    {!selectedUserId || !selectedSiteId
                      ? ' (ابتدا پرسنل و مرکز را انتخاب کنید)'
                      : ''}
                  </Typography>
                  <Field.Autocomplete
                    name="selectedRoles"
                    label="انتخاب نقش"
                    placeholder="نقش را انتخاب کنید"
                    options={userRolesOptions}
                    loading={userRolesLoading}
                    multiple
                    disabled={!selectedUserId || !selectedSiteId}
                    getOptionLabel={(option) => option.label}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    سمت‌ها
                    {!selectedUserId || !selectedSiteId
                      ? ' (ابتدا پرسنل و مرکز را انتخاب کنید)'
                      : ''}
                  </Typography>
                  <Field.Autocomplete
                    name="selectedPositions"
                    label="انتخاب سمت"
                    placeholder="سمت را انتخاب کنید"
                    options={mockPositions}
                    multiple
                    disabled={!selectedUserId || !selectedSiteId}
                    getOptionLabel={(option) => option.label}
                    size="small"
                  />
                </Box>
              </Box>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
                sx={{ mt: 3 }}
              >
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    دسترسی‌های نقش
                    {!selectedRoles || selectedRoles.length === 0 ? ' (ابتدا نقش انتخاب کنید)' : ''}
                  </Typography>
                  <Field.Autocomplete
                    name="rolePermissions"
                    label="انتخاب دسترسی نقش"
                    placeholder="دسترسی را انتخاب کنید"
                    options={rolePermissionsOptions}
                    loading={roleClaimsLoading}
                    multiple
                    disabled={!selectedRoles || selectedRoles.length === 0}
                    getOptionLabel={(option) => option.label}
                    size="small"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    دسترسی‌های سمت
                    {!selectedPositions || selectedPositions.length === 0
                      ? ' (ابتدا سمت انتخاب کنید)'
                      : ''}
                  </Typography>
                  <Field.Autocomplete
                    name="positionPermissions"
                    label="انتخاب دسترسی سمت"
                    placeholder="دسترسی را انتخاب کنید"
                    options={positionPermissionsOptions}
                    loading={positionClaimsLoading}
                    multiple
                    disabled={!selectedPositions || selectedPositions.length === 0}
                    getOptionLabel={(option) => option.label}
                    size="small"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Stack justifyContent="flex-end" direction="row" gap={1} sx={{ mt: 3 }}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              size="small"
              startIcon={<FiEye />}
            >
              ذخیره تغییرات
            </Button>
          </Stack>
        </Form>

        {}
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'grey.100' }}>
              <TableRow>
                <TableCell width={50} />
                <TableCell>نام کاربر</TableCell>
                <TableCell>کد پرسنلی</TableCell>
                <TableCell>تعداد دسترسی‌های سلب‌شده</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {exceptionUsers.map((user) => (
                <>
                  <TableRow hover onClick={() => toggleRow(user.id)} sx={{ cursor: 'pointer' }}>
                    <TableCell>
                      <IconButton size="small">
                        {openRows[user.id] ? <FiChevronUp /> : <FiChevronDown />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.personnelCode}</TableCell>
                    <TableCell>
                      <Chip label={user.permissions.length} color="error" size="small" />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={4} sx={{ p: 0 }}>
                      <Collapse in={!!openRows[user.id]}>
                        <Box p={2}>
                          <Typography variant="body2" fontWeight="bold" mb={1}>
                            دسترسی‌های سلب‌شده:
                          </Typography>
                          {user.permissions.map((perm) => (
                            <Box key={perm.id} display="flex" gap={2} alignItems="center" py={0.5}>
                              <Chip
                                label={perm.type}
                                size="small"
                                variant="outlined"
                                color={perm.type === 'نقش' ? 'primary' : 'warning'}
                              />
                              <Typography variant="body2">{perm.permissionName}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
