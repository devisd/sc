import { NextResponse } from 'next/server';
import { getOrderById, updateOrder, deleteOrder } from '@/lib/db';

interface Params {
    params: {
        id: string;
    };
}

// GET /api/orders/[id] - получить заказ по ID
export async function GET(request: Request, { params }: Params) {
    try {
        const order = await getOrderById(params.id);

        if (!order) {
            return new NextResponse('Заказ не найден', { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error(`Ошибка при получении заказа ${params.id}:`, error);
        return new NextResponse('Ошибка сервера', { status: 500 });
    }
}

// PATCH /api/orders/[id] - обновить заказ
export async function PATCH(request: Request, { params }: Params) {
    try {
        const updateData = await request.json();
        const updatedOrder = await updateOrder(params.id, updateData);

        if (!updatedOrder) {
            return new NextResponse('Заказ не найден', { status: 404 });
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error(`Ошибка при обновлении заказа ${params.id}:`, error);
        return new NextResponse('Ошибка сервера', { status: 500 });
    }
}

// DELETE /api/orders/[id] - удалить заказ
export async function DELETE(request: Request, { params }: Params) {
    try {
        const success = await deleteOrder(params.id);

        if (!success) {
            return new NextResponse('Заказ не найден', { status: 404 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error(`Ошибка при удалении заказа ${params.id}:`, error);
        return new NextResponse('Ошибка сервера', { status: 500 });
    }
} 