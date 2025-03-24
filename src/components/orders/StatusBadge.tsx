import { OrderStatus, ORDER_STATUS_LABELS } from '@/lib/types';
import Chip from '@mui/material/Chip';
import { ChipProps } from '@mui/material';

interface StatusBadgeProps {
    status: OrderStatus;
}

// Функция для определения цвета чипа на основе статуса
const getStatusColor = (status: OrderStatus): ChipProps['color'] => {
    switch (status) {
        case 'new':
            return 'info';
        case 'in_progress':
            return 'warning';
        case 'waiting_parts':
            return 'secondary';
        case 'ready':
            return 'primary';
        case 'completed':
            return 'success';
        case 'canceled':
            return 'error';
        default:
            return 'default';
    }
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const colorType = getStatusColor(status);

    return (
        <Chip
            label={ORDER_STATUS_LABELS[status]}
            color={colorType}
            size="small"
            sx={{
                fontWeight: 'medium',
                '&.MuiChip-colorInfo': { bgcolor: 'rgb(191 219 254)' },
                '&.MuiChip-colorWarning': { bgcolor: 'rgb(254 240 138)' },
                '&.MuiChip-colorSecondary': { bgcolor: 'rgb(233 213 255)' },
                '&.MuiChip-colorPrimary': { bgcolor: 'rgb(74 222 128)' },
                '&.MuiChip-colorSuccess': { bgcolor: 'rgb(22 163 74)' },
                '&.MuiChip-colorError': { bgcolor: 'rgb(248 113 113)' },
            }}
        />
    );
}; 