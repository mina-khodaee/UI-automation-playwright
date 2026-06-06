import { toast } from 'sonner';
import { IoSearch } from 'react-icons/io5';
import { useState, useCallback } from 'react';
import { HiOutlinePlus } from 'react-icons/hi2';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { useBoolean, useDebounce } from 'minimal-shared/hooks';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Box, InputAdornment, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { deleteCalendar, useGetCalendars } from 'src/actions/calendar';

import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CalendarSort } from '../calendar-sort';
import { CalendarItem } from '../calendar-item';
import { CalendarListSkeleton } from '../calendar-list-skeleton';

// ----------------------------------------------------------------------

export function CalendarListView() {
    const { t: t_device } = useTranslate('device');
    const { t: t_common } = useTranslate();
    const CALENDAR_SORT_OPTIONS = [
        { value: 'oldest', label: t_device('filters.oldest') },
        { value: 'latest', label: t_device('filters.latest') },
    ];
    const router = useRouter();
    const confirm = useBoolean();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deletingCalendar, setDeletingCalendar] = useState(null);
    const [sortBy, setSortBy] = useState('oldest');
    const [sortOrder, setSortOrder] = useState();
    const [sortColumn, setSortColumn] = useState();
    const [pageSizeQuery, setPageSizeQuery] = useState();
    const [searchQuery, setSearchQuery] = useState();
    const debouncedQuery = useDebounce(searchQuery);
    const { calendars, calendarsLoading, calendarsEmpty, mutate } = useGetCalendars(debouncedQuery, sortOrder, pageSizeQuery, sortColumn);

    const handleEdit = useCallback(
        (id) => {
            router.push(paths.dashboard.calendar.edit(id));
        },
        [router]
    );

    const handleView = useCallback(
        (id) => {
            router.push(paths.dashboard.calendar.details(id));
        },
        [router]
    );

    const handleDelete = async () => {
       setDeleteLoading(true);
        try {
            await deleteCalendar(deletingCalendar);
            await mutate();
            toast.success(t_device('toastMessages.deleteCalendar'));
            confirm.onFalse();
        } catch (error) {
            console.error(error);
        } finally {
            setDeleteLoading(false);
        }
    };
    const handleSortBy = useCallback((newValue) => {
        setSortBy(newValue);
        setSortOrder(sortBy === 'latest' ? 'asc' : 'desc');
        setSortColumn('createdAt');
    }, [sortBy]);

    const handleSearch = useCallback((e) => {
        if (e.target.value?.length > 2) {
            setSearchQuery(e.target.value)
          }
          else {
            setSearchQuery();
          }
    }, []);

    const renderFilters = (
        <Stack
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-end', sm: 'center' }}
            direction={{ xs: 'column', sm: 'row' }}
        >
            <TextField
                fullWidth
                value={searchQuery}
                onChange={handleSearch}
                placeholder={t_common('placeholders.search')}
                startadornment={
                    <InputAdornment position="start">
                       <IoSearch sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                }

            />

            <Stack direction="row" spacing={1} flexShrink={0}>
                <CalendarSort sort={sortBy} onSort={handleSortBy} sortOptions={CALENDAR_SORT_OPTIONS} />
            </Stack>
        </Stack>
    );

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading={t_device('breadCrumb.calendar')}
                links={[
                    { name: t_device('breadCrumb.dashboard'), href: paths.dashboard.root },
                    { name: t_device('breadCrumb.calendar') },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        href={paths.dashboard.calendar.create}
                        variant="contained"
                        startIcon={<HiOutlinePlus/>}
                    >
                        {t_device('button.newCalendar')}
                    </Button>
                }
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
                {renderFilters}
            </Stack>
            <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
            >
                {calendarsEmpty && <EmptyContent filled sx={{ py: 10 }} title={t_common('commonTexts.noData')} />}
                {calendarsLoading ? <CalendarListSkeleton /> : calendars.map((calendar) => (
                    <CalendarItem
                        key={calendar.id}
                        calendar={calendar}
                        onEdit={() => handleEdit(calendar.id)}
                        onDelete={() => {setDeletingCalendar(calendar.id)
                            confirm.onTrue();
                        }}
                        onView={() => handleView(calendar.id)}
                    />))
                }
            </Box>
            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title={t_common('button.delete')}
                content={t_common('commonTexts.deleteConfirm')}
                action={
                    <Button variant="contained" color="error" onClick={handleDelete} disabled={deleteLoading}>
                        {deleteLoading ? t_common('button.deleteLoading') : t_common('button.delete')}
                    </Button>
                }
            />
        </DashboardContent>
    );
}

