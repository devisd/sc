# Операции с данными

В этом документе описаны основные операции с данными в приложении с использованием Supabase.

## Базовые функции

Все функции для работы с данными находятся в файле `src/supabase/supabase.ts`.

## CRUD операции

### Добавление записи

```typescript
import { addRecord } from '@/supabase/supabase';

const createOrder = async () => {
  try {
    const newOrder = await addRecord('orders', {
      user_id: 'user-uuid',
      customer_name: 'Иван Петров',
      customer_phone: '+7 (999) 123-45-67',
      device_type: 'Смартфон',
      device_model: 'iPhone 13',
      serial_number: 'ABCD1234EFGH',
      problem_description: 'Не включается экран',
      created_at: Date.now(),
      updated_at: Date.now()
    });
    
    console.log('Создан новый заказ:', newOrder);
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
  }
};
```

### Получение записи по ID

```typescript
import { getRecord } from '@/supabase/supabase';

const fetchOrder = async (orderId: string) => {
  try {
    const order = await getRecord('orders', orderId);
    console.log('Получен заказ:', order);
  } catch (error) {
    console.error('Ошибка при получении заказа:', error);
  }
};
```

### Получение всех записей

```typescript
import { getAllRecords } from '@/supabase/supabase';

const fetchAllOrders = async () => {
  try {
    const orders = await getAllRecords('orders');
    console.log('Все заказы:', orders);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
  }
};
```

### Обновление записи

```typescript
import { updateRecord } from '@/supabase/supabase';

const updateOrderStatus = async (orderId: string) => {
  try {
    const updatedOrder = await updateRecord('orders', orderId, {
      status: 'in_progress',
      technician_notes: 'Требуется замена дисплея',
      updated_at: Date.now()
    });
    
    console.log('Заказ обновлен:', updatedOrder);
  } catch (error) {
    console.error('Ошибка при обновлении заказа:', error);
  }
};
```

### Удаление записи

```typescript
import { deleteRecord } from '@/supabase/supabase';

const removeOrder = async (orderId: string) => {
  try {
    await deleteRecord('orders', orderId);
    console.log('Заказ удален');
  } catch (error) {
    console.error('Ошибка при удалении заказа:', error);
  }
};
```

### Поиск записей

```typescript
import { queryRecords } from '@/supabase/supabase';

const searchOrders = async () => {
  try {
    // Поиск заказов со статусом "new"
    const newOrders = await queryRecords('orders', 'status', 'eq', 'new');
    console.log('Новые заказы:', newOrders);
    
    // Поиск заказов определенного типа устройства
    const smartphoneOrders = await queryRecords('orders', 'device_type', 'eq', 'Смартфон');
    console.log('Заказы на смартфоны:', smartphoneOrders);
  } catch (error) {
    console.error('Ошибка при поиске заказов:', error);
  }
};
```

## Типизация данных

Для обеспечения типовой безопасности, рекомендуется создавать интерфейсы для ваших данных:

```typescript
interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  device_type: string;
  device_model?: string;
  serial_number?: string;
  problem_description: string;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  technician_notes?: string;
  created_at: number;
  updated_at: number;
}

// Использование с типами
const fetchOrder = async (orderId: string) => {
  try {
    const order = await getRecord<Order>('orders', orderId);
    console.log('Тип устройства:', order.device_type);
  } catch (error) {
    console.error('Ошибка при получении заказа:', error);
  }
};
```

## Расширенные запросы

Если встроенных функций недостаточно, вы можете использовать Supabase клиент напрямую:

```typescript
import { supabase } from '@/supabase/supabase';

const fetchOrdersWithFilters = async () => {
  try {
    // Сложный запрос с несколькими условиями
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', 'user-uuid')
      .in('status', ['new', 'in_progress'])
      .gte('created_at', Date.now() - 86400000) // Заказы за последние 24 часа
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    console.log('Отфильтрованные заказы:', data);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
  }
};
```

## Реляционные запросы

Supabase поддерживает соединение таблиц:

```typescript
import { supabase } from '@/supabase/supabase';

const fetchOrdersWithServices = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        services:order_services(
          id,
          service_id,
          services:service_id(name, price)
        )
      `)
      .eq('id', 'order-id');
      
    if (error) throw error;
    console.log('Заказ с услугами:', data);
  } catch (error) {
    console.error('Ошибка при получении заказа с услугами:', error);
  }
};
```

## Обработка ошибок

Рекомендуется всегда использовать try/catch блоки при работе с базой данных:

```typescript
try {
  // Операции с базой данных
} catch (error) {
  if (error instanceof Error) {
    // Обработка ошибки
    console.error('Сообщение об ошибке:', error.message);
  }
  
  // Отображение ошибки пользователю
  showErrorToUser('Произошла ошибка при работе с данными. Пожалуйста, попробуйте еще раз.');
}
```

## Советы по оптимизации

1. **Используйте индексы**: Создавайте индексы для полей, по которым часто производится поиск и фильтрация.
2. **Ограничивайте выборку**: Используйте `.limit()` для ограничения количества результатов.
3. **Выбирайте только нужные поля**: Используйте `.select('field1, field2')` вместо `.select('*')`.
4. **Кэшируйте данные**, которые редко меняются.
5. **Используйте пагинацию** для больших наборов данных. 