'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";
import { AuthProvider } from "./auth/AuthProvider";
import { UserMenu } from "./auth/UserMenu";
import { BurgerMenu } from "./BurgerMenu";
import styles from "./ClientLayout.module.scss";

/**
 * Интерфейс свойств макета клиентской части
 */
interface ClientLayoutProps {
    /** Дочерние компоненты для отображения в основной области */
    children: React.ReactNode;
}

/**
 * Пункты меню навигации
 */
const NAV_ITEMS = [
    { href: "/orders", label: "Заказы" },
    { href: "/services", label: "Услуги и запчасти" }
];

/**
 * Компонент макета клиентской части приложения
 * Включает в себя хедер, навигацию и основную область контента
 */
export const ClientLayout = ({ children }: ClientLayoutProps) => {
    const [isMobile, setIsMobile] = useState(false);

    // Определение мобильного устройства при загрузке и изменении размера экрана
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 992);
        };

        // Проверяем при первой загрузке
        checkIfMobile();

        // Добавляем слушатель изменения размера окна
        window.addEventListener('resize', checkIfMobile);

        // Удаляем слушатель при размонтировании компонента
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    return (
        <ThemeProvider>
            <AuthProvider>
                {/* Шапка сайта */}
                <header className={styles.header}>
                    <div className={styles.headerContainer}>
                        <div className={styles.headerContent}>
                            {/* Логотип и навигация */}
                            <div className={styles.logoContainer}>
                                <div className={styles.logoWrapper}>
                                    <Link href="/" className={styles.logo}>
                                        Сервисный Центр
                                    </Link>

                                    {/* Правые элементы для мобильных устройств */}
                                    {isMobile && (
                                        <div className={styles.mobileControls}>
                                            <ThemeToggle />
                                            <BurgerMenu
                                                menuItems={NAV_ITEMS}
                                                authComponent={<UserMenu isMobile={true} />}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Обычная навигация для десктопов */}
                                {!isMobile && (
                                    <nav className={styles.nav}>
                                        <div className={styles.navLinks}>
                                            {NAV_ITEMS.map((item, index) => (
                                                <Link
                                                    key={index}
                                                    href={item.href}
                                                    className={styles.navLink}
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </nav>
                                )}
                            </div>

                            {/* Правая часть шапки для десктопов: меню пользователя и переключатель темы */}
                            {!isMobile && (
                                <div className={styles.rightSide}>
                                    <UserMenu />
                                    <ThemeToggle />
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                {/* Основная область контента */}
                <main className={styles.mainContainer}>
                    {children}
                </main>
            </AuthProvider>
        </ThemeProvider>
    );
}; 