'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './BurgerMenu.module.scss';

/**
 * Интерфейс свойств компонента бургер-меню
 */
interface BurgerMenuProps {
    /** Массив пунктов меню */
    menuItems: {
        href: string;
        label: string;
    }[];
    /** Компонент авторизации для отображения в бургер-меню */
    authComponent?: React.ReactNode;
}

/**
 * Компонент бургер-меню для мобильных и планшетных устройств
 */
export const BurgerMenu: React.FC<BurgerMenuProps> = ({ menuItems, authComponent }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Переключение состояния меню
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Закрытие меню при клике вне его области
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Закрытие меню при клике на пункт меню
    const handleMenuItemClick = () => {
        setIsOpen(false);
    };

    return (
        <div className={styles.burgerMenuContainer} ref={menuRef}>
            {/* Кнопка бургер-меню */}
            <button
                className={`${styles.burgerButton} ${isOpen ? styles.active : ''}`}
                onClick={toggleMenu}
                aria-expanded={isOpen}
                aria-label="Меню навигации"
            >
                <span className={styles.burgerLine}></span>
                <span className={styles.burgerLine}></span>
                <span className={styles.burgerLine}></span>
            </button>

            {/* Выпадающее меню */}
            <div className={`${styles.menuOverlay} ${isOpen ? styles.open : ''}`} onClick={toggleMenu}></div>
            <div className={`${styles.menuContent} ${isOpen ? styles.open : ''}`}>
                <nav className={styles.menuNav}>
                    <ul className={styles.menuList}>
                        {menuItems.map((item, index) => (
                            <li key={index} className={styles.menuItem}>
                                <Link
                                    href={item.href}
                                    className={styles.menuLink}
                                    onClick={handleMenuItemClick}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Компонент авторизации */}
                    {authComponent && (
                        <div className={styles.authContainer}>
                            {authComponent}
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
}; 