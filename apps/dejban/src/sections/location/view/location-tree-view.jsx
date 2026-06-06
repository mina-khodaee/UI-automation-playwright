// 'use client'

// import React, { useMemo, useState, useCallback } from 'react';
// import { Box, Paper, Typography, Button, IconButton, Tooltip, Stack, } from '@mui/material';
// import { useForm } from 'react-hook-form';
// import { TbMapPinPlus } from 'react-icons/tb';
// import { MdDelete } from 'react-icons/md';
// import { useCreateCities, useCreateCountries, useCreateProvinces, useDeleteCity, useDeleteCountry, useDeleteProvience, useGetLocationTreeList, useUpdateCity, useUpdateCountry, useUpdateProvience } from 'src/services/location/location.service';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { DashboardContent } from '@repo/ui/layouts-dashboard';
// import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai';
// import EditLocationDialog from '../location-edit-form';
// import AddLocationDialog from '../location-new-form';
// import { IoCloseCircleOutline } from "react-icons/io5";
// import { toast } from 'sonner';

// // کامپوننت آیتم درختی سفارشی
// const CustomTreeItem = ({ node, onSelect }) => {
//     const [expanded, setExpanded] = useState(false);

//     const handleToggle = (e) => {
//         e.stopPropagation();
//         setExpanded(!expanded);
//     };

//     const handleClick = (e) => {
//         e.stopPropagation();
//         onSelect(node);
//     };

//     return (
//         <Box sx={{ ml: 2, mb: 0.5 }}>
//             <Box
//                 onClick={handleClick}
//                 sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     p: 1,
//                     borderRadius: 1,
//                     cursor: 'pointer',
//                     '&:hover': {
//                         backgroundColor: 'action.hover',
//                     },
//                     bgcolor: node.isSelected ? 'primary.lighter' : 'transparent',
//                     border: node.isSelected ? '1px solid' : 'none',
//                     borderColor: 'primary.main',
//                 }}
//             >
//                 {node.children && node.children.length > 0 && (
//                     <IconButton size="small" onClick={handleToggle}>
//                         {expanded ? <AiOutlineDown /> : <AiOutlineRight />}
//                     </IconButton>
//                 )}
//                 <Typography sx={{ ml: 1 }}>{node.label}</Typography>
//             </Box>

//             {expanded && node.children && node.children.length > 0 && (
//                 <Box sx={{ ml: 3 }}>
//                     {node.children.map((child) => (
//                         <CustomTreeItem
//                             key={child.id}
//                             node={child}
//                             onSelect={onSelect}
//                         />
//                     ))}
//                 </Box>
//             )}
//         </Box>
//     );
// };


// // تابع بازگشتی برای ساخت درخت
// const buildTree = (data, selectedId = null) => {
//     if (!data || data.length === 0) return [];

//     const tree = [];

//     // کشورها (parentId = 0)
//     const countries = data.filter(item => item.parentId === 0 || item.parentId === "0" || !item.parentId);

//     countries.forEach(country => {
//         const countryNode = {
//             id: country.id,
//             label: country.name,
//             type: 'country',
//             data: country,
//             isSelected: selectedId === country.id,
//             children: [],
//         };

//         // استان‌ها
//         if (country.provinces && country.provinces.length > 0) {
//             country.provinces.forEach(province => {
//                 const provinceNode = {
//                     id: province.id,
//                     label: province.name,
//                     type: 'province',
//                     data: province,
//                     isSelected: selectedId === province.id,
//                     children: [],
//                 };

//                 // شهرها
//                 if (province.cities && province.cities.length > 0) {
//                     province.cities.forEach(city => {
//                         const cityNode = {
//                             id: city.id,
//                             label: city.name,
//                             type: 'city',
//                             data: city,
//                             isSelected: selectedId === city.id,
//                             children: [],
//                         };
//                         provinceNode.children.push(cityNode);
//                     });
//                 }

//                 countryNode.children.push(provinceNode);
//             });
//         }

//         tree.push(countryNode);
//     });

//     return tree;
// };

// export default function LocationTreeNew() {

//     // API Calls
//     const { data: apiData = [] } = useGetLocationTreeList();

//     const addCountry = useCreateCountries();
//     const addProvince = useCreateProvinces();
//     const addCity = useCreateCities();

//     // State
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [expandedItems, setExpandedItems] = useState([]);
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [dialogMode, setDialogMode] = useState('addCountry');

//     // ساختار درختی
//     const locationTree = useMemo(() => {
//         return buildTree(apiData, selectedItem?.id);
//     }, [apiData, selectedItem?.id]);

