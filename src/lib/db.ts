import { promises as fs } from 'fs';
import path from 'path';
import { Order } from './types';

// Путь к JSON-файлу
const dbPath = path.join(process.cwd(), 'src/data/db.json');

// Интерфейс базы данных
interface Database {
    orders: Order[];
    orderCounter: number;
}

// Чтение базы данных
export async function readDatabase(): Promise<Database> {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка при чтении базы данных:', error instanceof Error ? error.message : String(error));
        // Если файл не существует или поврежден, возвращаем пустую базу данных
        return { orders: [], orderCounter: 0 };
    }
}

// Запись базы данных
export async function writeDatabase(db: Database): Promise<void> {
    try {
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
    } catch (error) {
        console.error('Ошибка при записи в базу данных:', error);
        throw new Error('Не удалось сохранить данные');
    }
}

// Функции для работы с заказами
export async function getOrders(): Promise<Order[]> {
    const db = await readDatabase();
    return db.orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
    const db = await readDatabase();
    const order = db.orders.find(order => order.id === id);
    return order || null;
}

export async function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'> & { id?: string }): Promise<Order> {
    const db = await readDatabase();

    // Увеличиваем счетчик заказов
    db.orderCounter = (db.orderCounter || 0) + 1;

    const newOrder: Order = {
        ...order,
        id: order.id || crypto.randomUUID(),
        orderNumber: db.orderCounter,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    db.orders.push(newOrder);
    await writeDatabase(db);

    return newOrder;
}

export async function updateOrder(id: string, updatedOrder: Partial<Order>): Promise<Order | null> {
    const db = await readDatabase();
    const orderIndex = db.orders.findIndex(order => order.id === id);

    if (orderIndex === -1) {
        return null;
    }

    db.orders[orderIndex] = {
        ...db.orders[orderIndex],
        ...updatedOrder,
        updatedAt: new Date()
    };

    await writeDatabase(db);
    return db.orders[orderIndex];
}

export async function deleteOrder(id: string): Promise<boolean> {
    const db = await readDatabase();
    const initialLength = db.orders.length;

    db.orders = db.orders.filter(order => order.id !== id);

    if (db.orders.length === initialLength) {
        return false;
    }

    await writeDatabase(db);
    return true;
} 