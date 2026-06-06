import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; // Import for the delete button
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { useTranslate } from 'src/locales';

import { EmptyContent } from 'src/components/empty-content';

import { DeviceItemSkeleton } from './device-skeleton';
import { OnlineDeviceList } from './online-device-list';
import { DeviceItemHorizontal } from './device-item-horizontal';

// ----------------------------------------------------------------------

export function DeviceListHorizontal({ devices, deviceloading, devicesEmpty, deleteDevice, mutate }) {
  const { t } = useTranslate();
  const [onlineDevices, setOnlineDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);

  const renderLoading = <DeviceItemSkeleton variant="horizontal" />;

  const handleSelect = (deviceId) => {
    setSelectedDevices((prevSelected) =>
      prevSelected.includes(deviceId)
        ? prevSelected.filter((id) => id !== deviceId) // Deselect if already selected
        : [...prevSelected, deviceId] // Add to selection
    );
  };

  const handleOnlineDevices = (OnlineDevicesList) => {
    setOnlineDevices(OnlineDevicesList);
  };


  const updatedDevices = devices.map((device) => {
    const isOnline = onlineDevices.some(
      (onlineDevice) =>
        onlineDevice?.terminalID === device?.terminalId || onlineDevice?.serialNumber === device?.serialNumber
    );
    console.log(isOnline);
    return {
      ...device,
      isOnline,
    };
  });
  console.log("dfdf",updatedDevices);

  const renderList = updatedDevices.map((device) => (
    <DeviceItemHorizontal
      key={device.id}
      device={device}
      selected={selectedDevices.includes(device.id)}
      onSelect={handleSelect}
    />
  ));

  return (
    <>
      <OnlineDeviceList onGet={handleOnlineDevices} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        {selectedDevices.length > 0 && (
          <Button
            variant="contained"
            color="error"
          >
            {t('button.deleteSelected')} ({selectedDevices.length})
          </Button>
        )}
      </Box>
      <Box
        columnGap={1}
        rowGap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
      >
        {deviceloading ? renderLoading : renderList}
        {devicesEmpty && (
          <Box sx={{ gridColumn: 'span 2' }}>
            <EmptyContent title={t('commonTexts.noData')} filled sx={{ py: 10 }} />
          </Box>
        )}
      </Box>

      {devices.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
