'use client';

import { AuthForm } from '../../../components/auth/AuthForm';
import styles from '../auth.module.scss';

export default function LoginPage() {
    return (
        <div className={styles.authPage}>
            <div className={styles.authHeader}>
                <h1 className={styles.authTitle}>
                    Вход в систему
                </h1>
                <p className={styles.authSubtitle}>
                    Введите учетные данные для доступа к вашему аккаунту
                </p>
            </div>

            <div className={styles.authFormContainer}>
                <AuthForm isLogin={true} />
            </div>
        </div>
    );
} 