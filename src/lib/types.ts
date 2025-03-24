export interface Order {
    id: string;
    orderNumber: number;
    deviceType: 'computer' | 'laptop' | 'smartphone' | 'tablet' | 'other';
    model: string;
    client: {
        fullName: string;
        phone: string;
    };
    problemDescription: string;
    prepayment: number;
    masterComment: string;
    status: OrderStatus;
    services: Service[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Service {
    id: string;
    type: 'part' | 'service';
    name: string;
    price: number;
    quantity?: number;
}

export type OrderStatus =
    | 'new'
    | 'in_progress'
    | 'waiting_parts'
    | 'ready'
    | 'completed'
    | 'canceled';

// Helper functions and constants
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    new: 'Новый',
    in_progress: 'В работе',
    waiting_parts: 'Ожидает запчасти',
    ready: 'Готов к выдаче',
    completed: 'Выполнен',
    canceled: 'Отменен'
};

export const DEVICE_TYPE_LABELS: Record<Order['deviceType'], string> = {
    computer: 'Компьютер',
    laptop: 'Ноутбук',
    smartphone: 'Смартфон',
    tablet: 'Планшет',
    other: 'Другое'
}; 