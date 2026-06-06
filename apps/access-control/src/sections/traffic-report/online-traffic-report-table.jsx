
import React, { useEffect, useMemo, useState } from 'react';
import signalRConnection, { endpoints } from '@repo/ui/utils';
import { DashboardContent } from '@repo/ui/layouts-dashboard';

import { Card } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import { MRTDataTable } from 'src/components/mrt-datatable';

import { TrafficDetials } from './traffic-details-dialog';
import { RenderCellAuthorization } from './traffic-report-table-row';

// -----------------------------------------------------------------------------

export function OnlineTrafficReportTable() {
  const { t: t_report } = useTranslate('report');
  const [connection, setConnection] = useState(null);
  const { currentLang } = useTranslate();
  const [onlineTrafficReport, setOnlineTrafficReport] = useState([]);
  const [detailsDialogRow, setDetailsDialogRow] = useState();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const handleDetailsDialog = (params) => {
    setDetailsDialogRow(params);
    setOpenDetailsDialog(true);
  };

  const columns = useMemo(
    () => [
      // {
      //   accessorKey: 'picture',
      //   header: t_report('columns.picture'),
      //   enableColumnFilter: false,
      //   enableSorting: false,
      //   size: 100,
      //   Cell: (params) => (<RenderCellPicture params={params} />)
      // },
      {
        accessorKey: 'isAuthorized',
        header: t_report('columns.isAuthorized'),
        enableColumnFilter: false,
        enableSorting: false,
        accessorFn: (originalRow) => (originalRow.isAuthorized ? 'true' : 'false'),
        size: 100,
        Cell: (params) => (<RenderCellAuthorization params={params} />)
      },
      {
        accessorKey: 'userId',
        header: t_report('columns.userId'),
        enableColumnFilter: false,
        enableSorting: false,
        size: 100,
        Cell: ({ row }) => row.original.userID || '',
      },
      {
        accessorKey: 'authMode',
        header: t_report('columns.authMode'),
        size: 120,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: (params) => params.renderedCellValue.displayValues[currentLang?.value]
      },
      {
        accessorKey: 'authType',
        header: t_report('columns.authType'),
        size: 140,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: (params) => params.renderedCellValue.displayValues[currentLang?.value]
      },
      {
        accessorKey: 'trafficMode',
        header: t_report('columns.trafficMode'),
        size: 140,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: (params) => params.renderedCellValue.displayValues[currentLang?.value]
      },
      {
        accessorKey: 'device.brand',
        header: t_report('columns.device'),
        enableColumnFilter: false,
        enableSorting: false,
        size: 100,
        columnFilterModeOptions: ['equals', 'contains'],
        filterFn: 'equals'
      },
      {
        accessorKey: 'deviceId',
        header: t_report('columns.deviceId'),
        enableColumnFilter: false,
        enableSorting: false,
        size: 120,
        Cell: ({ row }) => row.original.device?.id || '',
      },
      {
        accessorKey: 'device',
        header: t_report('columns.terminalId'),
        enableColumnFilter: false,
        enableSorting: false,
        size: 200,
        Cell: (params) => params.renderedCellValue.serialNumber || params.renderedCellValue.terminalId
      },
      {
        accessorKey: 'dateTime',
        accessorFn: (row) => new Date(row.dateTime),
        header: t_report('columns.dateTime'),
        enableColumnFilter: false,
        enableSorting: false,
        size: 200,
        Cell: ({ cell }) => fDateTime(cell.getValue(), true),
      }
    ],
    [],
  );

  // Establish SignalR Connection
  useEffect(() => {
    const conn = signalRConnection.connect(endpoints.deviceHub);
    setConnection(conn);

    return () => {
      signalRConnection.disconnect(); // Cleanup on component unmount
    };
  }, []);

  // Subscribe to Realtime Updates
  useEffect(() => {
    if (connection) {
      signalRConnection.on("RealtimeAccessLog", (result) => {
        setOnlineTrafficReport((prev) => {
          const exists = prev.some((item) => item.id === result.id);
          return exists ? prev : [result, ...prev]; // Insert at the beginning
        });
      });
    }
  }, [connection]);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Card>
          <MRTDataTable
            data={onlineTrafficReport}
            columns={columns}
            rowCount={onlineTrafficReport.length}
            onView={(row) => handleDetailsDialog(row)}
            enablePagination={false}
            enableRowVirtualization
            enableExportCSV={false}
            enableExportPDF={false}
            enableGlobalFilter={false}
          />
        </Card>
      </DashboardContent>
      <TrafficDetials open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} details={detailsDialogRow} />
    </>
  );
}

