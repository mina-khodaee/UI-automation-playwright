// 'use client';

// import { useMemo, useState } from 'react';
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Paper from '@mui/material/Paper';
// import Button from '@mui/material/Button';
// import MenuItem from '@mui/material/MenuItem';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import { useTranslate } from 'src/locales';
// import { DashboardContent } from '@repo/ui/layouts-dashboard';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { Iconify } from 'src/components/iconify';
// import { useGetStaffWithPagination } from 'src/services/staff/staff.service';
// import { useGetSites } from 'src/services/siteManagement/site.service';
// import { useGetUnits } from 'src/services/units/units.service';
// import { buildOrgChartData } from '@repo/ui/utils';
// import { Typography } from '@mui/material';
// import { FinalOfficialOrgChart } from 'src/components/organizational-chart/final-official-org-chart';

// // ----------------------------------------------------------------------

// export function OrganizationChartView() {
//     const { t: t_staff } = useTranslate('staff');
//     const { t: t_common } = useTranslate();

//     const [selectedSiteId, setSelectedSiteId] = useState('');
//     const [selectedUnitId, setSelectedUnitId] = useState('');

//     // دریافت داده‌ها
//     const { data: staffData, isLoading: staffLoading } = useGetStaffWithPagination({
//         page: 1,
//         pageSize: 1000,
//         searchTerm: '',
//         sortColumn: '',
//         sortOrder: '',
//     });

//     const { data: sitesData, isLoading: sitesLoading } = useGetSites({ pageSize: 1000 });
//     const { data: unitsData, isLoading: unitsLoading } = useGetUnits({ page: 1, pageSize: 1000 });

//     const sites = sitesData?.items || [];
//     const units = unitsData?.items || [];
//     const personnels = staffData?.items || [];

//     // فیلتر بر اساس سایت و واحد
//     const filteredPersonnels = useMemo(() => {
//         let filtered = personnels;

//         if (selectedSiteId) {
//             filtered = filtered.filter(p => p.site?.id === selectedSiteId);
//         }

//         if (selectedUnitId) {
//             filtered = filtered.filter(p => p.unit?.id === selectedUnitId);
//         }

//         return filtered;
//     }, [personnels, selectedSiteId, selectedUnitId]);

//     // ساخت دیتای چارت
//     const chartData = useMemo(() => buildOrgChartData(sites, units, filteredPersonnels), [sites, units, filteredPersonnels]);

//     // آپشن‌های فیلتر
//     const siteOptions = useMemo(() => sites.map(site => ({
//         value: site.id,
//         label: site.name,
//     })), [sites]);

//     const unitOptions = useMemo(() => {
//         let filteredUnits = units;
//         if (selectedSiteId) {
//             filteredUnits = units.filter(u => u.site?.id === selectedSiteId);
//         }
//         return filteredUnits.map(unit => ({
//             value: unit.id,
//             label: unit.name,
//         }));
//     }, [units, selectedSiteId]);

//     // ریست فیلترها
//     const handleResetFilters = () => {
//         setSelectedSiteId('');
//         setSelectedUnitId('');
//     };

//     return (
//         <DashboardContent maxWidth="xxl">
//             <CustomBreadcrumbs
//                 heading="چارت سازمانی"
//                 links={[
//                     { name: 'داشبورد', href: '/dashboard' },
//                     { name: 'مدیریت پرسنل', href: '/dashboard/staff' },
//                     { name: 'چارت سازمانی' },
//                 ]}
//                 sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
//             />

//             {/* فیلترها */}
//             <Paper elevation={12} sx={{ mb: 3, p: 2 }}>
//                 <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
//                     <TextField
//                         select
//                         size="small"
//                         label="انتخاب سایت"
//                         value={selectedSiteId}
//                         onChange={(e) => {
//                             setSelectedSiteId(e.target.value);
//                             setSelectedUnitId('');
//                         }}
//                         sx={{ minWidth: 200 }}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <Iconify icon="eva:home-outline" width={18} />
//                                 </InputAdornment>
//                             ),
//                         }}
//                     >
//                         <MenuItem value="">همه سایتها</MenuItem>
//                         {siteOptions.map(option => (
//                             <MenuItem key={option.value} value={option.value}>
//                                 {option.label}
//                             </MenuItem>
//                         ))}
//                     </TextField>

