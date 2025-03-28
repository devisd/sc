import { promises as fs } from 'fs';
import path from 'path';
import { Order } from './types';
import { supabase } from '@/supabase/supabase';

// Путь к JSON-файлу
const dbPath = path.join(process.cwd(), 'src/data/db.json');

// Интерфейс базы данных
interface Database {
    orders: Order[];
    orderCounter: number;
}

// Кэш для базы данных
let dbCache: Database | null = null;
let lastCacheUpdate = 0;

// Время жизни кэша (10 секунд)
const CACHE_TTL = 10 * 1000;

// Проверка и создание папки data, если она не существует
async function ensureDataDirectory(): Promise<void> {
    const dataDir = path.dirname(dbPath);
    try {
        await fs.access(dataDir);
    } catch (error) {
        // Папка не существует, создаем ее
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// Чтение базы данных с кэшированием
export async function readDatabase(): Promise<Database> {
    try {
        const now = Date.now();

        // Используем кэш, если он свежий
        if (dbCache && now - lastCacheUpdate < CACHE_TTL) {
            return dbCache;
        }

        // Проверяем наличие папки data
        await ensureDataDirectory();

        // Пробуем прочитать файл
        try {
            const data = await fs.readFile(dbPath, 'utf8');
            const parsedData: Database = JSON.parse(data);
            dbCache = parsedData;
            lastCacheUpdate = now;
            return parsedData;
        } catch (error) {
            // Проверяем, существует ли файл
            try {
                await fs.access(dbPath);
            } catch {
                // Файл не существует, создаем пустую БД
                const emptyDb: Database = { orders: [], orderCounter: 0 };
                await writeDatabase(emptyDb);
                dbCache = emptyDb;
                lastCacheUpdate = now;
                return emptyDb;
            }

            // Файл существует, но есть ошибка чтения или парсинга
            console.error('Ошибка при чтении базы данных:',
                error instanceof Error ? error.message : String(error));

            // Возвращаем пустую БД при ошибке
            const emptyDb: Database = { orders: [], orderCounter: 0 };
            dbCache = emptyDb;
            lastCacheUpdate = now;
            return emptyDb;
        }
    } catch (error) {
        console.error('Критическая ошибка при работе с базой данных:',
            error instanceof Error ? error.message : String(error));
        throw new Error('Не удалось получить доступ к базе данных');
    }
}

// Запись базы данных
export async function writeDatabase(db: Database): Promise<void> {
    try {
        // Проверяем наличие папки data
        await ensureDataDirectory();

        // Форматирование JSON для лучшей читаемости
        const jsonData = JSON.stringify(db, null, 2);

        // Запись в файл
        await fs.writeFile(dbPath, jsonData, 'utf8');

        // Обновляем кэш
        dbCache = db;
        lastCacheUpdate = Date.now();
    } catch (error) {
        console.error('Ошибка при записи в базу данных:',
            error instanceof Error ? error.message : String(error));
        throw new Error('Не удалось сохранить данные');
    }
}

// Получение всех заказов
export async function getOrders(): Promise<Order[]> {
    const db = await readDatabase();
    return db.orders;
}

// Получение заказа по ID
export async function getOrderById(id: string): Promise<Order | null> {
    const db = await readDatabase();
    const order = db.orders.find(order => order.id === id);
    return order || null;
}

// Добавление нового заказа
export async function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'> & { id?: string }): Promise<Order> {
    try {
        // Проверяем соединение с Supabase
        const { data: connectionTest, error: connectionError } = await supabase
            .from('orders')
            .select('id')
            .limit(1);

        if (connectionError) {
            console.error('Ошибка при проверке соединения с Supabase:', connectionError);
            throw new Error(`Ошибка соединения с базой данных: ${connectionError.message}`);
        }

        console.log('Соединение с Supabase установлено успешно');

        // Получаем максимальный номер заказа из существующих заказов
        const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('order_number')
            .order('order_number', { ascending: false })
            .limit(1);

        if (ordersError) {
            console.error('Ошибка при получении последнего номера заказа:', ordersError);
            throw new Error(`Ошибка при получении последнего номера заказа: ${ordersError.message}`);
        }

        // Определяем следующий номер заказа
        let nextOrderNumber = 1; // По умолчанию начинаем с 1
        if (ordersData && ordersData.length > 0 && ordersData[0].order_number) {
            nextOrderNumber = ordersData[0].order_number + 1;
        }

        const now = new Date();

        // Подготовка данных для Supabase в snake_case формате
        const orderData = {
            id: order.id || crypto.randomUUID(),
            order_number: nextOrderNumber, // Используем последовательный номер заказа вместо случайного
            client_name: order.clientName,
            client_phone: order.clientPhone,
            client_email: order.clientEmail || '',
            device_type: order.deviceType,
            device_model: order.deviceModel,
            serial_number: order.serialNumber || '',
            issue_description: order.issueDescription,
            prepayment: order.prepayment || 0,
            master_comment: order.masterComment || '',
            status: order.status,
            created_at: now.toISOString(),
            updated_at: now.toISOString()
        };

        console.log('Подготовленные данные для записи в Supabase:', orderData);

        // Сохраняем заказ в Supabase
        const { data, error } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single();

        if (error) {
            console.error('Ошибка при сохранении заказа в Supabase:', error);
            console.error('Детали ошибки:', error.message);
            console.error('Код ошибки:', error.code);
            throw new Error(`Ошибка при сохранении заказа: ${error.message} (код: ${error.code})`);
        }

        console.log('Заказ успешно сохранен в Supabase:', data);

        // Если есть услуги, добавляем их
        if (order.services && order.services.length > 0) {
            console.log('Добавление услуг к заказу:', order.services);
            const orderServices = order.services.map(service => ({
                id: service.id || crypto.randomUUID(),
                order_id: orderData.id,
                service_id: service.id, // Если есть соответствующий ID в таблице services
                name: service.name,
                price: service.price,
                quantity: service.quantity || 1,
                created_at: now.toISOString()
            }));

            const { error: servicesError } = await supabase
                .from('order_services')
                .insert(orderServices);

            if (servicesError) {
                console.error('Ошибка при сохранении услуг заказа:', servicesError);
                console.error('Детали ошибки:', servicesError.message);
                console.error('Код ошибки:', servicesError.code);
                // Не выбрасываем исключение, т.к. заказ уже создан
                console.warn('Продолжаем выполнение без услуг');
            } else {
                console.log('Услуги успешно добавлены к заказу');
            }
        }

        // Преобразуем данные из БД в формат Order
        const newOrder: Order = {
            id: data.id,
            orderNumber: data.order_number,
            clientName: data.client_name,
            clientPhone: data.client_phone,
            clientEmail: data.client_email,
            deviceType: data.device_type,
            deviceModel: data.device_model,
            serialNumber: data.serial_number,
            issueDescription: data.issue_description,
            prepayment: data.prepayment,
            masterComment: data.master_comment,
            status: data.status,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
            services: order.services || []
        };

        console.log('Заказ успешно создан и возвращен:', newOrder);
        return newOrder;
    } catch (error) {
        console.error('Ошибка при добавлении заказа:', error);
        if (error instanceof Error) {
            console.error('Детали ошибки:', error.message);
            console.error('Стек вызовов:', error.stack);
        }
        throw error;
    }
}

// Обновление существующего заказа
export async function updateOrder(id: string, updatedOrder: Partial<Order>): Promise<Order | null> {
    const db = await readDatabase();
    const orderIndex = db.orders.findIndex(order => order.id === id);

    if (orderIndex === -1) {
        return null;
    }

    // Объединяем существующий заказ с обновлениями
    db.orders[orderIndex] = {
        ...db.orders[orderIndex],
        ...updatedOrder,
        updatedAt: new Date()
    };

    await writeDatabase(db);
    return db.orders[orderIndex];
}

// Удаление заказа
export async function deleteOrder(id: string): Promise<boolean> {
    const db = await readDatabase();
    const initialLength = db.orders.length;

    db.orders = db.orders.filter(order => order.id !== id);

    if (db.orders.length === initialLength) {
        return false; // Заказ не был найден
    }

    await writeDatabase(db);
    return true; // Заказ успешно удален
} 