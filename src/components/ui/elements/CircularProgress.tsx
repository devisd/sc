'use client';

import React from 'react';
import { clsx } from 'clsx';
import styles from './CircularProgress.module.scss';

interface CircularProgressProps {
    size?: number;
    thickness?: number;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'inherit';
    variant?: 'determinate' | 'indeterminate';
    value?: number;
    className?: string;
    style?: React.CSSProperties;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    size = 40,
    thickness = 3.6,
    color = 'primary',
    variant = 'indeterminate',
    value = 0,
    className = '',
    style = {},
    ...props
}) => {
    // Строка svg path для круга
    const circumference = 2 * Math.PI * (44 - thickness);
    const circleStyle = variant === 'determinate'
        ? { strokeDasharray: circumference, strokeDashoffset: `${circumference - (value / 100) * circumference}px` }
        : {};

    // Стили размера
    const sizeStyle = {
        width: size,
        height: size,
        ...style
    };

    return (
        <div
            className={clsx(styles.circularProgress, styles[color], className)}
            style={sizeStyle}
            role="progressbar"
            aria-valuenow={variant === 'determinate' ? value : undefined}
            aria-valuemin={0}
            aria-valuemax={100}
            {...props}
        >
            <svg
                className={clsx('w-full h-full', styles[variant])}
                viewBox="22 22 44 44"
            >
                {/* Фоновый круг (более прозрачный) */}
                <circle
                    className={styles.backgroundCircle}
                    cx="44"
                    cy="44"
                    r={44 - thickness}
                    fill="none"
                    strokeWidth={thickness}
                />
                {/* Основной круг прогресса */}
                <circle
                    className={clsx(
                        styles.dashedCircle,
                        variant === 'indeterminate' && styles.indeterminate
                    )}
                    cx="44"
                    cy="44"
                    r={44 - thickness}
                    fill="none"
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    style={circleStyle}
                />
            </svg>
        </div>
    );
};

// Добавляем анимацию в tailwind.config.js
// {
//   theme: {
//     extend: {
//       keyframes: {
//         'circular-dash': {
//           '0%': { strokeDasharray: '1px, 200px', strokeDashoffset: '0px' },
//           '50%': { strokeDasharray: '100px, 200px', strokeDashoffset: '-15px' },
//           '100%': { strokeDasharray: '100px, 200px', strokeDashoffset: '-125px' }
//         }
//       }
//     }
//   }
// }
