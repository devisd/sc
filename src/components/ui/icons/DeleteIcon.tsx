'use client';

import React from 'react';

interface IconProps {
    color?: string;
    className?: string;
    fontSize?: 'small' | 'medium' | 'large' | 'inherit';
    style?: React.CSSProperties;
}

export const DeleteIcon: React.FC<IconProps> = ({
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
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
    );
}; 