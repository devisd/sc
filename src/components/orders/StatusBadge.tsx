'use client';

import React from 'react';
import { OrderStatus } from '@/lib/types';
import styles from './StatusBadge.module.scss';
import clsx from 'clsx';

interface StatusBadgeProps {
    status: OrderStatus;
    className?: string;
    isStatic?: boolean;
}

const statusData: Record<OrderStatus, { label: string; variant: OrderStatus }> = {
    new: { label: 'Новый', variant: 'new' },
    in_progress: { label: 'В работе', variant: 'in_progress' },
    waiting_parts: { label: 'Ожидание запчастей', variant: 'waiting_parts' },
    ready: { label: 'Готов', variant: 'ready' },
    completed: { label: 'Завершен', variant: 'completed' },
    canceled: { label: 'Отменен', variant: 'canceled' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', isStatic = false }) => {
    const { label, variant } = statusData[status];

    return (
        <span
            className={clsx(
                styles.badge,
                styles[variant],
                { [styles.static]: isStatic },
                className
            )}
        >
            {label}
        </span>
    );
}; 