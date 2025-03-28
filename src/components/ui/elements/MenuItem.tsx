'use client';

import { clsx } from 'clsx';

interface MenuItemProps {
    children: React.ReactNode;
    value?: string | number;
    disabled?: boolean;
    className?: string;
    selected?: boolean;
    onClick?: React.MouseEventHandler<HTMLLIElement>;
}

export const MenuItem: React.FC<MenuItemProps> = ({
    children,
    value,
    disabled = false,
    className = '',
    selected = false,
    onClick,
    ...props
}) => {
    const menuItemClasses = clsx(
        'px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer',
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        selected ? 'bg-gray-100 font-medium' : '',
        className
    );

    const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
        if (!disabled && onClick) {
            onClick(event);
        }
    };

    return (
        <li
            className={menuItemClasses}
            onClick={handleClick}
            data-value={value}
            role="menuitem"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            {...props}
        >
            {children}
        </li>
    );
};
