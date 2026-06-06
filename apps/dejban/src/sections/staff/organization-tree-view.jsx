'use client';

import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { Iconify, IconifyLocal } from 'src/components/iconify';
import { useGetStaffWithPagination } from 'src/services/staff/staff.service';
import { useGetSites } from 'src/services/siteManagement/site.service';
import { useGetUnits } from 'src/services/units/units.service';
import { buildOrgChartData } from '@repo/ui/utils';
import { SimpleTreeView } from 'src/components/organizational-chart/SimpleTreeView';
import { BsX } from 'react-icons/bs';

export function OrganizationTreeView() {
    const [selectedSiteId, setSelectedSiteId] = useState('');
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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
        if (selectedSiteId) {
            filtered = filtered.filter(p => p.site?.id === selectedSiteId);
        }
        if (selectedUnitId) {
            filtered = filtered.filter(p => p.unit?.id === selectedUnitId);
        }
        return filtered;
    }, [allPersonnels, selectedSiteId, selectedUnitId]);

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
    };

    return (
        <DashboardContent maxWidth="xxl">
            <Paper elevation={12} sx={{ mb: 3, p: 2 }}>
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
                </Box>
            </Paper>

            <Card>
                <Box sx={{ p: 1, overflowX: 'auto' }}>
                    {chartData && chartData.children?.length > 0 ? (
                        <SimpleTreeView
                            data={chartData}
                            searchTerm={searchTerm}
                            searchMode="highlight"  
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