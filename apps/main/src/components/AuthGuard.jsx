'use client';

/**
 * AuthGuard Component
 * Protects routes by redirecting unauthenticated users to login
 * Shows loading state while checking authentication
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Box, CircularProgress } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';

export const AuthGuard = ({ children }) => {
    const router = useRouter();
    const { authenticated: isAuthenticated, loading: isLoading } = useAuthContext();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/auth/jwt/sign-in');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
                bgcolor="background.paper"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};
