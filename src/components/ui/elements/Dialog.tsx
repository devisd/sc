'use client';

import { useEffect } from 'react';
import { clsx } from 'clsx';
import styles from './Dialog.module.scss';

interface DialogProps {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
}

// Компонент диалога, заменяющий MUI Dialog
export const Dialog: React.FC<DialogProps> = ({
    children,
    open,
    onClose,
    maxWidth = 'sm',
    fullWidth = false,
}) => {
    // Блокировка прокрутки при открытом диалоге
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    // Обработка клика на фон (для закрытия)
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const dialogClasses = clsx(
        styles.dialog,
        styles[`maxWidth${maxWidth.charAt(0).toUpperCase() + maxWidth.slice(1)}`],
        fullWidth && styles.fullWidth
    );

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={dialogClasses}>
                {children}
            </div>
        </div>
    );
};

// Компоненты для частей диалога
export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={styles.title}>{children}</div>
);

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={styles.content}>{children}</div>
);

export const DialogActions: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className={styles.actions}>{children}</div>
);
