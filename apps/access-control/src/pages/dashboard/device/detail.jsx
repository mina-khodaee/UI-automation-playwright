import { useState } from 'react';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetDevice } from 'src/actions/device';

import { DeviceDetailView } from 'src/sections/device/view';
import { OnlineDeviceList } from 'src/sections/device/online-device-list';

// ----------------------------------------------------------------------

const metadata = { title: `Device details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { device, deviceLoading, deviceError, mutate } = useGetDevice(id);
  const [onlineDevices, setOnlineDevices] = useState([]);

  const handleOnlineDevices = (OnlineDevicesList) => {
    setOnlineDevices(OnlineDevicesList);
  }
  const isOnline = onlineDevices.some((onlineDevice) => (onlineDevice?.terminalID === device?.terminalId) || (onlineDevice?.serialNumber === device?.serialNumber));
  const updatedDevice = { ...device, isOnline, };

  return (
    <>
      <title> {metadata.title}</title>
      <OnlineDeviceList onGet={handleOnlineDevices} />
      <DeviceDetailView device={updatedDevice} loading={deviceLoading} error={deviceError} />
    </>
  );
}
