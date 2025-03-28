# Аутентификация в приложении

В этом документе описаны методы аутентификации, доступные в приложении с использованием Supabase.

## Методы аутентификации

Приложение поддерживает следующие методы аутентификации:
- Email/Password
- Google OAuth
- Yandex OAuth (если настроено в Supabase)

## Основные функции

Все функции аутентификации находятся в файле `src/supabase/auth.ts`.

### Регистрация пользователя

```typescript
import { registerUser } from '@/supabase/auth';

const handleRegister = async () => {
  try {
    const result = await registerUser(
      'user@example.com',   // Email пользователя
      'password123',        // Пароль
      'Иван Иванов'         // Отображаемое имя (опционально)
    );
    
    console.log('Пользователь зарегистрирован:', result);
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
  }
};
```

### Вход по Email/Password

```typescript
import { loginUser } from '@/supabase/auth';

const handleLogin = async () => {
  try {
    const result = await loginUser(
      'user@example.com',  // Email пользователя
      'password123'        // Пароль
    );
    
    console.log('Пользователь вошел:', result);
  } catch (error) {
    console.error('Ошибка при входе:', error);
  }
};
```

### Вход через Google

```typescript
import { loginWithGoogle } from '@/supabase/auth';

const handleGoogleLogin = async () => {
  try {
    const result = await loginWithGoogle();
    
    // Перенаправление выполняется автоматически,
    // после успешной аутентификации пользователь вернется 
    // на ваш сайт с обновленной сессией
    
    console.log('Пользователь входит через Google');
  } catch (error) {
    console.error('Ошибка при входе через Google:', error);
  }
};
```

### Вход через Яндекс

```typescript
import { loginWithYandex } from '@/supabase/auth';

const handleYandexLogin = async () => {
  try {
    const result = await loginWithYandex();
    
    // Перенаправление выполняется автоматически,
    // после успешной аутентификации пользователь вернется 
    // на ваш сайт с обновленной сессией
    
    console.log('Пользователь входит через Яндекс');
  } catch (error) {
    console.error('Ошибка при входе через Яндекс:', error);
  }
};
```

### Выход пользователя

```typescript
import { logoutUser } from '@/supabase/auth';

const handleLogout = async () => {
  try {
    await logoutUser();
    console.log('Пользователь вышел');
  } catch (error) {
    console.error('Ошибка при выходе:', error);
  }
};
```

## Получение текущего пользователя

```typescript
import { getCurrentUser } from '@/supabase/auth';

const fetchCurrentUser = async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      console.log('Текущий пользователь:', user);
    } else {
      console.log('Пользователь не аутентифицирован');
    }
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
  }
};
```

## Управление профилем пользователя

### Получение профиля

```typescript
import { getUserProfile } from '@/supabase/auth';

const fetchUserProfile = async (userId: string) => {
  try {
    const profile = await getUserProfile(userId);
    console.log('Профиль пользователя:', profile);
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
  }
};
```

### Обновление профиля

```typescript
import { updateUserProfile } from '@/supabase/auth';

const updateProfile = async (userId: string) => {
  try {
    const updatedProfile = await updateUserProfile(userId, {
      first_name: 'Иван',
      last_name: 'Петров',
      position: 'Инженер',
      organization: 'ООО "Техсервис"'
    });
    
    console.log('Обновленный профиль:', updatedProfile);
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
  }
};
```

## Отслеживание изменений состояния аутентификации

```typescript
import { onAuthChange } from '@/supabase/auth';
import { useEffect } from 'react';

const AuthStateComponent = () => {
  useEffect(() => {
    // Подписка на изменения состояния аутентификации
    const unsubscribe = onAuthChange((session) => {
      if (session) {
        console.log('Пользователь вошел в аккаунт:', session.user);
      } else {
        console.log('Пользователь вышел из аккаунта');
      }
    });
    
    // Отписка при размонтировании компонента
    return () => {
      unsubscribe.data.subscription.unsubscribe();
    };
  }, []);
  
  return <div>Слушатель состояния аутентификации</div>;
};
```

## Обработка ошибок аутентификации

Все функции аутентификации выбрасывают исключения в случае ошибки. Рекомендуется всегда оборачивать вызовы в try/catch блоки и отображать понятные для пользователя сообщения об ошибках.

## Безопасность

- Храните все секретные ключи и токены в переменных окружения
- Никогда не храните чувствительные данные на клиенте
- Используйте Row Level Security (RLS) в Supabase для защиты данных
- Регулярно обновляйте зависимости для исправления уязвимостей 