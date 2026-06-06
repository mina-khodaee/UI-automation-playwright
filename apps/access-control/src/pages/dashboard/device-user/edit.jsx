import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetDeviceUser } from 'src/actions/device-user';

import { DeviceUSerEditView } from 'src/sections/device-user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Device user edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { deviceUser, deviceUserLoading } = useGetDeviceUser(id);

  return (
    <>
      <title> {metadata.title}</title>

      <DeviceUSerEditView deviceUser={deviceUser} deviceUserLoading={deviceUserLoading} />
    </>
  );
}
