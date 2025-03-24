import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder, deleteOrder } from '@/lib/db';

// GET /api/orders/[id] - получить заказ по ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
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
            { error: 'Ошибка сервера' },
            { status: 500 }
        );
    }
}

// PATCH /api/orders/[id] - обновить заказ
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const updateData = await request.json();
        const updatedOrder = await updateOrder(params.id, updateData);

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
            { error: 'Ошибка сервера' },
            { status: 500 }
        );
    }
}

// DELETE /api/orders/[id] - удалить заказ
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
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
            { error: 'Ошибка сервера' },
            { status: 500 }
        );
    }
} 