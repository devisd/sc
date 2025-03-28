import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useOrderStore } from '@/lib/stores/orderStore';
import { OrderStatus, ORDER_STATUS_LABELS, DEVICE_TYPE_LABELS, Order } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { SearchIcon } from '@/components/ui/icons';
import { Button, Card, CardContent, Typography } from '../ui/elements';
import styles from './OrderList.module.scss';

// Типы для компонента OrderCard
interface OrderCardProps {
    order: Order;
    isClient: boolean;
}

// Компонент карточки заказа для мемоизации
const OrderCard = ({ order, isClient }: OrderCardProps) => {
    return (
        <Link href={`/orders/${order.id}`} className="block no-underline">
            <Card className={styles.orderCard}>
                <CardContent className={styles.cardContent}>
                    <div className={styles.orderGrid}>
                        <div className={styles.leftColumn}>
                            <div className={styles.infoContainer}>
                                <div className={styles.orderHeader}>
                                    <Typography variant="h3" className={styles.orderTitle}>
                                        Заказ #{order.orderNumber} | {order.clientName}
                                    </Typography>
                                    <StatusBadge status={order.status} />
                                </div>
                                <Typography color="secondary" className={styles.phoneNumber}>
                                    {order.clientPhone}
                                </Typography>
                                <div>
                                    <Typography component="span" color="secondary" className={styles.deviceLabel}>
                                        {DEVICE_TYPE_LABELS[order.deviceType]}:
                                    </Typography>{' '}
                                    <Typography component="span" className={styles.deviceModel}>
                                        {order.deviceModel}
                                    </Typography>
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightColumn}>
                            <div className={styles.orderInfo}>
                                <Typography color="secondary" className={styles.orderDate}>
                                    {isClient ? new Date(order.createdAt).toLocaleDateString() : ''}
                                </Typography>
                                <Typography className={styles.prepayment}>
                                    Предоплата: {order.prepayment} ₽
                                </Typography>
                                <Typography className={styles.servicesInfo}>
                                    {order.services.length > 0
                                        ? `${order.services.length} услуг/запчастей`
                                        : 'Нет услуг'}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

// Основной компонент списка заказов
const OrderList = () => {
    const { orders, fetchOrders, isLoading } = useOrderStore();
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isClient, setIsClient] = useState(false);

    // Fix for hydration - only render dates on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fetch orders on component mount
    useEffect(() => {
        fetchOrders();

        // Refresh orders every 5 minutes
        const intervalId = setInterval(() => {
            fetchOrders();
        }, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [fetchOrders]);

    // Мемоизированный обработчик изменения статуса фильтра
    const handleStatusFilterChange = useCallback((status: OrderStatus | 'all') => {
        setStatusFilter(status);
    }, []);

    // Мемоизированный обработчик поиска
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    // Мемоизированная фильтрация заказов
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const searchTermLower = searchTerm.toLowerCase();
            const matchesSearch =
                searchTerm === '' ||
                order.clientName.toLowerCase().includes(searchTermLower) ||
                order.clientPhone.includes(searchTerm) ||
                order.deviceModel.toLowerCase().includes(searchTermLower) ||
                String(order.orderNumber).includes(searchTerm);

            return matchesStatus && matchesSearch;
        });
    }, [orders, statusFilter, searchTerm]);

    // Статусы для фильтрации
    const statusButtons = useMemo(() => {
        return [
            <Button
                key="all"
                color="primary"
                variant={statusFilter === 'all' ? 'contained' : 'outlined'}
                onClick={() => handleStatusFilterChange('all')}
                className={styles.filterButton}
            >
                Все
            </Button>,
            ...(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
                <Button
                    key={status}
                    color={
                        status === 'new' ? 'info' :
                            status === 'in_progress' ? 'warning' :
                                status === 'waiting_parts' ? 'secondary' :
                                    status === 'ready' ? 'primary' :
                                        status === 'completed' ? 'success' : 'error'
                    }
                    variant={statusFilter === status ? 'contained' : 'outlined'}
                    onClick={() => handleStatusFilterChange(status)}
                    className={styles.filterButton}
                >
                    {ORDER_STATUS_LABELS[status]}
                </Button>
            ))
        ];
    }, [statusFilter, handleStatusFilterChange]);

    // Рендеринг списка заказов
    const renderOrderList = useMemo(() => {
        if (isLoading) {
            return <div>Загрузка...</div>;
        }

        if (filteredOrders.length === 0) {
            return (
                <div className={styles.emptyContainer}>
                    <Typography color="secondary" className={styles.limitText}>
                        Нет заказов, соответствующих критериям поиска
                    </Typography>
                </div>
            );
        }

        // Отображаем только первые 50 заказов для оптимизации
        // В будущем можно добавить пагинацию или виртуализацию
        const displayedOrders = filteredOrders.slice(0, 50);

        return (
            <div className={styles.ordersContainer}>
                {displayedOrders.map((order) => (
                    <OrderCard key={order.id} order={order} isClient={isClient} />
                ))}

                {filteredOrders.length > 50 && (
                    <div className={styles.limitContainer}>
                        <hr className={styles.divider} />
                        <Typography color="secondary" className={styles.limitText}>
                            Показано 50 из {filteredOrders.length} заказов. Используйте поиск для уточнения.
                        </Typography>
                    </div>
                )}
            </div>
        );
    }, [filteredOrders, isClient, isLoading]);

    return (
        <div className={styles.container}>
            <div className="space-y-4">
                <div className={styles.filterContainer}>
                    <div className={styles.searchColumnContainer}>
                        <div className={styles.searchContainer}>
                            <input
                                className={styles.searchInput}
                                placeholder="Поиск по имени, телефону или модели..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <span className={styles.searchIcon}>
                                <SearchIcon className="w-5 h-5" />
                            </span>
                        </div>
                    </div>
                    <div className={styles.filtersColumnContainer}>
                        <div className={styles.filtersWrapper}>
                            {statusButtons}
                        </div>
                    </div>
                </div>

                <div>
                    {renderOrderList}
                </div>
            </div>
        </div>
    );
};

export default OrderList; 