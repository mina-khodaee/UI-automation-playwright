
import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetDeviceUser } from 'src/actions/device-user';

import { DeviceUserDetailView } from 'src/sections/device-user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Device user details | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { deviceUser, deviceUserLoading, deviceUserError } = useGetDeviceUser(id);

  return (
    <>
      <title> {metadata.title}</title>
      <DeviceUserDetailView deviceUser={deviceUser} loading={deviceUserLoading} error={deviceUserError} />
    </>
  );
}
