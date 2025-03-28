import { supabase } from './supabase';
import { Database } from './types';

export type UserProfile = Database['public']['Tables']['users']['Row'];

// Регистрация пользователя по email и паролю
export const registerUser = async (email: string, password: string, displayName?: string) => {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: displayName
            }
        }
    });

    if (signUpError) throw signUpError;

    if (authData.user) {
        // Создаем профиль пользователя
        const profile: Database['public']['Tables']['users']['Insert'] = {
            id: authData.user.id,
            email: authData.user.email!,
            display_name: displayName,
            created_at: Date.now(),
            updated_at: Date.now()
        };

        const { error: profileError } = await supabase
            .from('users')
            .insert(profile);

        if (profileError) throw profileError;
    }

    return authData;
};

// Вход пользователя по email и паролю
export const loginUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data;
};

// Вход через Google
export const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
    });

    if (error) throw error;
    return data;
};

// Вход через Яндекс (требует настройки в Supabase)
// Примечание: OAuth провайдер Yandex может быть недоступен по умолчанию,
// требуется настройка через API Supabase
export const loginWithYandex = async () => {
    // В текущей версии используем обобщенный метод для OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
        // @ts-ignore - игнорируем ошибку типа, если Яндекс не в списке стандартных провайдеров
        provider: 'yandex'
    });

    if (error) throw error;
    return data;
};

// Выход пользователя
export const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Слушатель изменения состояния аутентификации
export const onAuthChange = (callback: (session: any) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(session);
    });
};

// Получение текущего пользователя
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};

// Получение профиля пользователя
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) throw error;
    return data;
};

// Обновление профиля пользователя
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
    const updateData = {
        ...data,
        updated_at: Date.now()
    };

    const { data: updatedProfile, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return updatedProfile;
}; 