//                     <TextField
//                         select
//                         size="small"
//                         label="انتخاب واحد"
//                         value={selectedUnitId}
//                         onChange={(e) => setSelectedUnitId(e.target.value)}
//                         sx={{ minWidth: 200 }}
//                         disabled={!selectedSiteId}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <Iconify icon="eva:folder-outline" width={18} />
//                                 </InputAdornment>
//                             ),
//                         }}
//                     >
//                         <MenuItem value="">همه واحدها</MenuItem>
//                         {unitOptions.map(option => (
//                             <MenuItem key={option.value} value={option.value}>
//                                 {option.label}
//                             </MenuItem>
//                         ))}
//                     </TextField>

//                     <Button
//                         variant="outlined"
//                         color="inherit"
//                         onClick={handleResetFilters}
//                         startIcon={<Iconify icon="eva:refresh-fill" width={18} />}
//                     >
//                         ریست فیلترها
//                     </Button>

//                     <Box sx={{ flex: 1 }} />

//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<Iconify icon="eva:download-fill" width={18} />}
//                         >
//                             خروجی PDF
//                         </Button>
//                     </Box>
//                 </Box>
//             </Paper>

//             {/* چارت سازمانی */}
//             <Card>
//                 <Box sx={{ p: 3, overflowX: 'auto', minHeight: 600 }}>
//                     {chartData && chartData.children?.length > 0 ? (
//                         <FinalOfficialOrgChart data={chartData} />
//                     ) : (
//                         <Box sx={{
//                             display: 'flex',
//                             flexDirection: 'column',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             minHeight: 400,
//                             color: 'text.secondary',
//                         }}>
//                             <Iconify icon="eva:info-outline" width={48} sx={{ mb: 2, opacity: 0.5 }} />
//                             <Typography variant="h6">داده‌ای برای نمایش وجود ندارد</Typography>
//                             <Typography variant="body2">
//                                 لطفاً فیلترهای خود را تغییر دهید یا داده‌ای اضافه کنید
//                             </Typography>
//                         </Box>
//                     )}
//                 </Box>
//             </Card>
//         </DashboardContent>
//     );
// }




'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { Iconify, IconifyLocal } from 'src/components/iconify';
import { useGetStaffWithPagination } from 'src/services/staff/staff.service';
import { useGetSites } from 'src/services/siteManagement/site.service';
import { useGetUnits } from 'src/services/units/units.service';
import { buildOrgChartData } from '@repo/ui/utils';
import { D3OrgChartWrapper } from 'src/components/organizational-chart/D3OrgChartWrapper';
import { BsX } from 'react-icons/bs';

