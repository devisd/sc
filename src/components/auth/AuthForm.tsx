import { useState } from 'react';
import { registerUser, loginUser, loginWithGoogle, loginWithYandex } from '../../supabase/auth';
import { useRouter } from 'next/navigation';
import styles from './AuthForm.module.scss';

interface AuthFormProps {
    isLogin?: boolean; // true для входа, false для регистрации
}

export const AuthForm = ({ isLogin = true }: AuthFormProps) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Вход пользователя
                await loginUser(email, password);
            } else {
                // Регистрация пользователя
                await registerUser(email, password, name);
            }

            // Перенаправляем на главную страницу после успешной авторизации
            router.push('/');
        } catch (error: any) {
            console.error('Ошибка аутентификации:', error);
            setError(error.message || 'Произошла ошибка при авторизации');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setError('');
        setLoading(true);

        try {
            await loginWithGoogle();
            router.push('/');
        } catch (error: any) {
            console.error('Ошибка входа через Google:', error);
            setError(error.message || 'Произошла ошибка при входе через Google');
        } finally {
            setLoading(false);
        }
    };

    const handleYandexAuth = async () => {
        setError('');
        setLoading(true);

        try {
            await loginWithYandex();
            router.push('/');
        } catch (error: any) {
            console.error('Ошибка входа через Яндекс:', error);
            setError(error.message || 'Произошла ошибка при входе через Яндекс');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                {isLogin ? 'Вход в систему' : 'Регистрация'}
            </h2>

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                {!isLogin && (
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                            Имя
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            required={!isLogin}
                        />
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>
                        Пароль
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </div>
            </form>

            <div className={styles.divider}>
                <div className={styles.dividerText}>
                    <span className={styles.dividerTextSpan}>
                        Или продолжить с
                    </span>
                </div>
            </div>

            <div className={styles.socialButtonsContainer}>
                <button
                    onClick={handleGoogleAuth}
                    className={styles.socialButton}
                >
                    Google
                </button>
                <button
                    onClick={handleYandexAuth}
                    className={styles.socialButton}
                >
                    Яндекс
                </button>
            </div>

            <div className={styles.authToggleContainer}>
                {isLogin ? (
                    <p>
                        Еще нет аккаунта?{' '}
                        <a
                            href="/auth/register"
                            className={styles.authToggleLink}
                        >
                            Зарегистрироваться
                        </a>
                    </p>
                ) : (
                    <p>
                        Уже есть аккаунт?{' '}
                        <a
                            href="/auth/login"
                            className={styles.authToggleLink}
                        >
                            Войти
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
}; 