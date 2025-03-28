'use client';

import React from 'react';

interface IconProps {
    color?: string;
    className?: string;
    fontSize?: 'small' | 'medium' | 'large' | 'inherit';
    style?: React.CSSProperties;
}

export const EditIcon: React.FC<IconProps> = ({
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
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
    );
}; 