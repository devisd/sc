'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
    component?: React.ElementType;
    sx?: React.CSSProperties;
    children?: React.ReactNode;
    className?: string;
}

// Компонент бокса, заменяющий MUI Box
export const Box = forwardRef<HTMLDivElement, BoxProps>(
    ({ component = 'div', sx, children, className = '', ...other }, ref) => {
        const boxClasses = clsx(className);

        if (component === 'span') {
            return (
                <span ref={ref} className={boxClasses} style={sx} {...other}>
                    {children}
                </span>
            );
        }
        if (component === 'section') {
            return (
                <section ref={ref} className={boxClasses} style={sx} {...other}>
                    {children}
                </section>
            );
        }
        if (component === 'article') {
            return (
                <article ref={ref} className={boxClasses} style={sx} {...other}>
                    {children}
                </article>
            );
        }
        if (component === 'aside') {
            return (
                <aside ref={ref} className={boxClasses} style={sx} {...other}>
                    {children}
                </aside>
            );
        }
        if (component === 'header') {
            return (
                <header ref={ref} className={boxClasses} style={sx} {...other}>
                    {children}
                </header>
            );
        }
        if (component === 'footer') {
            return (
                <footer ref={ref} className={boxClasses} style={sx} {...other}>
                    {children}
                </footer>
            );
        }
        if (component === 'main') {
            return (
                <main ref={ref} className={boxClasses} style={sx} {...other}>
                    {children}
                </main>
            );
        }

        // По умолчанию - div
        return (
            <div ref={ref} className={boxClasses} style={sx} {...other}>
                {children}
            </div>
        );
    }
);

Box.displayName = 'Box';
