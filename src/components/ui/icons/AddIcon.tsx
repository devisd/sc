'use client';

import React from 'react';

interface IconProps {
    color?: string;
    className?: string;
    fontSize?: 'small' | 'medium' | 'large' | 'inherit';
    style?: React.CSSProperties;
}

export const AddIcon: React.FC<IconProps> = ({
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
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
    );
}; 