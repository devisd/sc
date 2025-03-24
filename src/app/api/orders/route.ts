import { NextResponse } from 'next/server';
import { getOrders, addOrder } from '@/lib/db';

// GET /api/orders - получить все заказы
export async function GET() {
    try {
        const orders = await getOrders();
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        return new NextResponse('Ошибка сервера', { status: 500 });
    }
}

// POST /api/orders - создать новый заказ
export async function POST(request: Request) {
    try {
        const orderData = await request.json();
        const newOrder = await addOrder(orderData);
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        return new NextResponse('Ошибка сервера', { status: 500 });
    }
} 