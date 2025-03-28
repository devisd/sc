import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from 'react';
import { onAuthChange, getUserProfile, UserProfile } from '../../supabase/auth';

// Интерфейс контекста аутентификации
interface AuthContextType {
    user: any | null;
    profile: UserProfile | null;
    loading: boolean;
}

// Создаем контекст
const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true
});

// Хук для использования контекста
export const useAuth = () => useContext(AuthContext);

// Компонент провайдера аутентификации
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Подписываемся на изменения статуса аутентификации
        const unsubscribe = onAuthChange(async (session) => {
            setLoading(true);
            try {
                if (session && session.user) {
                    setUser(session.user);

                    // Получаем профиль пользователя из базы данных
                    const userProfile = await getUserProfile(session.user.id);
                    setProfile(userProfile);
                } else {
                    setUser(null);
                    setProfile(null);
                }
            } catch (error) {
                console.error('Ошибка при загрузке профиля:', error);
                setUser(null);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        });

        // Отписываемся при размонтировании компонента
        return () => {
            if (unsubscribe && unsubscribe.data && unsubscribe.data.subscription) {
                unsubscribe.data.subscription.unsubscribe();
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
} 