'use client';

import React from 'react';
import styles from './OrderListSkeleton.module.scss';
import { Skeleton } from './SkeletonLoader';

interface OrderListSkeletonProps {
    rowCount?: number;
}

export const OrderListSkeleton: React.FC<OrderListSkeletonProps> = ({ rowCount = 5 }) => {
    return (
        <div className={styles.container}>
            {Array.from({ length: rowCount }).map((_, index) => (
                <div key={index} className={styles.card}>
                    <div className={styles.cardContent}>
                        <div className={styles.headerRow}>
                            <Skeleton variant="rectangular" width="40%" height={24} />
                            <Skeleton variant="rounded" width={60} height={24} />
                        </div>
                        <Skeleton variant="text" width="30%" />
                        <div className={styles.detailsRow}>
                            <Skeleton variant="text" width="60%" />
                            <div className={styles.rightColumn}>
                                <Skeleton variant="text" width="80%" />
                                <Skeleton variant="text" width="60%" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}; 