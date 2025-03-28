import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import styles from './ProtectedRoute.module.scss';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    // Проверяем, что мы на клиенте
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Редирект на страницу логина, если пользователь не авторизован
    useEffect(() => {
        if (isClient && !loading && !user) {
            router.push('/login');
        }
    }, [isClient, user, loading, router]);

    // Показываем лоадер пока проверяем авторизацию
    if (!isClient || loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    // Если пользователь авторизован, показываем содержимое страницы
    return <>{children}</>;
}; 