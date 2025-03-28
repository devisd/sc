# Миграция с Firebase на Supabase

В этом документе описан процесс миграции приложения с Firebase на Supabase.

## Почему Supabase вместо Firebase

Supabase предлагает несколько преимуществ по сравнению с Firebase:

1. **Открытый исходный код** - Supabase полностью open-source и может быть развернут самостоятельно
2. **PostgreSQL** - использует реляционную СУБД вместо NoSQL подхода Firebase
3. **Предсказуемая ценовая политика** - без неожиданных счетов при росте трафика
4. **Расширенный SQL API** - полная мощь PostgreSQL и его расширений
5. **Реальная типизация данных** - строгие типы благодаря реляционной модели
6. **Простота миграции данных** - стандартные инструменты SQL

## Основные отличия

### Аутентификация

| Firebase | Supabase |
|----------|----------|
| `firebase.auth().createUserWithEmailAndPassword()` | `supabase.auth.signUp()` |
| `firebase.auth().signInWithEmailAndPassword()` | `supabase.auth.signInWithPassword()` |
| `firebase.auth().signOut()` | `supabase.auth.signOut()` |
| `onAuthStateChanged()` | `onAuthStateChange()` |
| `auth.currentUser` | `await supabase.auth.getUser()` |

### База данных

| Firebase | Supabase |
|----------|----------|
| `firebase.firestore().collection().add()` | `supabase.from().insert()` |
| `firebase.firestore().collection().doc().get()` | `supabase.from().select().eq().single()` |
| `firebase.firestore().collection().doc().update()` | `supabase.from().update().eq()` |
| `firebase.firestore().collection().doc().delete()` | `supabase.from().delete().eq()` |
| `firebase.firestore().collection().where().get()` | `supabase.from().select().filter()` |

## Шаги миграции

### 1. Подготовка

1. Создайте проект в Supabase
2. Установите библиотеку Supabase:
   ```bash
   npm install @supabase/supabase-js
   ```
3. Создайте базовую структуру таблиц в Supabase

### 2. Настройка переменных окружения

```env
# Firebase (устаревшие)
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ...

# Supabase (новые)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Миграция аутентификации

Создайте файл `src/supabase/auth.ts`:

```typescript
import { supabase } from './supabase';
import { Database } from './types';

export type UserProfile = Database['public']['Tables']['users']['Row'];

// Регистрация пользователя
export const registerUser = async (email: string, password: string, displayName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName
      }
    }
  });
  
  if (error) throw error;
  return data;
};

// И другие функции аутентификации...
```

### 4. Миграция базы данных

Создайте файл `src/supabase/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Базовые функции для работы с данными
// ...
```

### 5. Перенос данных из Firebase в Supabase

Для переноса данных вы можете создать скрипт миграции:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';

// Конфигурация Firebase
const firebaseConfig = { /* ... */ };
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

// Конфигурация Supabase
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-service-role-key'; // Используйте service_role ключ для миграции
const supabase = createClient(supabaseUrl, supabaseKey);

// Функция миграции коллекции
async function migrateCollection(collectionName, tableName) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  
  const documents = snapshot.docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().createdAt?.toMillis() || Date.now(),
      updated_at: doc.data().updatedAt?.toMillis() || Date.now()
    };
  });
  
  // Удаляем неиспользуемые поля Firebase
  documents.forEach(doc => {
    delete doc.createdAt;
    delete doc.updatedAt;
  });
  
  const { data, error } = await supabase.from(tableName).insert(documents);
  
  if (error) {
    console.error(`Ошибка при миграции ${collectionName}:`, error);
  } else {
    console.log(`Успешно перенесено ${documents.length} документов из ${collectionName} в ${tableName}`);
  }
}

// Запуск миграции
async function migrateData() {
  try {
    await migrateCollection('users', 'users');
    await migrateCollection('orders', 'orders');
    await migrateCollection('services', 'services');
    
    console.log('Миграция успешно завершена!');
  } catch (error) {
    console.error('Ошибка при миграции:', error);
  }
}

migrateData();
```

### 6. Обновление кода компонентов

Обновите импорты и вызовы функций во всех компонентах:

```typescript
// Было
import { getDocument } from '@/firebase/firebase';

// Стало
import { getRecord } from '@/supabase/supabase';
```

### 7. Отладка и тестирование

1. Проверьте все основные функции приложения
2. Убедитесь, что аутентификация работает корректно
3. Проверьте операции CRUD для всех типов данных
4. Протестируйте производительность

## Особенности и подводные камни

1. **Различия в структуре данных**: Supabase использует реляционную модель вместо иерархической в Firestore
2. **Row Level Security**: Установите правильные RLS политики для защиты данных
3. **Запросы к Supabase** обычно возвращают объект `{ data, error }`, а не Promise с результатом
4. **Транзакции** в Supabase работают иначе, чем в Firestore
5. **Realtime** функционал требует отдельной подписки на таблицы

## Долгосрочное обслуживание

1. **Регулярно обновляйте Supabase клиент** до последней версии
2. **Следите за изменениями в API** Supabase
3. **Используйте миграции** для управления схемой базы данных
4. **Создавайте бэкапы** данных регулярно 