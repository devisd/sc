'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Order, OrderStatus, ORDER_STATUS_LABELS, DEVICE_TYPE_LABELS, Service } from '@/lib/types';
import { useOrderStore } from '@/lib/stores/orderStore';
import { StatusBadge } from '@/components/orders/StatusBadge';
import {
    Box, Container, Typography, Button, Grid, Card, CardContent,
    CircularProgress, Alert, Divider, Breadcrumbs, Stack, TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ServiceSelector from '@/components/orders/ServiceSelector';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    // Unwrap params using React.use()
    const unwrappedParams = typeof params === 'object' && !('then' in params) ? params : use(params);
    const { getOrderById, updateOrderStatus, updateOrder, isLoading, error, fetchOrders, addServiceToOrder, removeServiceFromOrder, updateServiceQuantity } = useOrderStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSavingComment, setIsSavingComment] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [serviceOperationInProgress, setServiceOperationInProgress] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Подгружаем все заказы, если они еще не загружены
        fetchOrders().then(() => {
            const foundOrder = getOrderById(unwrappedParams.id);
            if (foundOrder) {
                setOrder(foundOrder);
                setCommentText(foundOrder.masterComment || '');
            }
        });
    }, [getOrderById, unwrappedParams.id, fetchOrders]);

    const handleStatusChange = async (status: OrderStatus) => {
        if (isChangingStatus) return;

        setIsChangingStatus(true);
        try {
            await updateOrderStatus(order!.id, status);
            setOrder(prev => prev ? { ...prev, status } : null);
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
        } finally {
            setIsChangingStatus(false);
        }
    };

    // Calculate total cost
    const totalServicesPrice = order?.services.reduce((total, service) => {
        const quantity = service.quantity || 1;
        return total + (service.price * quantity);
    }, 0) || 0;

    const handleStartEditComment = () => {
        setIsEditingComment(true);
        setCommentText(order?.masterComment || '');
    };

    const handleCancelEditComment = () => {
        setIsEditingComment(false);
        setCommentText(order?.masterComment || '');
    };

    const handleSaveComment = async () => {
        if (!order || isSavingComment) return;

        setIsSavingComment(true);
        try {
            await updateOrder(order.id, { masterComment: commentText });
            setOrder(prev => prev ? { ...prev, masterComment: commentText } : null);
            setIsEditingComment(false);
        } catch (error) {
            console.error('Ошибка при обновлении комментария:', error);
        } finally {
            setIsSavingComment(false);
        }
    };

    // Обертки для операций с услугами с индикацией загрузки
    const handleAddService = async (service: Omit<Service, 'id'>) => {
        if (!order || serviceOperationInProgress) return;

        setServiceOperationInProgress(true);
        try {
            await addServiceToOrder(order.id, service);
        } catch (error) {
            console.error('Ошибка при добавлении услуги:', error);
        } finally {
            setServiceOperationInProgress(false);
        }
    };

    const handleRemoveService = async (serviceId: string) => {
        if (!order || serviceOperationInProgress) return;

        setServiceOperationInProgress(true);
        try {
            await removeServiceFromOrder(order.id, serviceId);
        } catch (error) {
            console.error('Ошибка при удалении услуги:', error);
        } finally {
            setServiceOperationInProgress(false);
        }
    };

    const handleUpdateQuantity = async (serviceId: string, quantity: number) => {
        if (!order || serviceOperationInProgress) return;

        setServiceOperationInProgress(true);
        try {
            await updateServiceQuantity(order.id, serviceId, quantity);
        } catch (error) {
            console.error('Ошибка при обновлении количества услуги:', error);
        } finally {
            setServiceOperationInProgress(false);
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
                <Button
                    component={Link}
                    href="/orders"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mt: 2 }}
                >
                    Вернуться к списку заказов
                </Button>
            </Container>
        );
    }

    if (!order) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Card sx={{ mb: 2, bgcolor: 'error.light', p: 3 }}>
                    <Typography variant="h5" color="error.dark" gutterBottom>
                        Заказ не найден
                    </Typography>
                    <Typography color="error.dark" paragraph>
                        Заказ с ID {unwrappedParams.id} не существует или был удален.
                    </Typography>
                    <Button
                        component={Link}
                        href="/orders"
                        variant="outlined"
                        color="error"
                        startIcon={<ArrowBackIcon />}
                    >
                        Вернуться к списку заказов
                    </Button>
                </Card>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Breadcrumbs sx={{ mb: 3 }}>
                <Link href="/orders">
                    <Typography
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                    >
                        <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Заказы
                    </Typography>
                </Link>
                <Typography color="text.primary">Заказ #{order.orderNumber}</Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Заказ #{order.orderNumber}
                </Typography>
                <StatusBadge status={order.status} />
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card elevation={1}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Информация о клиенте</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">ФИО:</Typography>
                                    <Typography variant="body1">{order.client.fullName}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Телефон:</Typography>
                                    <Typography variant="body1">{order.client.phone}</Typography>
                                </Box>
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Создан: {isClient ? new Date(order.createdAt).toLocaleString() : ''}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={1}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Информация об устройстве</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Тип:</Typography>
                                    <Typography variant="body1">{DEVICE_TYPE_LABELS[order.deviceType]}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Модель:</Typography>
                                    <Typography variant="body1">{order.model}</Typography>
                                </Box>
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Описание проблемы:</Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                        {order.problemDescription}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={1}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Финансовая информация</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={1}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Предоплата:</Typography>
                                    <Typography variant="body1">{order.prepayment} ₽</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Стоимость услуг:</Typography>
                                    <Typography variant="body1">{totalServicesPrice} ₽</Typography>
                                </Box>
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">К оплате:</Typography>
                                    <Typography variant="h6" color="primary.main">
                                        {Math.max(0, totalServicesPrice - order.prepayment)} ₽
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card elevation={1} sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Услуги и запчасти</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <ServiceSelector
                        orderServices={order.services}
                        onAddService={handleAddService}
                        onRemoveService={handleRemoveService}
                        onUpdateQuantity={handleUpdateQuantity}
                    />
                    {serviceOperationInProgress && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'text.secondary', justifyContent: 'center' }}>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            <Typography variant="body2">Обработка операции...</Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Card elevation={1} sx={{ mb: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>Комментарий мастера</Typography>
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
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    {isEditingComment ? (
                        <>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Введите комментарий мастера"
                                sx={{ mb: 2 }}
                                disabled={isSavingComment}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
                                    startIcon={isSavingComment ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                    disabled={isSavingComment}
                                >
                                    {isSavingComment ? 'Сохранение...' : 'Сохранить'}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Typography sx={{ whiteSpace: 'pre-line' }}>
                            {order?.masterComment || 'Комментарий отсутствует'}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            <Card elevation={1} sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Изменить статус</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                                startIcon={isChangingStatus && order.status !== status ? <CircularProgress size={16} color="inherit" /> : undefined}
                            >
                                {ORDER_STATUS_LABELS[status]}
                            </Button>
                        ))}
                    </Box>
                    {isChangingStatus && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, color: 'text.secondary' }}>
                            <CircularProgress size={16} sx={{ mr: 1 }} />
                            <Typography variant="body2">Обновление статуса...</Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
} 