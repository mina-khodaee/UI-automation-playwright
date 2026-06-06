
import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { useGetAccessGroup } from 'src/actions/access-group';

import { AccessGroupEditView } from 'src/sections/access-group/view';


// ----------------------------------------------------------------------

const metadata = { title: `Access Group edit | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();

  const { accessGroup, accessGroupLoading } = useGetAccessGroup(id);

  return (
    <>
      <title> {metadata.title}</title>

      <AccessGroupEditView accessGroup={accessGroup} accessGroupLoading={accessGroupLoading} />
    </>
  );
}
