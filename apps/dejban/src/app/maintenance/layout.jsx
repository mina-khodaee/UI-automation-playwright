import { SimpleLayout } from '@repo/ui/layouts-simple';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
    return (
        <SimpleLayout
            slotProps={{
                content: { compact: true },
            }}
        >
            {children}
        </SimpleLayout>
    );
}
