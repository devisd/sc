'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@/components/ui/elements';

export default function NewOrderRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Перенаправляем на страницу заказов, так как форма создания теперь открывается в модальном окне
        router.replace('/orders');
    }, [router]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: 2
            }}
        >
            <CircularProgress />
            <Typography variant="body1">
                Перенаправление на страницу заказов...
            </Typography>
        </Box>
    );
} 