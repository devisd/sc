'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CancelIcon, EditIcon, SaveIcon } from '@/components/ui/icons';
import {
    Alert, Badge, Button, Card, CardContent, CircularProgress, Container,
    IconButton, Typography
} from '@/components/ui/elements';
import { useOrderStore } from '@/lib/stores/orderStore';
import { Order, OrderService, OrderStatus } from '@/lib/types';
import { formatDate, formatDateTime } from '@/lib/utils/formatters';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import { ServiceSelector } from '@/components/order/ServiceSelector';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import styles from './page.module.scss';

/**
 * Страница детализации заказа
 */
export default function OrderDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const orderId = params.id;

    // Состояние заказа из хранилища
    const {
        orderDetails, isLoading, error,
        fetchOrderDetails, updateOrderStatus, updateOrderComment,
        addOrderService, removeOrderService, updateOrderServiceQuantity
    } = useOrderStore();

    // Локальное состояние для управления UI
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSavingComment, setIsSavingComment] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [serviceOperationInProgress, setServiceOperationInProgress] = useState(false);

    // Загрузка данных заказа
    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId);
        }
    }, [orderId, fetchOrderDetails]);

    // Подготовка данных для отображения
    const order = orderDetails as Order;
    const totalServicesPrice = order?.services.reduce((total, service) => {
        return total + (service.price * (service.quantity || 1));
    }, 0) ?? 0;

    // Начать редактирование комментария
    const handleStartEditComment = useCallback(() => {
        setCommentText(order?.masterComment || '');
        setIsEditingComment(true);
    }, [order]);

    // Отмена редактирования комментария
    const handleCancelEditComment = useCallback(() => {
        setIsEditingComment(false);
    }, []);

    // Сохранение комментария
    const handleSaveComment = useCallback(async () => {
        if (!order) return;

        setIsSavingComment(true);
        try {
            await updateOrderComment(order.id, commentText);
            setIsEditingComment(false);
        } catch (error) {
            console.error('Ошибка при обновлении комментария:', error);
        } finally {
            setIsSavingComment(false);
        }
    }, [order, commentText, updateOrderComment]);

    // Изменение статуса заказа
    const handleStatusChange = useCallback(async (newStatus: OrderStatus) => {
        if (!order || order.status === newStatus) return;

        setIsChangingStatus(true);
        try {
            await updateOrderStatus(order.id, newStatus);
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
        } finally {
            setIsChangingStatus(false);
        }
    }, [order, updateOrderStatus]);

    // Обработчики для управления услугами заказа
    const handleAddService = useCallback(async (serviceId: string) => {
        if (!order) return;

        setServiceOperationInProgress(true);
        try {
            await addOrderService(order.id, serviceId);
        } catch (error) {
            console.error('Ошибка при добавлении услуги:', error);
        } finally {
            setServiceOperationInProgress(false);
        }
    }, [order, addOrderService]);

    const handleRemoveService = useCallback(async (orderServiceId: string) => {
        if (!order) return;

        setServiceOperationInProgress(true);
        try {
            await removeOrderService(order.id, orderServiceId);
        } catch (error) {
            console.error('Ошибка при удалении услуги:', error);
        } finally {
            setServiceOperationInProgress(false);
        }
    }, [order, removeOrderService]);

    const handleUpdateQuantity = useCallback(async (orderService: OrderService, newQuantity: number) => {
        if (!order) return;

        setServiceOperationInProgress(true);
        try {
            await updateOrderServiceQuantity(order.id, orderService.id, newQuantity);
        } catch (error) {
            console.error('Ошибка при изменении количества:', error);
        } finally {
            setServiceOperationInProgress(false);
        }
    }, [order, updateOrderServiceQuantity]);

    // Переход назад к списку заказов
    const handleBack = useCallback(() => {
        router.push('/orders');
    }, [router]);

    // Если данные загружаются, показываем скелетон
    if (isLoading) {
        return (
            <Container maxWidth="lg" className="py-4">
                <SkeletonLoader />
            </Container>
        );
    }

    // Если заказ не найден
    if (!order) {
        return (
            <Container maxWidth="lg" className="py-4">
                <div className={styles.header}>
                    <button onClick={handleBack}>
                        <Typography>← Назад к заказам</Typography>
                    </button>
                </div>

                <Alert severity="error" className={styles.errorAlert}>
                    Заказ с ID {orderId} не найден
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" className="py-4">
            <div className={styles.header}>
                <div className={styles.title}>
                    <IconButton onClick={handleBack} className={styles.backButton}>
                        <span className="text-xl">←</span>
                    </IconButton>
                    <div>
                        <Typography variant="h1">
                            Заказ #{order.orderNumber}
                            <Badge
                                className={styles.statusBadge}
                                style={{ backgroundColor: ORDER_STATUS_COLORS[order.status] }}
                            >
                                {ORDER_STATUS_LABELS[order.status]}
                            </Badge>
                        </Typography>
                        <Typography className={styles.subtitle}>
                            от {formatDate(order.createdAt)}
                        </Typography>
                    </div>
                </div>
            </div>

            {error && (
                <Alert severity="error" className={styles.errorAlert}>
                    {error}
                </Alert>
            )}

            <div className={styles.orderInfoContainer}>
                <Card className={styles.infoCard}>
                    <CardContent>
                        <Typography variant="h3" className={styles.sectionTitle}>Информация о клиенте</Typography>
                        <hr className={styles.sectionDivider} />
                        <div className="space-y-2">
                            <div className={styles.detailItem}>
                                <Typography color="secondary" className={styles.detailLabel}>Имя:</Typography>
                                <Typography>{order.clientName}</Typography>
                            </div>
                            <div className={styles.detailItem}>
                                <Typography color="secondary" className={styles.detailLabel}>Телефон:</Typography>
                                <Typography>{order.clientPhone}</Typography>
                            </div>
                            <div className={styles.detailItem}>
                                <Typography color="secondary" className={styles.detailLabel}>Email:</Typography>
                                <Typography>{order.clientEmail || 'Не указан'}</Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={styles.infoCard}>
                    <CardContent>
                        <Typography variant="h3" className={styles.sectionTitle}>Информация об устройстве</Typography>
                        <hr className={styles.sectionDivider} />
                        <div className="space-y-2">
                            <div className={styles.detailItem}>
                                <Typography color="secondary" className={styles.detailLabel}>Тип:</Typography>
                                <Typography>{order.deviceType}</Typography>
                            </div>
                            <div className={styles.detailItem}>
                                <Typography color="secondary" className={styles.detailLabel}>Модель:</Typography>
                                <Typography>{order.deviceModel}</Typography>
                            </div>
                            <div className={styles.detailItem}>
                                <Typography color="secondary" className={styles.detailLabel}>Серийный номер:</Typography>
                                <Typography>{order.serialNumber || 'Не указан'}</Typography>
                            </div>
                            <div className={styles.detailItem}>
                                <Typography color="secondary" className={styles.detailLabel}>Описание проблемы:</Typography>
                                <Typography>{order.issueDescription}</Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={styles.infoCard}>
                    <CardContent>
                        <Typography variant="h3" className={styles.sectionTitle}>Финансовая информация</Typography>
                        <hr className={styles.sectionDivider} />
                        <div className={styles.financialSummary}>
                            <div className={styles.detailItem}>
                                <Typography color="secondary" className={styles.detailLabel}>Предоплата:</Typography>
                                <Typography>{order.prepayment} ₽</Typography>
                            </div>
                            <div className={styles.detailItem}>
                                <Typography color="secondary" className={styles.detailLabel}>Стоимость услуг:</Typography>
                                <Typography>{totalServicesPrice} ₽</Typography>
                            </div>
                            <div className="mt-1">
                                <Typography color="secondary" className={styles.detailLabel}>К оплате:</Typography>
                                <Typography variant="h3" color="primary" className={styles.totalPayment}>
                                    {Math.max(0, totalServicesPrice - order.prepayment)} ₽
                                </Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-4">
                <CardContent>
                    <Typography variant="h3" className={styles.sectionTitle}>Услуги и запчасти</Typography>
                    <hr className={styles.sectionDivider} />
                    <ServiceSelector
                        orderServices={order.services}
                        onAddService={handleAddService}
                        onRemoveService={handleRemoveService}
                        onUpdateQuantity={handleUpdateQuantity}
                    />
                    {serviceOperationInProgress && (
                        <div className={styles.loadingIndicator}>
                            <CircularProgress size={20} className={styles.loadingSpinner} />
                            <Typography color="secondary">Обработка операции...</Typography>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardContent>
                    <div className={styles.commentHeader}>
                        <Typography variant="h3" className="mb-0">Комментарий мастера</Typography>
                        {!isEditingComment && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={handleStartEditComment}
                            >
                                Редактировать
                            </Button>
                        )}
                    </div>
                    <hr className={styles.sectionDivider} />

                    {isEditingComment ? (
                        <>
                            <textarea
                                className={styles.commentTextarea}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Введите комментарий мастера"
                                disabled={isSavingComment}
                            />
                            <div className={styles.buttonGroup}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={handleCancelEditComment}
                                    startIcon={<CancelIcon />}
                                    disabled={isSavingComment}
                                >
                                    Отмена
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveComment}
                                    startIcon={isSavingComment ? <CircularProgress size={20} /> : <SaveIcon />}
                                    disabled={isSavingComment}
                                >
                                    {isSavingComment ? 'Сохранение...' : 'Сохранить'}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Typography className={styles.commentText}>
                            {order?.masterComment || 'Комментарий отсутствует'}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardContent>
                    <Typography variant="h3" className={styles.sectionTitle}>Изменить статус</Typography>
                    <hr className={styles.sectionDivider} />
                    <div className={styles.statusButtonsContainer}>
                        {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
                            <Button
                                key={status}
                                variant={order.status === status ? 'contained' : 'outlined'}
                                color={
                                    status === 'new' ? 'info' :
                                        status === 'in_progress' ? 'warning' :
                                            status === 'waiting_parts' ? 'secondary' :
                                                status === 'ready' ? 'primary' :
                                                    status === 'completed' ? 'success' : 'error'
                                }
                                onClick={() => handleStatusChange(status)}
                                disabled={order.status === status || isChangingStatus}
                                size="small"
                                startIcon={isChangingStatus && order.status !== status ? <CircularProgress size={16} /> : undefined}
                            >
                                {ORDER_STATUS_LABELS[status]}
                            </Button>
                        ))}
                    </div>
                    {isChangingStatus && (
                        <div className={styles.loadingIndicator}>
                            <CircularProgress size={16} className={styles.loadingSpinner} />
                            <Typography color="secondary">Обновление статуса...</Typography>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
} 