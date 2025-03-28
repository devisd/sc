'use client';

import clsx from 'clsx';
import styles from './Button.module.scss';

/**
 * Интерфейс пропсов компонента кнопки
 */
interface ButtonProps {
    /** Содержимое кнопки */
    children: React.ReactNode;
    /** Функция обработки клика */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Вариант отображения кнопки */
    variant?: 'text' | 'outlined' | 'contained';
    /** Цветовая схема */
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'inherit';
    /** Размер кнопки */
    size?: 'small' | 'medium' | 'large';
    /** Флаг отключения кнопки */
    disabled?: boolean;
    /** Флаг полной ширины */
    fullWidth?: boolean;
    /** Иконка перед текстом */
    startIcon?: React.ReactNode;
    /** Иконка после текста */
    endIcon?: React.ReactNode;
    /** Тип отображения компонента */
    component?: 'button' | 'a';
    /** URL для ссылки (когда component === 'a') */
    href?: string;
    /** Дополнительные CSS-классы */
    className?: string;
    /** Инлайн-стили */
    style?: React.CSSProperties;
    /** Тип кнопки */
    type?: 'button' | 'submit' | 'reset';
}

/**
 * Компонент кнопки с различными вариантами стилизации
 */
export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
    startIcon,
    endIcon,
    component = 'button',
    href,
    className = '',
    style = {},
    type = 'button',
    ...props
}) => {
    // Формируем базовые классы
    const baseClasses = clsx(
        styles.button,
        styles[size],
        {
            [styles.disabled]: disabled,
            [styles.fullWidth]: fullWidth,
        }
    );

    // Формируем класс для варианта и цвета
    const variantColorClass = styles[`${variant}${color.charAt(0).toUpperCase() + color.slice(1)}`];

    // Объединяем все классы
    const buttonClasses = clsx(baseClasses, variantColorClass, className);

    // Если компонент должен быть ссылкой
    if (component === 'a') {
        return (
            <a href={href} className={buttonClasses} style={style} {...props}>
                {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
                {children}
                {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
            </a>
        );
    }

    // Стандартная кнопка
    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            style={style}
            {...props}
        >
            {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
            {children}
            {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
        </button>
    );
};
