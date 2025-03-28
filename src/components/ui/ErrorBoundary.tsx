'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.scss';

/**
 * Интерфейс пропсов компонента обработки ошибок
 */
interface Props {
    /** Дочерние элементы */
    children: ReactNode;
    /** Функция, вызываемая при сбросе ошибки */
    onReset?: () => void;
}

/**
 * Состояние компонента
 */
interface State {
    /** Флаг наличия ошибки */
    hasError: boolean;
    /** Объект ошибки */
    error: Error | null;
}

/**
 * Компонент-граница для перехвата и обработки ошибок рендеринга
 * в дочерних компонентах React
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    /**
     * Статический метод для обновления состояния при ошибке
     */
    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    /**
     * Метод жизненного цикла для логирования ошибок
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Перехвачена ошибка:', error, errorInfo);
    }

    /**
     * Обработчик сброса ошибки
     */
    handleReset = () => {
        this.setState({ hasError: false, error: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        // Если есть ошибка, показываем сообщение об ошибке
        if (this.state.hasError) {
            return (
                <div className={styles.errorContainer}>
                    <div className={styles.errorContent}>
                        <h2 className={styles.errorTitle}>Что-то пошло не так</h2>
                        <p className={styles.errorMessage}>
                            {this.state.error?.message || 'Произошла непредвиденная ошибка'}
                        </p>
                        <button
                            className={styles.errorButton}
                            onClick={this.handleReset}
                        >
                            Попробовать снова
                        </button>
                    </div>
                </div>
            );
        }

        // Если ошибок нет, рендерим дочерние компоненты
        return this.props.children;
    }
} 