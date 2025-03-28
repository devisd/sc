import { NextResponse } from 'next/server';
import { getOrders, addOrder } from '@/lib/db';
import { z } from 'zod';
import { Order, OrderService, Service } from '@/lib/types';

// Схема валидации для нового заказа
const orderInputSchema = z.object({
    deviceType: z.enum(['computer', 'laptop', 'smartphone', 'tablet', 'other']),
    model: z.string().min(1, "Модель устройства обязательна"),
    client: z.object({
        fullName: z.string().min(2, "Имя клиента должно содержать минимум 2 символа"),
        phone: z.string().min(5, "Номер телефона обязателен")
    }),
    problemDescription: z.string(),
    prepayment: z.number().min(0, "Предоплата не может быть отрицательной"),
    masterComment: z.string().optional().default(""),
    status: z.enum(['new', 'in_progress', 'waiting_parts', 'ready', 'completed', 'canceled']).default('new'),
    services: z.array(
        z.object({
            type: z.enum(['part', 'service']),
            name: z.string().min(1, "Название услуги/запчасти обязательно"),
            price: z.number().min(0, "Цена не может быть отрицательной"),
            quantity: z.number().min(1).default(1)
        })
    ).default([])
});

// Тип входных данных заказа
type OrderInput = z.infer<typeof orderInputSchema>;

// Опции кэширования
export const dynamic = 'force-dynamic'; // Отключаем статическую генерацию для динамических данных

/**
 * GET /api/orders - получить все заказы
 * 
 * @returns {Promise<NextResponse>} JSON с массивом заказов
 */
export async function GET() {
    try {
        const orders = await getOrders();
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        return NextResponse.json(
            { error: 'Ошибка при получении заказов' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/orders - создать новый заказ
 * 
 * @param {Request} request - данные заказа
 * @returns {Promise<NextResponse>} JSON с созданным заказом
 */
export async function POST(request: Request) {
    try {
        // Получаем данные из запроса
        const orderData = await request.json();

        // Валидируем данные
        const validationResult = orderInputSchema.safeParse(orderData);

        // Если данные не прошли валидацию, возвращаем ошибку
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Ошибка валидации данных',
                    details: validationResult.error.issues
                },
                { status: 400 }
            );
        }

        // Преобразуем валидированные данные в формат для DB
        const validatedData = validationResult.data;

        // Преобразуем услуги к нужному формату
        const services: Omit<Service, 'id'>[] = validatedData.services.map(service => ({
            type: service.type,
            name: service.name,
            price: service.price,
            quantity: service.quantity
        }));

        // Создаем новый заказ
        const newOrder: Order = {
            id: crypto.randomUUID(),
            orderNumber: 0, // Номер заказа будет установлен в функции addOrder
            clientName: validatedData.client.fullName,
            clientPhone: validatedData.client.phone,
            clientEmail: '',
            deviceType: validatedData.deviceType,
            deviceModel: validatedData.model,
            serialNumber: '',
            issueDescription: validatedData.problemDescription,
            prepayment: validatedData.prepayment || 0,
            status: 'new',
            createdAt: new Date(),
            updatedAt: new Date(),
            masterComment: validatedData.masterComment || '',
            services: services.map(service => ({
                ...service,
                id: crypto.randomUUID(),
                quantity: service.quantity || 1
            })) as OrderService[],
        }

        // Сохраняем заказ в базе данных
        const savedOrder = await addOrder(newOrder);

        // Возвращаем созданный заказ
        return NextResponse.json(savedOrder, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        // Добавляем детальное логирование ошибки
        if (error instanceof Error) {
            console.error('Детали ошибки:', error.message);
            console.error('Стек вызовов:', error.stack);
        }

        return NextResponse.json(
            {
                error: 'Ошибка при создании заказа',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
} 