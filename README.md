# Сервисный центр CRM

Приложение для автоматизации процессов сервисного центра по ремонту компьютерной и мобильной техники.

## Функции

- Учет заказов и клиентов
- Управление услугами и запчастями
- Отслеживание статусов заказов
- Поиск и фильтрация
- Печать актов приема-передачи

## Технологии

- Next.js 14 (App Router)
- TypeScript
- Supabase (аутентификация и база данных)
- Tailwind CSS
- Zustand (управление состоянием)
- React Hook Form + Zod (валидация форм)

## Установка

1. Клонировать репозиторий
```bash
git clone https://github.com/yourusername/service-crm.git
cd service-crm
```

2. Установить зависимости
```bash
npm install
```

3. Создайте проект в [Supabase](https://supabase.com) и получите необходимые ключи.

4. Создайте файл `.env` в корне проекта и добавьте следующие переменные:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Настройте базу данных в Supabase согласно документации в `/docs/supabase-setup.md`

6. Запустить приложение в режиме разработки
```bash
npm run dev
```

7. Открыть [http://localhost:3000](http://localhost:3000) в браузере.

## Структура проекта

```
src/
├── app/              # Next.js страницы и компоненты
├── components/       # Переиспользуемые компоненты
│   ├── orders        # Компоненты для работы с заказами  
│   └── services      # Компоненты для работы с услугами
├── supabase/         # Конфигурация и утилиты Supabase
│   ├── supabase.ts   # Инициализация клиента
│   ├── auth.ts       # Функции аутентификации
│   └── types.ts      # TypeScript типы
├── lib/              # Вспомогательные функции
│   └── stores        # Zustand хранилища
└── types/            # Глобальные TypeScript типы
```

## Работа с данными

Для работы с базой данных используйте функции из `src/supabase/supabase.ts`:

```typescript
import { 
  addRecord, 
  getRecord, 
  getAllRecords, 
  updateRecord, 
  deleteRecord, 
  queryRecords 
} from '@/supabase/supabase';

// Примеры в документации: /docs/data-operations.md
```

## Документация

Дополнительная документация находится в директории `/docs`:

- [Настройка Supabase](/docs/supabase-setup.md)
- [Аутентификация](/docs/authentication.md)
- [Операции с данными](/docs/data-operations.md)
- [Миграция с Firebase](/docs/firebase-migration.md)

## Требования

- Node.js 18.0 или выше
- npm 9.0 или выше

## Лицензия

MIT
