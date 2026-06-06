'use client';

import { useMemo, useState } from 'react';
import { IconifyLocal } from '@repo/ui/iconify-local';
import Card from '@mui/material/Card';
import { DashboardContent } from '@repo/ui/layouts-dashboard';
import { MRTDataTable } from '@repo/ui/mrt-table';
import { toast } from 'src/components/snackbar';
import { fDateTime } from '@repo/ui/utils';
import { useGetVisitorAndVisitSchedule } from 'src/services/visitor-and-visitSchedule/visitorAndVisitSchedule.service';
import { VisitorAppointmentEditForm } from 'src/sections/visitor-and-appointment/visitor-and-appointment-new-edit-form';
import { useGetDoors } from 'src/services/doors/doors.service';
import { MenuItem } from '@mui/material';
import { RiListSettingsLine } from 'react-icons/ri';
import { TrafficDetailPanel } from 'src/sections/visitor-and-appointment/form-components/traffic-detail-panel/TrafficDetailPanel';
import { MdLogin, MdWarning } from 'react-icons/md';
import { TrafficModal } from '../form-components/traffic-detail-panel/TrafficModal';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment-jalaali';
import { ToggleSwitchGroup } from '@repo/ui/custom-mui-switch';

// ----------------------------------------------------------------------

export function VisitorAndAppointmentList({ onGuestSelect }) {
  // -----------------------------
  // State
  // -----------------------------

  const { control, watch } = useForm({
    defaultValues: {
      startDate: null,
      endDate: null,
      isReserved: false,
    },
  });

  const [currentGuestAndAppointment, setCurrentGuestAndAppointment] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [gender, setGender] = useState('');

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const reservedData = watch('isReserved');

  console.log('reservedData', reservedData);

  const filterRules = () => {
    const hasStartDate = startDate && startDate !== null;
    const hasEndDate = endDate && endDate !== null;

    let dateFilter = '';
    let reservedFilter = '';

    if (hasStartDate && !hasEndDate) {
      dateFilter = `visitDate|eq|${startDate}`;
    } else if (hasStartDate && hasEndDate) {
      dateFilter = `visitDate|eq|${startDate} AND visitEndDate|eq|${endDate}`;
    }

    if (reservedData === true) {
      reservedFilter = `isGroup|eq|${reservedData}`;
    }

    if (dateFilter && reservedFilter) {
      return `${dateFilter} AND ${reservedFilter}`;
    }

    if (dateFilter) {
      return dateFilter;
    }

    if (reservedFilter) {
      return reservedFilter;
    }

    return '';
  };

  // -----------------------------
  // Data & Query Params
  // -----------------------------
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortOrder: '',
  });

  const {
    data: VisitorAndAppointmentData,
    isLoading,
    refetch,
  } = useGetVisitorAndVisitSchedule({
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    searchTerm: queryParams.searchTerm,
    sortColumn: queryParams.sortColumn,
    sortOrder: queryParams.sortOrder,
    filters: filterRules(),
  });

  const VisitorAndAppointment = VisitorAndAppointmentData?.items || [];
  const totalCount = VisitorAndAppointment?.totalCount || 0;

  const { data: doorsData, isLoading: loadingDoorsData, refetch: refetchDoorData } = useGetDoors();
  const doorOptions =
    doorsData?.items?.map((door) => ({
      id: door.id,
      label: door.doorName,
    })) || [];

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleEdit = (row) => {
    setCurrentGuestAndAppointment(row.id);
    document.getElementById('visitor-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setCurrentGuestAndAppointment(null);
  };

  const handleAddTraffic = (newTraffic) => {
    toast.success('تردد با موفقیت ثبت شد');
    setModalOpen(false);
    setEmergencyModalOpen(false);
    refetch();
  };

  const handleOpenTrafficModal = (row, isEmergency = false) => {
    if (row.status !== 'فعال') {
      toast.error('امکان ثبت تردد فقط برای قرار ملاقات‌های فعال وجود دارد');
      return;
    }
    setSelectedAppointment(row);
    if (isEmergency) {
      setEmergencyModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  // const clickHandler = () => {
  //   if (startDate || endDate) {
  //     refetch();
  //   }
  // };

  const customRowActions = useMemo(
    () => [
      (row) => (
        <MenuItem
          onClick={() => handleOpenTrafficModal(row, false)}
          disabled={row.status !== 'فعال'}
        >
          <IconifyLocal>
            <MdLogin size={18} />
          </IconifyLocal>
          ثبت تردد عادی
        </MenuItem>
      ),
      (row) => (
        <MenuItem
          onClick={() => handleOpenTrafficModal(row, true)}
          disabled={row.status !== 'فعال'}
          sx={{ color: 'warning.main' }}
        >
          <IconifyLocal>
            <MdWarning size={18} />
          </IconifyLocal>
          ثبت تردد اضطراری
        </MenuItem>
      ),
      (row) => (
        <MenuItem onClick={() => onGuestSelect(row.visitor)}>
          <IconifyLocal>
            <RiListSettingsLine size={18} />
          </IconifyLocal>
          مشاهده لیست قرار ملاقات
        </MenuItem>
      ),
    ],
    [onGuestSelect]
  );

  // -----------------------------
  // Columns Definition
  // -----------------------------
  const columns = useMemo(
    () => [
      {
        accessorKey: 'visitor.fullName',
        header: 'نام و نام خانوادگی',
        size: 200,
      },
      {
        accessorKey: 'visitorCard.cardType',
        header: 'نوع کارت',
        size: 120,
      },
      {
        accessorKey: 'visitorCard.cardNumber',
        header: 'شماره کارت',
        size: 150,
      },
      {
        accessorKey: 'host.fullName',
        header: 'میزبان',
        size: 200,
      },
      {
        accessorKey: 'visitReason.name',
        header: 'دلیل ملاقات',
        size: 180,
      },
      {
        accessorKey: 'visitDate',
        header: 'تاریخ شروع ملاقات',
        type: 'dateTime',
        filterVariant: 'datetime',
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'],
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
      {
        accessorKey: 'visitEndDate',
        header: 'تاریخ پایان ملاقات',
        type: 'dateTime',
        filterVariant: 'datetime',
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'],
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
      {
        accessorKey: 'status',
        header: 'وضعیت',
        size: 120,
      },
      {
        accessorKey: 'createdAt',
        header: 'تاریخ ثبت',
        type: 'dateTime',
        filterVariant: 'datetime',
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'],
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      },
    ],
    []
  );

  // ----------------------------------------------------------------------
  return (
    <>
      <DashboardContent maxWidth="xxl">
        <Card
          id="visitor-form-section"
          sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider' }}
        >
          <VisitorAppointmentEditForm
            currentGuestAndAppointment={currentGuestAndAppointment}
            onRefetch={refetch}
            onCancel={handleCancelEdit}
            isEditing={!!currentGuestAndAppointment}
          />
        </Card>

        <Card sx={{ height: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column' }}>
          <MRTDataTable
            data={VisitorAndAppointment}
            columns={columns}
            rowCount={totalCount}
            isLoading={isLoading}
            setQueryParams={setQueryParams}
            onEdit={handleEdit}
            // customRowActions={customRowActions}
            enableExportCSV
            enableExportPDF
            enableRowSelection={false}
            // enableExpanding={true}
            renderDetailPanel={({ row }) => (
              <TrafficDetailPanel
                appointmentId={row.id}
                appointmentData={row}
                onRefresh={refetch}
              />
            )}
            renderTopToolbarCustomActions={({ table }) => (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', maxWidth: '60%' }}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label="از تاریخ"
                      value={field.value ? moment(field.value) : null}
                      onChange={(newValue) =>
                        field.onChange(newValue ? newValue.toISOString() : null)
                      }
                      slotProps={{
                        textField: {
                          size: 'small',
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message || '',
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="endDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label="تا تاریخ"
                      value={field.value ? moment(field.value) : null}
                      onChange={(newValue) =>
                        field.onChange(newValue ? newValue.toISOString() : null)
                      }
                      disabled={!startDate}
                      slotProps={{
                        textField: {
                          size: 'small',
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message || '',
                        },
                      }}
                    />
                  )}
                />

                {/*<Button onClick={clickHandler} variant="outlined" size="small">*/}
                {/*  نمایش*/}
                {/*</Button>*/}

                <Controller
                  name="isReserved"
                  control={control}
                  render={({ field }) => (
                    <ToggleSwitchGroup
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { label: 'همه ملاقات ها', value: false },
                        { label: 'ملاقات رزرو شده', value: true },
                      ]}
                    />
                  )}
                />
              </div>
            )}
          />
        </Card>
      </DashboardContent>

      <TrafficModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSave={handleAddTraffic}
        initialData={null}
        // isEmergency={false}
        doorsOptions={doorOptions}
        appointmentData={selectedAppointment}
      />

      <TrafficModal
        open={emergencyModalOpen}
        onClose={() => {
          setEmergencyModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSave={handleAddTraffic}
        initialData={null}
        // isEmergency={true}
        doorsOptions={doorOptions}
        appointmentData={selectedAppointment}
      />
    </>
  );
}
