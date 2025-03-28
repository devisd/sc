'use client';

import { clsx } from 'clsx';
import styles from './Toolbar.module.scss';

interface ToolbarProps {
    children: React.ReactNode;
    className?: string;
    disableGutters?: boolean;
    variant?: 'regular' | 'dense';
    style?: React.CSSProperties;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    children,
    className = '',
    disableGutters = false,
    variant = 'regular',
    style = {},
    ...props
}) => {
    const toolbarClasses = clsx(
        styles.toolbar,
        styles[variant],
        !disableGutters && styles.withGutters,
        className
    );

    return (
        <div
            className={toolbarClasses}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
};
