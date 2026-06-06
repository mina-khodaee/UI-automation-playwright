import { useState, useMemo } from 'react';
import { useLocation } from 'react-router';
import { DashboardContent } from '@repo/ui/layouts-dashboard';

import { Card, Button, MenuItem } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useAccessLogs } from 'src/stores/access-log-store';
import { useDeviceActions } from 'src/stores/device-actions-store';

import { MRTDataTable } from 'src/components/mrt-datatable';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TrafficDetials } from '../traffic-details-dialog';
import { OnlineTrafficReportTable } from '../online-traffic-report-table';
import { RenderCellAuthorization, RenderCellUserType } from '../traffic-report-table-row';

// ----------------------------------------------------------------------

export function TrafficRportView() {
  const location = useLocation();
  const { getTrafficModes, trafficModes } = useDeviceActions();
  const [onlineReports, setOnlineReports] = useState(false);
  const [detailsDialogRow, setDetailsDialogRow] = useState();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { t: t_report } = useTranslate('report');
  const { currentLang } = useTranslate();

  const initialFilters = useMemo(() => {
    const filters = [];

    if (location.state?.deviceId) {
      filters.push({ id: 'deviceId', value: location.state.deviceId });
    }

    if (location.state?.userId) {
      filters.push({ id: 'userId', value: location.state.userId });
    }

    return filters;
  }, [location.state?.deviceId, location.state?.userId]);

  const { items, totalCount, loading, getAccessLogs } = useAccessLogs();

  const handleDetailsDialog = (params) => {
    setDetailsDialogRow(params);
    setOpenDetailsDialog(true);
  };

  const handleOnlineReports = () => {
    setOnlineReports(!onlineReports);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'isAuthorized',
        header: t_report('columns.isAuthorized'),
        enableColumnFilterModes: false,
        type: 'boolean',
        accessorFn: (originalRow) => (originalRow.isAuthorized ? 'true' : 'false'),
        filterVariant: 'checkbox',
        size: 60,
        Cell: (params) => (<RenderCellAuthorization params={params} />)
      },
      {
        accessorKey: 'trafficMode',
        header: t_report('columns.trafficMode'),
        accessorFn: (row) =>
          row.trafficMode?.displayValues?.[currentLang?.value] || row.trafficMode?.value || '',
        enableColumnFilterModes: false,
        size: 80,
        filterVariant: 'select',
        filterSelectOptions: trafficModes.map(opt => opt.value),
        muiFilterTextFieldProps: {
          select: true,
          onFocus: async() => {
            await getTrafficModes();
          },
          children: trafficModes.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.displayValues[currentLang?.value]}
            </MenuItem>
          )),
        },
        muiFilterSelectProps: {
          renderValue: (selected) => {
            const match = trafficModes.find((opt) => opt.value === selected);
            return match ? match.displayValues[currentLang?.value] : selected;
          },
        },
        Cell: ({ cell }) => cell.getValue(),
      },
      {
        accessorKey: 'aclUser.userName',
        header: t_report('columns.userName'),
        accessorFn: (row) => row.aclUser?.userName || '-',
        enableColumnFilterModes: false,
        filterVariant: 'text',
        size: 40,
        Cell: ({ cell }) => cell.getValue() || '',
      },
      {
        accessorKey: 'aclUser.userType',
        header: t_report('columns.userType'),
        accessorFn: (row) =>
          row.aclUser?.userType?.displayValues?.[currentLang?.value] || row.aclUser?.userType?.value || '',
        enableColumnFilterModes: false,
        size: 80,
        Cell: ({ cell }) => cell.getValue(),
      },
      {
        accessorKey: 'site.name',
        header: t_report('columns.site'),
        accessorFn: (row) => row.site?.name || '-',
        enableColumnFilterModes: false,
        size: 80,
        Cell: ({ cell }) => cell.getValue(),
      },
      {
        accessorKey: 'door.doorName',
        header: t_report('columns.door'),
        accessorFn: (row) => row.door?.doorName || '-',
        enableColumnFilterModes: false,
        size: 80,
        Cell: ({ cell }) => cell.getValue(),
      },
      {
        accessorKey: 'dateTime',
        accessorFn: (row) => new Date(row.dateTime),
        header: t_report('columns.dateTime'),
        filterFn: 'between',
        type: 'dateTime',
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'],
        filterVariant: 'datetime',
        size: 230,
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      }
    ],
    [currentLang, trafficModes],
  );

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading={t_report('breadCrumb.trafficReports')}
          links={[
            { name: t_report('breadCrumb.dashboard'), href: paths.dashboard.root },
            { name: t_report('breadCrumb.trafficReports') },
          ]}
          action={
            <Button
              variant="contained"
              onClick={handleOnlineReports}
            >
              {onlineReports ? t_report('buttons.allReports') : t_report('buttons.liveStream')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        {onlineReports ? (
          <OnlineTrafficReportTable />
        ) : (
          <Card>

            <MRTDataTable
              data={items}
              columns={columns}
              isLoading={loading}
              rowCount={totalCount}
              refetchMethod={getAccessLogs}
              initialFilters={initialFilters}
              onView={(row) => handleDetailsDialog(row)}
            />

          </Card>
        )}
      </DashboardContent >
      <TrafficDetials open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} details={detailsDialogRow} />
    </>
  );
}


