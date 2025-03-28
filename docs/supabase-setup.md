# Настройка Supabase

В этом документе описаны шаги по настройке Supabase для работы с приложением.

## Создание проекта

1. Зарегистрируйтесь на [Supabase](https://supabase.com)
2. Создайте новый проект
3. Выберите регион, ближайший к вашим пользователям
4. Дождитесь создания проекта

## Настройка базы данных

### Таблица пользователей

Создайте таблицу `users` с помощью SQL-запроса в редакторе Supabase:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  display_name TEXT,
  first_name TEXT,
  last_name TEXT,
  position TEXT,
  organization TEXT,
  address TEXT,
  photo_url TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- Установка RLS политик
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Пользователи могут читать свои данные
CREATE POLICY "Users can read their own data" 
  ON users 
  FOR SELECT 
  USING (auth.uid() = id);

-- Пользователи могут обновлять свои данные
CREATE POLICY "Users can update their own data" 
  ON users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Пользователи могут создавать свои данные
CREATE POLICY "Users can insert their own data" 
  ON users 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

### Таблица заказов

Создайте таблицу `orders` для хранения заказов:

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  device_type TEXT NOT NULL,
  device_model TEXT,
  serial_number TEXT,
  problem_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  technician_notes TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- Установка RLS политик
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Пользователи могут читать свои заказы
CREATE POLICY "Users can read their own orders" 
  ON orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Пользователи могут создавать свои заказы
CREATE POLICY "Users can insert their own orders" 
  ON orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Пользователи могут обновлять свои заказы
CREATE POLICY "Users can update their own orders" 
  ON orders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Пользователи могут удалять свои заказы
CREATE POLICY "Users can delete their own orders" 
  ON orders 
  FOR DELETE 
  USING (auth.uid() = user_id);
```

### Таблица услуг

Создайте таблицу `services` для хранения услуг:

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- Установка RLS политик
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Пользователи могут читать свои услуги
CREATE POLICY "Users can read their own services" 
  ON services 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Пользователи могут создавать свои услуги
CREATE POLICY "Users can insert their own services" 
  ON services 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Пользователи могут обновлять свои услуги
CREATE POLICY "Users can update their own services" 
  ON services 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Пользователи могут удалять свои услуги
CREATE POLICY "Users can delete their own services" 
  ON services 
  FOR DELETE 
  USING (auth.uid() = user_id);
```

## Настройка аутентификации

1. В панели управления Supabase перейдите в раздел **Authentication**
2. Включите провайдеры аутентификации, которые вам нужны:
   - Email/Password
   - Google
   - Yandex (если доступно)

### Настройка OAuth провайдеров

#### Google OAuth

1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com/)
2. Включите Google OAuth API
3. Настройте экран разрешений OAuth
4. Создайте учетные данные OAuth
5. Добавьте URL-адрес перенаправления из настроек Supabase
6. Скопируйте Client ID и Client Secret в настройки Supabase

#### Другие провайдеры

Настройте другие провайдеры OAuth по аналогии с Google, используя документацию соответствующих сервисов.

## Настройка переменных окружения

Добавьте следующие переменные в файл `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Вы можете найти эти значения в разделе **Settings > API** в панели управления Supabase. 