// app/dashboard/doors/page.jsx
import { CONFIG } from 'src/global-config';
import { DoorsListView } from 'src/sections/doors/view/doors-list-view';



export const metadata = { title: `مدیریت درب‌ها - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title> {metadata.title}</title>

            <DoorsListView />
        </>
    );
}