export function OrganizationChartView() {
    const theme = useTheme();
    const [selectedSiteId, setSelectedSiteId] = useState('');
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const chartWrapperRef = useRef(null);

    const { data: staffData } = useGetStaffWithPagination({
        page: 1,
        pageSize: 1000,
        searchTerm: '',
        sortColumn: '',
        sortOrder: '',
    });
    const { data: sitesData } = useGetSites({ pageSize: 1000 });
    const { data: unitsData } = useGetUnits({ page: 1, pageSize: 1000 });

    const sites = sitesData?.items || [];
    const units = unitsData?.items || [];
    const allPersonnels = staffData?.items || [];

    const filteredPersonnels = useMemo(() => {
        let filtered = allPersonnels;
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            filtered = filtered.filter(p =>
                (p.firstName || '').toLowerCase().includes(term) ||
                (p.lastName || '').toLowerCase().includes(term) ||
                (p.personnelCode || '').toLowerCase().includes(term) ||
                (p.position?.name || '').toLowerCase().includes(term)
            );
        }
        return filtered;
    }, [allPersonnels, searchTerm]);

    const chartData = useMemo(() => buildOrgChartData(sites, units, filteredPersonnels, selectedSiteId, selectedUnitId), [sites, units, filteredPersonnels, selectedSiteId, selectedUnitId]);

    const siteOptions = useMemo(() => sites.map(site => ({ value: site.id, label: site.name })), [sites]);
    const unitOptions = useMemo(() => {
        let filteredUnits = units;
        if (selectedSiteId) {
            filteredUnits = units.filter(u => u.site?.id === selectedSiteId);
        }
        return filteredUnits.map(unit => ({ value: unit.id, label: unit.name }));
    }, [units, selectedSiteId]);

    const handleResetFilters = () => {
        setSelectedSiteId('');
        setSelectedUnitId('');
        setSearchTerm('');
        if (chartWrapperRef.current) chartWrapperRef.current.clearSearch();
    };

    const handleExportPNG = () => {
        if (chartWrapperRef.current) {
            const chart = chartWrapperRef.current.getChart();
            if (chart) chart.exportImg({ save: true, backgroundColor: theme.palette.background.default });
        }
    };

    useEffect(() => {
        if (chartWrapperRef.current) {
            if (searchTerm.trim() === '') chartWrapperRef.current.clearSearch();
            else chartWrapperRef.current.searchNodes(searchTerm);
        }
    }, [searchTerm]);

    return (
        <DashboardContent maxWidth="xxxl">
            {/* <CustomBreadcrumbs
                heading="چارت سازمانی"
                links={[
                    { name: 'داشبورد', href: '/dashboard' },
                    { name: 'مدیریت پرسنل', href: '/dashboard/staff' },
                    { name: 'چارت سازمانی' },
                ]}
                sx={{ mb: { xs: 1, md: 2 }, mt: 2 }}
            /> */}
            <Paper elevation={12} sx={{ mb: 1, p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField
                        select
                        size="small"
                        label="انتخاب سایت"
                        value={selectedSiteId}
                        onChange={(e) => { setSelectedSiteId(e.target.value); setSelectedUnitId(''); }}
                        sx={{ minWidth: 200 }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Iconify icon="eva:home-outline" width={18} /></InputAdornment> }}
                    >
                        <MenuItem value="">همه سایتها</MenuItem>
                        {siteOptions.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="انتخاب واحد"
                        value={selectedUnitId}
                        onChange={(e) => setSelectedUnitId(e.target.value)}
                        sx={{ minWidth: 200 }}
                        disabled={!selectedSiteId}
                        InputProps={{ startAdornment: <InputAdornment position="start"><Iconify icon="eva:folder-outline" width={18} /></InputAdornment> }}
                    >
                        <MenuItem value="">همه واحدها</MenuItem>
                        {unitOptions.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                    </TextField>
                    <TextField
                        size="small"
                        label="جستجو (نام، کد، سمت)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ minWidth: 250 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Iconify icon="eva:search-outline" width={18} /></InputAdornment>,
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconifyLocal><BsX size={18} style={{ cursor: 'pointer' }} onClick={() => setSearchTerm('')} /></IconifyLocal>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button variant="outlined" color="inherit" onClick={handleResetFilters} startIcon={<Iconify icon="eva:refresh-fill" width={18} />}>ریست فیلترها</Button>
                    <Box sx={{ flex: 1 }} />
                    <Button variant="contained" color="primary" startIcon={<Iconify icon="eva:download-fill" width={18} />} onClick={handleExportPNG}>خروجی PNG</Button>
                </Box>
            </Paper>
            <Card>
                <Box sx={{ p: 1, overflowX: 'auto', minHeight: 750 }}>
                    {chartData && chartData.children?.length > 0 ? (
                        <D3OrgChartWrapper
                            key={theme.palette.mode}
                            ref={chartWrapperRef}
                            data={chartData}
                            onNodeClick={(node) => console.log('کلیک شد:', node)}
                        />
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, color: 'text.secondary' }}>
                            <Iconify icon="eva:info-outline" width={48} sx={{ mb: 2, opacity: 0.5 }} />
                            <Typography variant="h6">داده‌ای برای نمایش وجود ندارد</Typography>
                            <Typography variant="body2">لطفاً فیلترهای خود را تغییر دهید یا داده اضافه کنید</Typography>
                        </Box>
                    )}
                </Box>
            </Card>
        </DashboardContent>
    );
}