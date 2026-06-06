import { CONFIG } from 'src/global-config';
import { ArmoryCategoriesListView } from 'src/sections/armory/armory-categories/view/armory-categories-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `دسته بندی تجهیزات - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <ArmoryCategoriesListView />
    </>
  );
}
