import { OrderStatus } from './types';

// Константы для меток статусов заказов
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    new: 'Новый',
    in_progress: 'В работе',
    waiting_parts: 'Ожидание запчастей',
    ready: 'Готов к выдаче',
    completed: 'Выполнен',
    canceled: 'Отменен'
};

// Константы для цветов статусов заказов
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    new: '#3498db', // Синий
    in_progress: '#f39c12', // Оранжевый
    waiting_parts: '#9b59b6', // Фиолетовый
    ready: '#2ecc71', // Зеленый
    completed: '#27ae60', // Темно-зеленый
    canceled: '#e74c3c' // Красный
}; 