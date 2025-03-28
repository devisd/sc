'use client';

import { AuthForm } from '../../../components/auth/AuthForm';
import styles from '../auth.module.scss';

export default function RegisterPage() {
    return (
        <div className={styles.authPage}>
            <div className={styles.authHeader}>
                <h1 className={styles.authTitle}>
                    Регистрация
                </h1>
                <p className={styles.authSubtitle}>
                    Создайте новый аккаунт для доступа к сервису
                </p>
            </div>

            <div className={styles.authFormContainer}>
                <AuthForm isLogin={false} />
            </div>
        </div>
    );
} 