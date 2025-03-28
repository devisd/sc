'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.scss';

/**
 * Компонент переключателя между светлой и темной темой
 * Использует next-themes для управления темой
 */
export function ThemeToggle() {
    // Состояние для отслеживания завершения монтирования компонента
    const [mounted, setMounted] = useState(false);
    // Получаем текущую тему и функцию для её изменения из контекста
    const { theme, setTheme } = useTheme();

    /**
     * Устанавливаем флаг mounted в true после монтирования компонента
     * Это помогает избежать проблем с гидратацией (разница между SSR и клиентом)
     */
    useEffect(() => {
        setMounted(true);
    }, []);

    // Если компонент еще не смонтирован, показываем заглушку того же размера
    if (!mounted) {
        return <div className={styles.placeholder}></div>;
    }

    // Функция для переключения темы
    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    return (
        <button
            aria-label="Переключатель темы"
            className={styles.toggleButton}
            onClick={toggleTheme}
        >
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={styles.icon}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={styles.icon}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
} 