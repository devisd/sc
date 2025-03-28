'use client';

import { clsx } from 'clsx';
import styles from './AppBar.module.scss';

interface AppBarProps {
    children: React.ReactNode;
    position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
    color?: 'default' | 'primary' | 'secondary' | 'inherit';
    elevation?: number;
    className?: string;
    style?: React.CSSProperties;
}

export const AppBar: React.FC<AppBarProps> = ({
    children,
    position = 'fixed',
    color = 'primary',
    elevation = 4,
    className = '',
    style = {},
    ...props
}) => {
    // Сопоставление позиций с классами стилей
    const positionStyleMap: Record<string, string> = {
        fixed: styles.positionFixed,
        absolute: styles.positionAbsolute,
        sticky: styles.positionSticky,
        static: styles.positionStatic,
        relative: styles.positionRelative
    };

    const appBarClasses = clsx(
        styles.appBar,
        positionStyleMap[position],
        styles[color],
        styles[`shadow${elevation}`] || styles.shadow4,
        className
    );

    return (
        <header
            className={appBarClasses}
            style={style}
            {...props}
        >
            {children}
        </header>
    );
};

