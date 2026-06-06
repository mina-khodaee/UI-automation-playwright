'use client';

import { z as zod } from 'zod';
import { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Typography,
  Checkbox,
  IconButton,
  Collapse,
} from '@mui/material';
import { FiEye, FiLayers, FiSearch } from 'react-icons/fi';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
} from 'react-icons/md';
import { Form, Field } from 'src/components/hook-form';
import { useAuthContext } from '@repo/ui/auth-hooks';

// ----------------------------------------------------------------------
// API Hooks
import { useGetPersonnels } from 'src/services/personnels/personnels.servise';
import { useGetUserClaims } from 'src/services/account-management/account-management.service';

// API Hooks
import { useGetRoles, useGetRoleClaim } from 'src/services/roleManagement/roleManagement.service';

// API Hooks
import { useGetPositions, useGetPositionClaim } from 'src/services/position/position.service';

import { useGetSitesWithPagination } from 'src/services/siteManagement/site.service';
// API Hooks
import { useGetClaimTypesWithClaims } from 'src/services/claim-management/claim-management.service';
import { SpecialUserClaims } from './special-user-claims';
import { ExceptionFilters } from './eception-filters';
import log from 'eslint-plugin-react/lib/util/log';

// ----------------------------------------------------------------------

export function AccessPermissionNewEditForm() {
  const auth = useAuthContext();
  const [selectedType, setSelectedType] = useState('person');
  const [searchTerm, setSearchTerm] = useState('');
  const [rolePosition, setRolePosition] = useState('');
  const [rightSearchTerm, setRightSearchTerm] = useState('');
  const [leftSearchTerm, setLeftSearchTerm] = useState('');

  const accessTypeOptions = [
    { value: 'person', label: 'شخص' },
    { value: 'group', label: 'گروه' },
    { value: 'position', label: 'سمت' },
  ];

  const { siteClaims } = auth;

  console.log('siteClaims:', siteClaims);

  const userInfoRoleClaims = siteClaims[0]?.roleClaims.find(
    (item) => item.normalizedName === 'SUPERADMIN'
  );

  const userInfoSiteOptions = siteClaims?.map((item) => ({
    label: item?.name,
    value: item?.id,
  }));

  const { data: personsData, isLoading: personsLoading } = useGetPersonnels(
    selectedType === 'person' ? searchTerm : null
  );

  const personOptions = personsData?.items?.map((item) => ({
    label: `${item.firstName} ${item.lastName}`,
    value: item.id,
  }));

  const { data: sitesData, isLoading: sitesLoading } = useGetSitesWithPagination({ searchTerm });
  const getAllSites = sitesData?.items;

  console.log('sitesData', sitesData);

  const sites = getAllSites?.map((s) => ({
    label: s.name,
    value: s.id,
  }));

  const { data: rolesData, isLoading: rolesLoading } = useGetRoles({
    searchTerm,
  });

  const roleOptions = rolesData?.items?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const { data: positionsData, isLoading: positionsLoading } = useGetPositions({
    searchTerm,
  });

  const positionOptions = positionsData?.items?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const { data: claimsData, isLoading: claimsLoading } = useGetClaimTypesWithClaims();

  const permissions = useMemo(() => {
    if (!claimsData?.items) return [];

    return claimsData.items.map((item, index) => ({
      id: item.id || index,
      title: item.displayValue || item.name,
      children:
        item.claims?.map((claim, childIndex) => ({
          id: claim.id || `${item.id}-${childIndex}`,
          name: claim.displayValue || claim.name || claim.value || String(claim),
          parentId: item.id || index, // اضافه کردن parentId برای شناسایی والد
        })) || [],
    }));
  }, [claimsData]);

  // State for assigned permissions (دسترسی‌های منصوب)
  const [assignedPermissions, setAssignedPermissions] = useState([]);

  // حالت جدید: ذخیره آیتم‌های انتخاب شده به صورت مجزا (هم والد و هم فرزند)
  const [selectedLeftItems, setSelectedLeftItems] = useState(new Set()); // استفاده از Set برای انتخاب‌های سمت چپ
  const [selectedRightItems, setSelectedRightItems] = useState(new Set()); // استفاده از Set برای انتخاب‌های سمت راست

  // حالت جدید: ذخیره آیتم‌های باز شده
  const [openItems, setOpenItems] = useState([]);

  // تابع برای بررسی اینکه آیا یک آیتم (والد یا فرزند) انتخاب شده است
  const isItemSelected = (itemId, side) => {
    const selectedSet = side === 'left' ? selectedLeftItems : selectedRightItems;
    return selectedSet.has(itemId);
  };

  // تابع برای تغییر وضعیت انتخاب یک آیتم (والد یا فرزند)
  const toggleItemSelection = (itemId, side) => {
    const setSelected = side === 'left' ? setSelectedLeftItems : setSelectedRightItems;

    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getSelectedLeftItemsObjects = () => {
    const selectedObjects = [];

    filteredLeftPermissions.forEach((parent) => {
      // بررسی خود والد
      if (selectedLeftItems.has(parent.id)) {
        selectedObjects.push(parent);
      }
      // بررسی فرزندان
      parent.children?.forEach((child) => {
        if (selectedLeftItems.has(child.id)) {
          selectedObjects.push(child);
        }
      });
    });

    return selectedObjects;
  };

  // تابع برای دریافت آیتم‌های انتخاب شده از سمت راست
  const getSelectedRightItemsObjects = () => {
    const selectedObjects = [];

    assignedPermissions.forEach((parent) => {
      // بررسی خود والد
      if (selectedRightItems.has(parent.id)) {
        selectedObjects.push(parent);
      }
      // بررسی فرزندان
      parent.children?.forEach((child) => {
        if (selectedRightItems.has(child.id)) {
          selectedObjects.push(child);
        }
      });
    });

    return selectedObjects;
  };

  // Filter permissions for left box (همه دسترسی‌ها)
  const filteredLeftPermissions = useMemo(() => {
    let availablePermissions = permissions.filter(
      (item) => !assignedPermissions.some((assigned) => assigned.id === item.id)
    );

    if (!leftSearchTerm.trim()) return availablePermissions;

    return availablePermissions.filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(leftSearchTerm.toLowerCase());
      const childrenMatch = item.children.some((child) =>
        child.name?.toLowerCase().includes(leftSearchTerm.toLowerCase())
      );
      return titleMatch || childrenMatch;
    });
  }, [permissions, assignedPermissions, leftSearchTerm]);

  // Filter permissions for right box (دسترسی‌های منصوب)
  const filteredRightPermissions = useMemo(() => {
    if (!rightSearchTerm.trim()) return assignedPermissions;

    return assignedPermissions.filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(rightSearchTerm.toLowerCase());
      const childrenMatch = item.children.some((child) =>
        child.name?.toLowerCase().includes(rightSearchTerm.toLowerCase())
      );
      return titleMatch || childrenMatch;
    });
  }, [assignedPermissions, rightSearchTerm]);

  // Transfer functions
  const transferToRight = () => {
    // انتقال از چپ به راست (همه دسترسی‌ها -> دسترسی‌های منصوب)
    const selectedLeftObjects = getSelectedLeftItemsObjects();
    if (selectedLeftObjects.length === 0) return;

    setAssignedPermissions((prev) => [...prev, ...selectedLeftObjects]);
    setSelectedLeftItems(new Set()); // پاک کردن انتخاب‌های سمت چپ بعد از انتقال
  };

  const transferToLeft = () => {
    // انتقال از راست به چپ (دسترسی‌های منصوب -> همه دسترسی‌ها)
    const selectedRightObjects = getSelectedRightItemsObjects();
    if (selectedRightObjects.length === 0) return;

    setAssignedPermissions((prev) =>
      prev.filter((item) => !selectedRightObjects.some((selected) => selected.id === item.id))
    );
    setSelectedRightItems(new Set()); // پاک کردن انتخاب‌های سمت راست بعد از انتقال
  };

  const transferAllToRight = () => {
    // انتقال همه از چپ به راست
    setAssignedPermissions((prev) => [...prev, ...filteredLeftPermissions]);
    setSelectedLeftItems(new Set());
  };

  const transferAllToLeft = () => {
    // انتقال همه از راست به چپ
    setAssignedPermissions([]);
    setSelectedRightItems(new Set());
  };

  const toggleItem = (itemId) => {
    setOpenItems((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    );
  };

  console.log('permissions formatted:', permissions);

  const { data: roleClaimData } = useGetRoleClaim(selectedType === 'group' ? searchTerm : null);
  const getAllClaimData = roleClaimData?.items || [];

  // Schema
  const AccessPermissionSchema = zod.object({
    accessType: zod.string().min(1, 'نوع مجوز اجباری است'),
    targetId: zod.string().min(1, 'انتخاب مورد نظر اجباری است'),
    siteId: zod.string().min(1, 'مرکز اجباری است'),
  });

  const defaultValues = useMemo(
    () => ({
      accessType: '',
      targetId: '',
      siteId: '',
    }),
    []
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [openExcludeModal, setOpenExcludeModal] = useState(false);

  const handleShowDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const methods = useForm({
    mode: 'onBlur',
    resolver: zodResolver(AccessPermissionSchema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue, resetField, control } = methods;
  const onSubmit = handleSubmit((data) => {});
  const watchedTargetId = watch('targetId');
  const watchedAccessType = watch('accessType');

  const { data: userClaimsData, isLoading: userClaimsLoading } = useGetUserClaims(
    watchedTargetId ? { UserId: watchedTargetId } : {}
  );

  const { data: roleClaimsData, isLoading: roleClaimsLoading } = useGetRoleClaim(
    watchedTargetId && selectedType === 'group' ? { UserId: watchedTargetId } : {}
  );

  const { data: positionClaimsData, isLoading: positionClaimsLoading } = useGetPositionClaim(
    watchedTargetId && selectedType === 'position' ? { UserId: watchedTargetId } : {}
  );

  useEffect(() => {
    if (watchedAccessType !== undefined && watchedAccessType !== '') {
      setSelectedType(watchedAccessType);
      setValue('targetId', '');
      setSearchTerm('');
      resetField('targetId');
    }
  }, [watchedAccessType]);

  const getSecondFieldConfig = () => {
    switch (selectedType) {
      case 'person':
        return {
          label: 'نام شخص',
          options: personOptions,
          loading: personsLoading,
        };
      case 'group':
        return {
          label: 'گروه دسترسی',
          options: roleOptions,
          loading: rolesLoading,
        };
      case 'position':
        return {
          label: 'سمت',
          options: positionOptions,
          loading: positionsLoading,
        };
      default:
        return {
          label: 'انتخاب کنید',
          options: [],
          loading: false,
        };
    }
  };

  const secondFieldConfig = getSecondFieldConfig();

  const handleShowPermissions = () => {
    // وقتی دکمه "نمایش مجوزها" زده میشه، دسترسی‌های منصوب رو از API بگیر
    let loadedPermissions = [];

    switch (selectedType) {
      case 'person':
        loadedPermissions = userClaimsData || [];
        break;
      case 'group':
        loadedPermissions = roleClaimsData || [];
        break;
      case 'position':
        loadedPermissions = positionClaimsData || [];
        break;
      default:
        loadedPermissions = [];
    }

    setAssignedPermissions(loadedPermissions);
    // پاک کردن انتخاب‌ها
    setSelectedLeftItems(new Set());
    setSelectedRightItems(new Set());
  };

  const IconButtonStyle = {
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.08)',
    height: '40px',
    width: '40px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#e8e8e8',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transform: 'translateY(-2px)',
    },
  };

  return (
    <Card sx={{ p: 3, m: 3, borderRadius: 3 }}>
      <Grid sx={{ p: 0 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Box display="flex" justifyContent="space-between" sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              مدیریت دسترسی
            </Typography>

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FiLayers />}
                onClick={handleShowDialog}
                sx={{
                  height: 40,
                  minWidth: 'auto',
                  px: 2,
                }}
              >
                نمایش لیست کاربران با دسترسی ویژه
              </Button>

              <Button
                variant="outlined"
                size="small"
                startIcon={<FiLayers />}
                onClick={() => setOpenExcludeModal(true)}
                sx={{
                  height: 40,
                  minWidth: 'auto',
                  px: 2,
                }}
              >
                مدیریت سلب دسترسی
              </Button>
            </Box>
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{
              xs: '1fr',
              md: 'repeat(3, 1fr) auto',
            }}
            gap={2}
            sx={{ mb: 4, alignItems: 'flex-end' }}
          >
            <Box sx={{ minHeight: 70 }}>
              <Field.Select
                name="accessType"
                label="مجوز دسترسی به"
                size="small"
                data={accessTypeOptions}
                valueExp="value"
                displayExp="label"
              />
            </Box>

            <Box sx={{ minHeight: 70 }}>
              <Field.Select
                name="targetId"
                label={secondFieldConfig.label}
                placeholder={`جستجوی ${secondFieldConfig.label}`}
                data={secondFieldConfig.options}
                loading={secondFieldConfig.loading}
                displayExp="label"
                valueExp="value"
                freeSolo
                // onInputChange={(_, value) => setSearchTerm(value)}
                size="small"
              />
            </Box>
            <Box sx={{ minHeight: 70 }}>
              <Field.Select
                name="siteId"
                data={userInfoRoleClaims ? sites : (userInfoSiteOptions ?? [])}
                displayExp="label"
                valueExp="value"
                label="مراکز"
                size="small"
              />
            </Box>
            <Box sx={{ minHeight: 70 }}>
              <Button
                variant="outlined"
                size="small"
                type="submit"
                startIcon={<FiEye />}
                onClick={handleShowPermissions}
                sx={{
                  height: 40,
                  minWidth: 'auto',
                  px: 2,
                }}
              >
                نمایش مجوزها
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2} alignItems="stretch">
            <Grid sx={{ width: '44%' }} size={{ xs: 12, md: 5 }}>
              <Typography sx={{ mb: 1, fontWeight: 500 }}>همه دسترسی ها</Typography>
              <Card
                variant="outlined"
                sx={{
                  height: 500,
                  borderRadius: 2,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Field.Text
                  name="leftSearch"
                  placeholder="جستجوی دسترسی"
                  size="small"
                  value={leftSearchTerm}
                  onChange={(e) => setLeftSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: <FiSearch size={18} />,
                  }}
                />
                <Box sx={{ overflowY: 'auto', flex: 1 }}>
                  {claimsLoading ? (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                      در حال بارگذاری...
                    </Typography>
                  ) : filteredLeftPermissions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                      دسترسی یافت نشد
                    </Typography>
                  ) : (
                    filteredLeftPermissions.map((item) => (
                      <Box key={item.id}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            py: 1,
                            px: 1,
                            borderRadius: 1,
                            backgroundColor: 'grey.100',
                            mb: 1,
                            cursor: 'pointer',
                          }}
                          onClick={() => toggleItem(item.id)}
                        >
                          <Stack direction="row" alignItems="center" gap={1}>
                            <MdKeyboardArrowDown />
                            <Typography variant="body2">{item.title}</Typography>
                          </Stack>
                          <Checkbox
                            size="small"
                            checked={isItemSelected(item.id, 'left')}
                            onChange={() => toggleItemSelection(item.id, 'left')}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Box>
                        <Collapse in={openItems.includes(item.id)}>
                          {item.children.map((child) => (
                            <Box
                              key={child.id}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{
                                pl: 4,
                                py: 1,
                              }}
                            >
                              <Typography variant="body2">{child.name}</Typography>
                              <Checkbox
                                size="small"
                                checked={isItemSelected(child.id, 'left')}
                                onChange={() => toggleItemSelection(child.id, 'left')}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </Box>
                          ))}
                        </Collapse>
                      </Box>
                    ))
                  )}
                </Box>
              </Card>
            </Grid>

            {/* دکمه‌های انتقال */}
            <Grid
              item
              xs={12}
              md={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ width: '9%' }}
            >
              <Stack spacing={2}>
                <IconButton sx={IconButtonStyle} onClick={transferAllToLeft}>
                  <MdKeyboardDoubleArrowLeft />
                </IconButton>
                <IconButton sx={IconButtonStyle} onClick={transferToLeft}>
                  <MdKeyboardArrowLeft />
                </IconButton>
                <IconButton sx={IconButtonStyle} onClick={transferToRight}>
                  <MdKeyboardArrowRight />
                </IconButton>
                <IconButton sx={IconButtonStyle} onClick={transferAllToRight}>
                  <MdKeyboardDoubleArrowRight />
                </IconButton>
              </Stack>
            </Grid>

            {/* باکس راست - دسترسی‌های منصوب */}
            <Grid sx={{ width: '44%' }} size={{ xs: 12, md: 5 }}>
              <Typography sx={{ mb: 1, fontWeight: 500 }}>دسترسی‌های منصوب</Typography>
              <Card
                variant="outlined"
                sx={{
                  height: 500,
                  borderRadius: 2,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Field.Text
                  name="rightSearch"
                  placeholder="جستجوی دسترسی"
                  size="small"
                  value={rightSearchTerm}
                  onChange={(e) => setRightSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: <FiSearch size={18} />,
                  }}
                />

                <Box sx={{ overflowY: 'auto', flex: 1 }}>
                  {claimsLoading ? (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                      در حال بارگذاری...
                    </Typography>
                  ) : filteredRightPermissions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                      دسترسی یافت نشد
                    </Typography>
                  ) : (
                    filteredRightPermissions.map((item) => (
                      <Box key={item.id}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          sx={{
                            py: 1,
                            px: 1,
                            borderRadius: 1,
                            backgroundColor: 'grey.100',
                            mb: 1,
                            cursor: 'pointer',
                          }}
                          onClick={() => toggleItem(item.id)}
                        >
                          <Stack direction="row" alignItems="center" gap={1}>
                            <MdKeyboardArrowDown />
                            <Typography variant="body2">{item.title}</Typography>
                          </Stack>
                          <Checkbox
                            size="small"
                            checked={isItemSelected(item.id, 'right')}
                            onChange={() => toggleItemSelection(item.id, 'right')}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Box>
                        <Collapse in={openItems.includes(item.id)}>
                          {item.children.map((child) => (
                            <Box
                              key={child.id}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ pl: 4, py: 1 }}
                            >
                              <Typography variant="body2">{child.name}</Typography>
                              <Checkbox
                                size="small"
                                checked={isItemSelected(child.id, 'right')}
                                onChange={() => toggleItemSelection(child.id, 'right')}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </Box>
                          ))}
                        </Collapse>
                      </Box>
                    ))
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>

          <Stack direction="row" justifyContent="flex-start" sx={{ mt: 4 }}>
            <Button variant="contained" size="small" type="submit">
              ذخیره تغییرات
            </Button>
          </Stack>
        </Form>
      </Grid>
      <SpecialUserClaims open={openDialog} onClose={handleCloseDialog} />
      <ExceptionFilters open={openExcludeModal} onClose={() => setOpenExcludeModal(false)} />
    </Card>
  );
}
