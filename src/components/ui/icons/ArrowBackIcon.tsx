'use client';

import React from 'react';

interface IconProps {
    color?: string;
    className?: string;
    fontSize?: 'small' | 'medium' | 'large' | 'inherit';
    style?: React.CSSProperties;
}

export const ArrowBackIcon: React.FC<IconProps> = ({
    color = 'currentColor',
    className = '',
    fontSize = 'medium',
    style = {},
    ...props
}) => {
    const getFontSize = () => {
        switch (fontSize) {
            case 'small': return '1rem';
            case 'large': return '2rem';
            case 'inherit': return 'inherit';
            default: return '1.5rem';
        }
    };

    return (
        <svg
            className={className}
            style={{ fontSize: getFontSize(), width: '1em', height: '1em', ...style }}
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill={color}
            {...props}
        >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
    );
}; 