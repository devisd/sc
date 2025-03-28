/**
 * Интерфейс заказа в сервисном центре
 */
export interface Order {
    /** Уникальный идентификатор заказа */
    id: string;
    /** Номер заказа */
    orderNumber: number;
    /** Тип устройства */
    deviceType: 'computer' | 'laptop' | 'smartphone' | 'tablet' | 'other';
    /** Модель устройства */
    deviceModel: string;
    /** Серийный номер устройства */
    serialNumber?: string;
    /** ФИО клиента */
    clientName: string;
    /** Телефон клиента */
    clientPhone: string;
    /** Email клиента */
    clientEmail?: string;
    /** Описание проблемы */
    issueDescription: string;
    /** Сумма предоплаты */
    prepayment: number;
    /** Комментарий мастера */
    masterComment: string;
    /** Статус заказа */
    status: OrderStatus;
    /** Список услуг и запчастей в заказе */
    services: OrderService[];
    /** Дата создания заказа */
    createdAt: Date;
    /** Дата последнего обновления заказа */
    updatedAt: Date;
}

/**
 * Интерфейс услуги или запчасти
 */
export interface Service {
    /** Уникальный идентификатор */
    id: string;
    /** Тип: услуга или запчасть */
    type: 'part' | 'service';
    /** Наименование */
    name: string;
    /** Цена в рублях */
    price: number;
    /** Количество (для запчастей) */
    quantity?: number;
}

/**
 * Интерфейс услуги в заказе
 */
export interface OrderService {
    /** Уникальный идентификатор */
    id: string;
    /** Цена в рублях */
    price: number;
    /** Количество */
    quantity: number;
    /** Идентификатор услуги */
    service_id?: string;
    /** Наименование услуги */
    name?: string;
}

/**
 * Возможные статусы заказа
 */
export type OrderStatus =
    | 'new'           // Новый
    | 'in_progress'   // В работе
    | 'waiting_parts' // Ожидает запчасти
    | 'ready'         // Готов к выдаче
    | 'completed'     // Выполнен
    | 'canceled';     // Отменен

/**
 * Словарь человекочитаемых названий статусов заказа
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    new: 'Новый',
    in_progress: 'В работе',
    waiting_parts: 'Ожидает запчасти',
    ready: 'Готов к выдаче',
    completed: 'Выполнен',
    canceled: 'Отменен'
};

/**
 * Словарь человекочитаемых названий типов устройств
 */
export const DEVICE_TYPE_LABELS: Record<Order['deviceType'], string> = {
    computer: 'Компьютер',
    laptop: 'Ноутбук',
    smartphone: 'Смартфон',
    tablet: 'Планшет',
    other: 'Другое'
}; 