//     // Form Methods
//     const defaultValues = {
//         name: '',
//         enName: '',
//         latitude: '',
//         longitude: '',
//         phoneCode: '',
//         twoLetterCountryCode: '',
//         twoLetterLanguageCode: '',
//     };

//     const methods = useForm({
//         defaultValues,
//         mode: 'onChange',
//     });

//     const { reset, handleSubmit, setValue, watch, formState: { isSubmitting } } = methods;


//     // Handlers
//     const handleNodeSelect = useCallback((node) => {
//         setSelectedItem(node);

//         // تعیین mode برای دیالوگ
//         if (node.type === 'country') {
//             setDialogMode('addProvince');
//         } else if (node.type === 'province') {
//             setDialogMode('addCity');
//         }
//     }, []);


//     const handleOpenDialog = (mode) => {
//         setDialogMode(mode);
//         setDialogOpen(true);
//     };

//     const handleCloseDialog = () => {
//         setDialogOpen(false);
//     };

//     const handleUnSelect = () => {
//         setSelectedItem(null);
//     }


//     const handleAddLocation = async (data) => {
//         try {
//             switch (dialogMode) {
//                 case 'addCountry': {
//                     const payload = {
//                         name: data.name,
//                         enName: data.enName,
//                         parentId: 0,
//                         phoneCode: data.phoneCode,
//                         twoLetterCountryCode: data.twoLetterCountryCode,
//                         twoLetterLanguageCode: data.twoLetterLanguageCode,
//                     };

//                     // await addCountry.mutateAsync(payload).unwrap();
//                     await addCountry.mutateAsync(payload, {
//                         onSuccess: () => {
//                             toast.success('ثبت موفقیت آمیز بود.');
//                             handleCloseDialog();

//                             if (selectedItem?.id) {
//                                 setExpandedItems(prev => [...prev, selectedItem.id]);
//                             }
//                         },
//                         onError: (error) => {
//                             toast.error('ثبت موفقیت آمیز نبود.');
//                         }
//                     });
//                     break;
//                 }

//                 case 'addProvince': {
//                     const payload = {
//                         name: data.name,
//                         enName: data.enName,
//                         latitude: data.latitude,
//                         longitude: data.longitude,
//                         phoneCode: data.phoneCode,
//                         // parentId: selectedItem.id,
//                         countryId: selectedItem.id,
//                     };

//                     // await addProvince.mutateAsync(payload).unwrap();
//                     await addProvince.mutateAsync(payload, {
//                         onSuccess: () => {
//                             toast.success('ثبت موفقیت آمیز بود.');
//                             handleCloseDialog();

//                             if (selectedItem?.id) {
//                                 setExpandedItems(prev => [...prev, selectedItem.id]);
//                             }
//                         },
//                         onError: (error) => {
//                             toast.error('ثبت موفقیت آمیز نبود.');
//                         }
//                     });
//                     break;
//                 }

//                 case 'addCity': {
//                     const payload = {
//                         name: data.name,
//                         enName: data.enName,
//                         latitude: data.latitude,
//                         longitude: data.longitude,
//                         // parentId: selectedItem.id,
//                         provinceId: selectedItem.id,
//                     };

//                     // await addCity.mutateAsync(payload).unwrap();
//                     await addCity.mutateAsync(payload, {
//                         onSuccess: () => {
//                             toast.success('ثبت موفقیت آمیز بود.');
//                             handleCloseDialog();

//                             if (selectedItem?.id) {
//                                 setExpandedItems(prev => [...prev, selectedItem.id]);
//                             }
//                         },
//                         onError: (error) => {
//                             toast.error('ثبت موفقیت آمیز نبود.');
//                         }
//                     });
//                     break;
//                 }

//                 default:
//                     return;
//             }

//             handleCloseDialog();

//             if (selectedItem?.id) {
//                 setExpandedItems(prev => [...prev, selectedItem.id]);
//             }
//         } catch (error) {
//             toast.error('ثبت موفقیت آمیز نبود.')
//         }
//     };


//     const deleteCountry = useDeleteCountry();
//     const deleteProvience = useDeleteProvience();
//     const deleteCity = useDeleteCity();


//     const handleDeleteLocation = async () => {
//         if (!selectedItem) return;

//         try {
//             switch (selectedItem.type) {
//                 case 'country':
//                     await deleteCountry.mutate(selectedItem.id);
//                     break;

//                 case 'province':
//                     await deleteProvience.mutate(selectedItem.id);
//                     break;

//                 case 'city':
//                     await deleteCity.mutate(selectedItem.id);
//                     break;

//                 default:
//                     return;
//             }

