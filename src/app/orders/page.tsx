'use client';

import { useState, useEffect } from 'react';
import { OrderList } from '@/components/orders/OrderList';
import { Box, Typography, Button, Container, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NewOrderModal from '@/components/orders/NewOrderModal';
import { useOrderStore } from '@/lib/stores/orderStore';

export default function OrdersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { fetchOrders, isLoading, error } = useOrderStore();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Заказы
                </Typography>
                <Button
                    onClick={handleOpenModal}
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Новый заказ
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <OrderList />
            )}

            <NewOrderModal open={isModalOpen} onClose={handleCloseModal} />
        </Container>
    );
} 