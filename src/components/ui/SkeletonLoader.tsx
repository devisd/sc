'use client';

import React from 'react';
import styles from './SkeletonLoader.module.scss';

interface SkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | false;
    className?: string;
    style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    animation = 'pulse',
    className = '',
    style = {},
}) => {
    const getWidthStyle = () => {
        if (!width) {
            return variant === 'text' ? '100%' : 40;
        }
        return typeof width === 'number' ? `${width}px` : width;
    };

    const getHeightStyle = () => {
        if (!height) {
            return variant === 'text' ? '1.2em' : 40;
        }
        return typeof height === 'number' ? `${height}px` : height;
    };

    const getVariantClass = () => {
        switch (variant) {
            case 'circular':
                return styles.skeletonCircular;
            case 'rectangular':
                return styles.skeletonRectangular;
            case 'rounded':
                return styles.skeletonRounded;
            default:
                return styles.skeletonText;
        }
    };

    const getAnimationClass = () => {
        if (!animation) return '';
        return animation === 'pulse' ? styles.skeletonPulse : styles.skeletonWave;
    };

    return (
        <span
            className={`${styles.skeleton} ${getVariantClass()} ${getAnimationClass()} ${className}`}
            style={{
                width: getWidthStyle(),
                height: getHeightStyle(),
                ...style
            }}
        />
    );
};

export const SkeletonLoader: React.FC = () => {
    return (
        <div className={styles.skeletonContainer}>
            <div className={styles.skeletonCard}>
                <div className={styles.skeletonStack}>
                    <Skeleton variant="rectangular" height={40} width="40%" />
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="50%" />
                    <div className={styles.skeletonRow}>
                        <Skeleton variant="text" width="30%" />
                        <Skeleton variant="text" width="30%" />
                    </div>
                    <Skeleton variant="rectangular" height={50} width="100%" />
                </div>
            </div>
        </div>
    );
}; 