'use client';

import React from 'react';
import { clsx } from 'clsx';
import styles from './IconButton.module.scss';

type IconButtonColor = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
type IconButtonVariant = 'standard' | 'outlined' | 'text';
type IconButtonSize = 'small' | 'medium' | 'large';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: IconButtonColor;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
    color = 'default',
    variant = 'standard',
    size = 'medium',
    className,
    children,
    disabled = false,
    ...props
}) => {
    const buttonClasses = clsx(
        styles.iconButton,
        styles[variant],
        styles[color],
        styles[size],
        disabled && styles.disabled,
        className
    );

    return (
        <button
            className={buttonClasses}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}; 