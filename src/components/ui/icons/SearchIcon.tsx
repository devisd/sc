'use client';

import React from 'react';

interface IconProps {
    color?: string;
    className?: string;
    fontSize?: 'small' | 'medium' | 'large' | 'inherit';
    style?: React.CSSProperties;
}

export const SearchIcon: React.FC<IconProps> = ({
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
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
    );
}; 