//             toast.success('حذف موفقیت آمیز بود.')
//             setSelectedItem(null);

//         } catch (error) {
//             toast.warning('به دلیل وجود زیر شاخه برای این آیتم حذف امکان پذیر نیست!')
//         }
//     };


//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);

//     const updateCountry = useUpdateCountry();
//     const updateProvince = useUpdateProvience();
//     const updateCity = useUpdateCity();

//     const handleEditLocation = async (formData, item) => {
//         setIsEditing(true);

//         try {
//             switch (item.type) {
//                 case 'country': {
//                     const payload = {
//                         id: item.id,
//                         name: formData.name.trim(),
//                         enName: formData.enName?.trim() || '',
//                         phoneCode: formData.phoneCode?.trim() || '',
//                         twoLetterCountryCode: formData.twoLetterCountryCode?.trim() || '',
//                         twoLetterLanguageCode: formData.twoLetterLanguageCode?.trim() || '',
//                         countryId: item.id
//                     };

//                     // await updateCountry.mutateAsync(payload);
//                     updateCountry.mutateAsync(payload, {
//                         onSuccess: () => {
//                             toast.success('ویرایش با موفقیت انجام شد');
//                             handleCloseEditDialog();
//                             setIsEditing(false);
//                         },
//                         onError: (error) => {
//                             console.error('Update country error:', error);
//                             toast.error('ویرایش موفقیت آمیز نبود.');
//                             setIsEditing(false);
//                         }
//                     });
//                     break;
//                 }

//                 case 'province': {
//                     const payload = {
//                         id: item.id,
//                         name: formData.name.trim(),
//                         enName: formData.enName?.trim() || '',
//                         latitude: formData.latitude ?? null,
//                         longitude: formData.longitude ?? null,
//                         phoneCode: formData.phoneCode?.trim() || '',
//                         countryId: item.data.parentId,
//                         provinceId: item.id
//                     };

//                     // await updateProvince.mutateAsync(payload);
//                     updateProvince.mutateAsync(payload, {
//                         onSuccess: () => {
//                             toast.success('ویرایش با موفقیت انجام شد');
//                             handleCloseEditDialog();
//                             setIsEditing(false);
//                         },
//                         onError: (error) => {
//                             console.error('Update province error:', error);
//                             toast.error('ویرایش موفقیت آمیز نبود.');
//                             setIsEditing(false);
//                         }
//                     });
//                     break;
//                 }

//                 case 'city': {
//                     const payload = {
//                         id: item.id,
//                         name: formData.name.trim(),
//                         enName: formData.enName?.trim() || '',
//                         latitude: formData.latitude ?? null,
//                         longitude: formData.longitude ?? null,
//                         provinceId: item.data.parentId,
//                         cityId: item.id
//                     };

//                     // await updateCity.mutateAsync(payload);
//                     updateCity.mutateAsync(payload, {
//                         onSuccess: () => {
//                             toast.success('ویرایش با موفقیت انجام شد');
//                             handleCloseEditDialog();
//                             setIsEditing(false);
//                         },
//                         onError: (error) => {
//                             console.error('Update city error:', error);
//                             toast.error('ویرایش موفقیت آمیز نبود.');
//                             setIsEditing(false);
//                         }
//                     });
//                     break;
//                 }

//                 default:
//                     return;
//             }

//             handleCloseEditDialog();

//         } catch (error) {
//             toast.error('ویرایش موفقیت آمیز نبود.')
//         } finally {
//             setIsEditing(false);
//         }
//     };



//     // توابع باز و بسته کردن دیالوگ ویرایش
//     const handleOpenEditDialog = useCallback(() => {
//         if (!selectedItem) {
//             toast.warning('ابتدا یک آیتم را انتخاب کنید!')
//             return;
//         }
//         setEditDialogOpen(true);
//     }, [selectedItem]);

//     const handleCloseEditDialog = useCallback(() => {
//         setEditDialogOpen(false);
//     }, []);



//     return (
//         <DashboardContent maxWidth="xl">
//             <CustomBreadcrumbs
//                 heading="مدیریت مکان‌ها"
//                 sx={{ my: 2 }}
//             />

//             <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>

//                 <Box sx={{ flex: 1 }}>
//                     <Paper sx={{ p: 3, mb: 3 }}>
//                         <Typography variant="h6" sx={{ mb: 3 }}>
//                             {selectedItem ? selectedItem.label : 'اطلاعات انتخاب شده'}
//                         </Typography>

