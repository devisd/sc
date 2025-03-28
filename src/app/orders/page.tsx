'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Alert, Button, Container, Typography } from '@/components/ui/elements';
import { AddIcon } from '@/components/ui/icons';
import { OrderListSkeleton } from '@/components/ui/OrderListSkeleton';
import styles from './page.module.scss';

// Dynamically import client components with SSR disabled
const OrderList = dynamic(() => import('@/components/orders/OrderList'), {
    ssr: false,
    loading: () => <OrderListSkeleton />
});

const NewOrderModal = dynamic(() => import('@/components/orders/NewOrderModal').then(mod => mod.NewOrderModal), {
    ssr: false
});

const ErrorBoundary = dynamic(() => import('@/components/ui/ErrorBoundary').then(mod => mod.ErrorBoundary), {
    ssr: false
});

/**
 * Компонент страницы со списком заказов
 * Отображает список заказов с возможностью создания нового заказа
 */
export default function OrdersPage() {
    // Локальное состояние для управления модальным окном
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Открывает модальное окно создания нового заказа
     */
    const handleOpenModal = () => setIsModalOpen(true);

    /**
     * Закрывает модальное окно создания нового заказа
     */
    const handleCloseModal = () => setIsModalOpen(false);

    /**
     * Повторная загрузка данных при ошибке
     */
    const handleErrorReset = () => setError(null);

    return (
        <Container maxWidth="lg" className="py-4">
            {/* Заголовок и кнопка создания */}
            <div className={styles.header}>
                <Typography variant="h3" component="h1" className={styles.title}>
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
            </div>

            {/* Отображение ошибки, если есть */}
            {error && (
                <Alert severity="error" className={styles.errorAlert}>
                    {error}
                </Alert>
            )}

            {/* Обработка ошибок рендеринга */}
            <ErrorBoundary onReset={handleErrorReset}>
                <OrderList />
            </ErrorBoundary>

            {/* Модальное окно создания заказа */}
            <NewOrderModal open={isModalOpen} onClose={handleCloseModal} />
        </Container>
    );
} 