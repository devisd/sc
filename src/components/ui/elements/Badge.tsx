'use client';

import React from 'react';
import { clsx } from 'clsx';
import styles from './Badge.module.scss';

type BadgeColor = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
type BadgeVariant = 'standard' | 'outlined' | 'filled';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
    children: React.ReactNode;
    color?: BadgeColor;
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
    style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    color = 'default',
    variant = 'standard',
    size = 'medium',
    className,
    style,
    ...props
}) => {
    const badgeClasses = clsx(
        styles.badge,
        styles[variant],
        styles[color],
        styles[size],
        className
    );

    return (
        <span className={badgeClasses} style={style} {...props}>
            {children}
        </span>
    );
}; 