//                         {selectedItem ? (
//                             <Stack spacing={2}>
//                                 <Box>
//                                     <Typography variant="subtitle2" color="text.secondary">
//                                         نوع:
//                                     </Typography>
//                                     <Typography variant="body1">
//                                         {selectedItem.type === 'country' ? 'کشور' :
//                                             selectedItem.type === 'province' ? 'استان' : 'شهر'}
//                                     </Typography>
//                                 </Box>

//                                 {selectedItem.data?.enName && (
//                                     <Box>
//                                         <Typography variant="subtitle2" color="text.secondary">
//                                             نام انگلیسی:
//                                         </Typography>
//                                         <Typography variant="body1">
//                                             {selectedItem.data.enName}
//                                         </Typography>
//                                     </Box>
//                                 )}

//                                 {selectedItem.data?.latitude && selectedItem.data?.longitude && (
//                                     <Box>
//                                         <Typography variant="subtitle2" color="text.secondary">
//                                             مختصات:
//                                         </Typography>
//                                         <Typography variant="body1">
//                                             {selectedItem.data.latitude}, {selectedItem.data.longitude}
//                                         </Typography>
//                                     </Box>
//                                 )}

//                                 {selectedItem.data?.phoneCode && (
//                                     <Box>
//                                         <Typography variant="subtitle2" color="text.secondary">
//                                             کد تلفن:
//                                         </Typography>
//                                         <Typography variant="body1">
//                                             {selectedItem.data.phoneCode}
//                                         </Typography>
//                                     </Box>
//                                 )}

//                                 <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
//                                     <Button
//                                         variant="contained"
//                                         onClick={() => handleOpenDialog(
//                                             selectedItem.type === 'country' ? 'addProvince' : 'addCity'
//                                         )}
//                                         disabled={selectedItem.type === 'city'}
//                                         fullWidth
//                                     >
//                                         {selectedItem.type === 'country' ? 'افزودن استان' :
//                                             selectedItem.type === 'province' ? 'افزودن شهر' : 'افزودن'}
//                                     </Button>

//                                     <Button
//                                         variant="outlined"
//                                         color="primary"
//                                         onClick={handleOpenEditDialog}
//                                         sx={{ flex: 1 }}
//                                     >
//                                         ویرایش
//                                     </Button>

//                                     <Button
//                                         variant="outlined"
//                                         color="error"
//                                         onClick={handleDeleteLocation}
//                                         startIcon={<MdDelete />}
//                                         fullWidth
//                                     >
//                                         حذف
//                                     </Button>
//                                 </Stack>
//                             </Stack>
//                         ) : (
//                             <Typography color="text.secondary" textAlign="center" sx={{ mt: 5 }}>
//                                 یک آیتم از درخت انتخاب کنید
//                             </Typography>
//                         )}
//                     </Paper>

//                     {!selectedItem && (
//                         <Button
//                             variant="contained"
//                             startIcon={<TbMapPinPlus />}
//                             onClick={() => handleOpenDialog('addCountry')}
//                             fullWidth
//                             size="large"
//                         >
//                             افزودن کشور جدید
//                         </Button>
//                     )}
//                 </Box>

//                 <Box sx={{ flex: 2 }}>
//                     <Paper sx={{ px: 3, py: 1, height: '100%' }}>
//                         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>

//                             <Stack direction="row" spacing={1}>
//                                 <Tooltip title="افزودن کشور جدید">
//                                     <IconButton
//                                         onClick={() => handleOpenDialog('addCountry')}
//                                         color="primary"
//                                     >
//                                         <TbMapPinPlus />
//                                     </IconButton>
//                                 </Tooltip>

//                                 <Tooltip title="لغو انتخاب">
//                                     <IconButton
//                                         onClick={handleUnSelect}
//                                         color="error"
//                                     >
//                                         <IoCloseCircleOutline />
//                                     </IconButton>
//                                 </Tooltip>

//                             </Stack>
//                         </Box>

//                         <Box sx={{
//                             height: 500, overflow: 'auto', border: '1px solid',
//                             borderColor: 'divider', borderRadius: 1, p: 2
//                         }}>
//                             {locationTree.length > 0 ? (
//                                 locationTree.map((country) => (
//                                     <CustomTreeItem
//                                         key={country.id}
//                                         node={country}
//                                         onSelect={handleNodeSelect}
//                                     />
//                                 ))
//                             ) : (
//                                 <Typography color="text.secondary" textAlign="center" sx={{ mt: 10 }}>
//                                     هیچ کشوری یافت نشد
//                                 </Typography>
//                             )}
//                         </Box>
//                     </Paper>
//                 </Box>

//             </Box>

