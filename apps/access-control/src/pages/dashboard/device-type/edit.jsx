
import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetDeviceType } from 'src/actions/device-type';

import { DeviceTypeEditView } from 'src/sections/device-type/view';


// ----------------------------------------------------------------------

const metadata = { title: `Device Type edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { deviceType, deviceTypeLoading, mutate } = useGetDeviceType(id);

  return (
    <>
      <title> {metadata.title}</title>

      <DeviceTypeEditView deviceType={deviceType} deviceTypeLoading={deviceTypeLoading} />
    </>
  );
}
