
import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetDevice } from 'src/actions/device';

import { DeviceEditView } from 'src/sections/device/view';

// ----------------------------------------------------------------------

const metadata = { title: `Device edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { device, deviceLoading, mutate } = useGetDevice(id);


  return (
    <>
      <title> {metadata.title}</title>

      <DeviceEditView device={device} deviceLoading={deviceLoading} />
    </>
  );
}