//             <AddLocationDialog
//                 open={dialogOpen}
//                 onClose={handleCloseDialog}
//                 mode={dialogMode}
//                 selectedItem={selectedItem}
//                 onSubmit={handleAddLocation}
//                 isSubmitting={isSubmitting}
//             />

//             <EditLocationDialog
//                 open={editDialogOpen}
//                 onClose={handleCloseEditDialog}
//                 selectedItem={selectedItem}
//                 onSubmit={handleEditLocation}
//                 isSubmitting={isEditing}
//             />

//         </DashboardContent>
//     );
// }
// index.jsx
'use client'

import React, { useState, useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { toast } from 'sonner';

import { DIALOG_MODES, LOCATION_TYPES } from '../component/constants';
import LocationTreeView from '../component/location-tree-view-component';
import LocationDetailsPanel from '../component/location-datail-panel';
import AddLocationDialog from '../location-new-form';
import EditLocationDialog from '../location-edit-form';
import { useLocationTree } from '../component/use-location-tree';
import { useLocationOperations } from '../component/use-location-operations';

export default function LocationTreeNew() {
  // State management
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(DIALOG_MODES.ADD_COUNTRY);

  // Custom hooks
  const { locationTree, isEmpty } = useLocationTree(selectedItem);
  const {
    handleAddLocation,
    handleDeleteLocation,
    handleEditLocation,
    isLoading,
    isDeleting,
    isEditing
  } = useLocationOperations();

  // Event handlers
  const handleNodeSelect = useCallback((node) => {
    setSelectedItem(node);
  }, []);

  const handleUnselect = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleOpenDialog = useCallback((mode) => {
    if (mode === DIALOG_MODES.ADD_PROVINCE && !selectedItem) {
      toast.warning('ابتدا یک کشور انتخاب کنید!');
      return;
    }
    if (mode === DIALOG_MODES.ADD_CITY && !selectedItem) {
      toast.warning('ابتدا یک استان انتخاب کنید!');
      return;
    }
    setDialogMode(mode);
    setDialogOpen(true);
  }, [selectedItem]);

  const handleOpenAddDialog = useCallback(() => {
    if (!selectedItem) {
      handleOpenDialog(DIALOG_MODES.ADD_COUNTRY);
    } else {
      const mode = selectedItem.type === LOCATION_TYPES.COUNTRY
        ? DIALOG_MODES.ADD_PROVINCE
        : DIALOG_MODES.ADD_CITY;
      handleOpenDialog(mode);
    }
  }, [selectedItem, handleOpenDialog]);

  const handleOpenEditDialog = useCallback(() => {
    if (!selectedItem) {
      toast.warning('ابتدا یک آیتم را انتخاب کنید!');
      return;
    }
    setEditDialogOpen(true);
  }, [selectedItem]);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
  }, []);

  const handleSubmitAdd = useCallback(async (data) => {
    const success = await handleAddLocation(data, dialogMode, selectedItem);
    if (success) {
      handleCloseDialog();
    }
  }, [handleAddLocation, dialogMode, selectedItem, handleCloseDialog]);

  const handleSubmitEdit = useCallback(async (data) => {
    const success = await handleEditLocation(data, selectedItem);
    if (success) {
      handleCloseEditDialog();
    }
  }, [handleEditLocation, selectedItem, handleCloseEditDialog]);

  const handleDelete = useCallback(async () => {
    if (!selectedItem) return;

    const success = await handleDeleteLocation(selectedItem);
    if (success) {
      setSelectedItem(null);
    }
  }, [selectedItem, handleDeleteLocation]);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="مدیریت مکان‌ها"
        sx={{ my: 2 }}
      />

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={6}>
          <LocationDetailsPanel
            selectedItem={selectedItem}
            onAddLocation={handleOpenAddDialog}
            onEdit={handleOpenEditDialog}
            onDelete={handleDelete}
            onAddCountry={() => handleOpenDialog(DIALOG_MODES.ADD_COUNTRY)}
          />
        </Grid>

        <Grid size={6}>
          <LocationTreeView
            locationTree={locationTree}
            selectedItem={selectedItem}
            onNodeSelect={handleNodeSelect}
            onUnselect={handleUnselect}
            onAddCountry={() => handleOpenDialog(DIALOG_MODES.ADD_COUNTRY)}
            isEmpty={isEmpty}
          />
        </Grid>
      </Grid>

      <AddLocationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        mode={dialogMode}
        selectedItem={selectedItem}
        onSubmit={handleSubmitAdd}
        isSubmitting={isLoading}
      />

      <EditLocationDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        selectedItem={selectedItem}
        onSubmit={handleSubmitEdit}
        isSubmitting={isEditing}
      />
    </DashboardContent>
  );
}