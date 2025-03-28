'use client';

import { useAuth } from './AuthProvider';
import { logoutUser } from '../../supabase/auth';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './UserMenu.module.scss';

/**
 * Интерфейс свойств компонента меню пользователя
 */
interface UserMenuProps {
    /** Флаг мобильной версии компонента */
    isMobile?: boolean;
}

/**
 * Компонент меню пользователя с возможностями авторизации/регистрации
 */
export const UserMenu = ({ isMobile = false }: UserMenuProps) => {
    const auth = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Устанавливаем признак монтирования на клиенте
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            setIsOpen(false);
        } catch (error) {
            console.error('Ошибка выхода:', error);
        }
    };

    // Если компонент не смонтирован (SSR), показываем заглушку
    if (!isMounted) {
        return null;
    }

    // Если загрузка еще не завершена, показываем заглушку
    if (auth.loading) {
        return (
            <div className={styles.loadingPlaceholder}></div>
        );
    }

    // Если пользователь не авторизован, показываем ссылки на вход и регистрацию
    if (!auth.user) {
        return (
            <div className={`${styles.authLinks} ${isMobile ? styles.authLinksMobile : ''}`}>
                <Link
                    href="/auth/login"
                    className={styles.loginLink}
                >
                    Вход
                </Link>
                <Link
                    href="/auth/register"
                    className={styles.registerLink}
                >
                    Регистрация
                </Link>
            </div>
        );
    }

    // Имя для отображения (берем из профиля или email)
    const displayName = auth.profile?.display_name || auth.user.email?.split('@')[0] || 'Пользователь';

    // Создаем классы в зависимости от мобильного режима
    const containerClass = `${styles.container} ${isMobile ? styles.containerMobile : ''}`;
    const menuButtonClass = `${styles.menuButton} ${isMobile ? styles.menuButtonMobile : ''}`;
    const dropdownClass = `${styles.dropdown} ${isMobile ? styles.dropdownMobile : ''}`;

    return (
        <div className={containerClass}>
            <button
                onClick={toggleMenu}
                className={menuButtonClass}
            >
                <div className={styles.avatar}>
                    {auth.profile?.photo_url ? (
                        <img
                            src={auth.profile.photo_url}
                            alt={displayName}
                            className={styles.userImage}
                        />
                    ) : (
                        <span>{displayName.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <span className={styles.userName}>{displayName}</span>
            </button>

            {isOpen && (
                <div className={dropdownClass}>
                    <div className={styles.dropdownMenu} role="menu" aria-orientation="vertical">
                        <Link
                            href="/profile"
                            className={styles.menuItem}
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                        >
                            Личный кабинет
                        </Link>
                        <button
                            onClick={handleLogout}
                            className={styles.logoutButton}
                            role="menuitem"
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}; 