import { CONFIG } from 'src/global-config';
import { EmploymentTypeListView } from 'src/sections/employment-type/view/employment-type-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `انواع استخدام - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <EmploymentTypeListView />
    </>
  );
}
