import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder, deleteOrder } from '@/lib/db';
import { z } from 'zod';

// Схема валидации для обновления заказа
const orderUpdateSchema = z.object({
    deviceType: z.enum(['computer', 'laptop', 'smartphone', 'tablet', 'other']).optional(),
    model: z.string().min(1, "Модель устройства обязательна").optional(),
    client: z.object({
        fullName: z.string().min(2, "Имя клиента должно содержать минимум 2 символа"),
        phone: z.string().min(5, "Номер телефона обязателен")
    }).optional(),
    problemDescription: z.string().optional(),
    prepayment: z.number().min(0, "Предоплата не может быть отрицательной").optional(),
    masterComment: z.string().optional(),
    status: z.enum(['new', 'in_progress', 'waiting_parts', 'ready', 'completed', 'canceled']).optional(),
    services: z.array(
        z.object({
            id: z.string(),
            type: z.enum(['part', 'service']),
            name: z.string().min(1, "Название услуги/запчасти обязательно"),
            price: z.number().min(0, "Цена не может быть отрицательной"),
            quantity: z.number().min(1).default(1)
        })
    ).optional()
});

// Опции кэширования
export const dynamic = 'force-dynamic'; // Отключаем статическую генерацию для динамических данных

// Тип для параметров маршрута
interface RouteParams {
    params: {
        id: string;
    };
}

/**
 * GET /api/orders/[id] - получить заказ по ID
 * 
 * @param {NextRequest} request - запрос
 * @param {RouteParams} params - параметры маршрута с ID заказа
 * @returns {Promise<NextResponse>} JSON с заказом или ошибкой
 */
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        // Проверяем валидность ID
        if (!params.id || typeof params.id !== 'string') {
            return NextResponse.json(
                { error: 'Невалидный ID заказа' },
                { status: 400 }
            );
        }

        const order = await getOrderById(params.id);

        if (!order) {
            return NextResponse.json(
                { error: 'Заказ не найден' },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error(`Ошибка при получении заказа ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Ошибка сервера при получении заказа' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/orders/[id] - обновить заказ
 * 
 * @param {NextRequest} request - запрос с данными для обновления
 * @param {RouteParams} params - параметры маршрута с ID заказа
 * @returns {Promise<NextResponse>} JSON с обновленным заказом или ошибкой
 */
export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        // Проверяем валидность ID
        if (!params.id || typeof params.id !== 'string') {
            return NextResponse.json(
                { error: 'Невалидный ID заказа' },
                { status: 400 }
            );
        }

        // Получаем и валидируем данные
        const updateData = await request.json();
        const validationResult = orderUpdateSchema.safeParse(updateData);

        // Если данные не прошли валидацию
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Ошибка валидации данных',
                    details: validationResult.error.issues
                },
                { status: 400 }
            );
        }

        // Обновляем заказ с валидированными данными
        const updatedOrder = await updateOrder(params.id, validationResult.data);

        if (!updatedOrder) {
            return NextResponse.json(
                { error: 'Заказ не найден' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error(`Ошибка при обновлении заказа ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Ошибка сервера при обновлении заказа' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/orders/[id] - удалить заказ
 * 
 * @param {NextRequest} request - запрос
 * @param {RouteParams} params - параметры маршрута с ID заказа
 * @returns {Promise<NextResponse>} Статус успеха или ошибка
 */
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        // Проверяем валидность ID
        if (!params.id || typeof params.id !== 'string') {
            return NextResponse.json(
                { error: 'Невалидный ID заказа' },
                { status: 400 }
            );
        }

        const success = await deleteOrder(params.id);

        if (!success) {
            return NextResponse.json(
                { error: 'Заказ не найден' },
                { status: 404 }
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error(`Ошибка при удалении заказа ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Ошибка сервера при удалении заказа' },
            { status: 500 }
        );
    }
} 