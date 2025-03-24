import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOrderStore } from '@/lib/stores/orderStore';
import { OrderStatus, ORDER_STATUS_LABELS, DEVICE_TYPE_LABELS } from '@/lib/types';
import { StatusBadge } from './StatusBadge';

// MUI компоненты
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    ButtonGroup,
    Stack,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const OrderList = () => {
    const { orders } = useOrderStore();
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isClient, setIsClient] = useState(false);

    // Fix for hydration - only render dates on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Filter orders based on status and search term
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesSearch =
            searchTerm === '' ||
            order.client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.client.phone.includes(searchTerm) ||
            order.model.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    return (
        <Box sx={{ mt: 3 }}>
            <Stack spacing={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            placeholder="Поиск по имени, телефону или модели..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <ButtonGroup
                            variant="outlined"
                            sx={{ overflowX: 'auto', pb: 1, display: 'flex', flexWrap: { xs: 'wrap', md: 'nowrap' } }}
                        >
                            <Button
                                color="primary"
                                variant={statusFilter === 'all' ? 'contained' : 'outlined'}
                                onClick={() => setStatusFilter('all')}
                            >
                                Все
                            </Button>

                            {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
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
                                    onClick={() => setStatusFilter(status)}
                                >
                                    {ORDER_STATUS_LABELS[status]}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </Grid>
                </Grid>

                <Box>
                    {filteredOrders.length === 0 ? (
                        <Card sx={{ bgcolor: 'grey.100', py: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                Нет заказов, соответствующих критериям поиска
                            </Typography>
                        </Card>
                    ) : (
                        <Stack spacing={2}>
                            {filteredOrders.map((order) => (
                                <Card
                                    key={order.id}
                                    component={Link}
                                    href={`/orders/${order.id}`}
                                    variant="outlined"
                                    sx={{
                                        mb: 2,
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 2
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs={12} sm={7}>
                                                <Stack spacing={1}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="subtitle1" fontWeight="medium">
                                                            Заказ #{order.orderNumber} | {order.client.fullName}
                                                        </Typography>
                                                        <StatusBadge status={order.status} />
                                                    </Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {order.client.phone}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        <Typography component="span" variant="body2" color="text.secondary">
                                                            {DEVICE_TYPE_LABELS[order.deviceType]}:
                                                        </Typography>{' '}
                                                        <Typography component="span" variant="body2" fontWeight="medium">
                                                            {order.model}
                                                        </Typography>
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} sm={5}>
                                                <Stack spacing={1} alignItems={{ xs: 'flex-start', sm: 'flex-end' }} sx={{ mt: { xs: 2, sm: 0 } }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {isClient ? new Date(order.createdAt).toLocaleDateString() : ''}
                                                    </Typography>
                                                    <Typography variant="subtitle2">
                                                        Предоплата: {order.prepayment} ₽
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {order.services.length > 0
                                                            ? `${order.services.length} услуг/запчастей`
                                                            : 'Нет услуг'}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Stack>
        </Box>
    );
}; 