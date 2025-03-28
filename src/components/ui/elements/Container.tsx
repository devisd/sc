'use client';

import { forwardRef } from 'react';
import { Box } from './Box';

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    maxWidth?: ContainerSize;
    disableGutters?: boolean;
    fixed?: boolean;
    component?: React.ElementType;
}

// Максимальные ширины для разных размеров контейнера
const maxWidthValues = {
    xs: '444px',
    sm: '600px',
    md: '900px',
    lg: '1200px',
    xl: '1536px',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
    ({
        children,
        maxWidth = 'lg',
        disableGutters = false,
        fixed = false,
        component = 'div',
        className = '',
        ...other
    }, ref) => {
        const sx: React.CSSProperties = {
            width: '100%',
            display: 'block',
            boxSizing: 'border-box',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: disableGutters ? 0 : '16px',
            paddingRight: disableGutters ? 0 : '16px',
            ...(fixed && {
                maxWidth: maxWidthValues[maxWidth],
            }),
            ...(!fixed && {
                maxWidth: `min(${maxWidthValues[maxWidth]}, 100%)`,
            }),
        };

        return (
            <Box
                ref={ref}
                component={component}
                className={className}
                sx={sx}
                {...other}
            >
                {children}
            </Box>
        );
    }
);

Container.displayName = 'Container';
