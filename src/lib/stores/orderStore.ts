import { create } from 'zustand';
import { Order, OrderStatus, Service } from '../types';

interface OrderStore {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>) => Promise<string>;
    updateOrder: (id: string, orderData: Partial<Order>) => Promise<void>;
    updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
    getOrderById: (id: string) => Order | undefined;
    addServiceToOrder: (orderId: string, service: Omit<Service, 'id'>) => Promise<void>;
    removeServiceFromOrder: (orderId: string, serviceId: string) => Promise<void>;
    updateServiceQuantity: (orderId: string, serviceId: string, quantity: number) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
}

// Fix for Next.js hydration issue - creating store with initial state on client side
const createStore = () => {
    return create<OrderStore>((set, get) => ({
        orders: [],
        isLoading: false,
        error: null,

        // Получить все заказы
        fetchOrders: async () => {
            try {
                set({ isLoading: true, error: null });
                const response = await fetch('/api/orders');

                if (!response.ok) {
                    throw new Error(`Ошибка получения заказов: ${response.status}`);
                }

                const orders = await response.json();

                // Преобразуем строковые даты в объекты Date
                const parsedOrders = orders.map((order: Omit<Order, 'createdAt' | 'updatedAt'> & {
                    createdAt: string;
                    updatedAt: string;
                }) => ({
                    ...order,
                    createdAt: new Date(order.createdAt),
                    updatedAt: new Date(order.updatedAt)
                }));

                set({ orders: parsedOrders, isLoading: false });
            } catch (error) {
                console.error('Ошибка при загрузке заказов:', error);
                set({ error: error instanceof Error ? error.message : 'Неизвестная ошибка', isLoading: false });
            }
        },

        // Добавить новый заказ
        addOrder: async (orderData) => {
            try {
                set({ isLoading: true, error: null });
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    throw new Error(`Ошибка добавления заказа: ${response.status}`);
                }

                const newOrder = await response.json();

                // Преобразуем строковые даты в объекты Date
                const parsedOrder = {
                    ...newOrder,
                    createdAt: new Date(newOrder.createdAt),
                    updatedAt: new Date(newOrder.updatedAt)
                };

                set((state) => ({
                    orders: [...state.orders, parsedOrder],
                    isLoading: false
                }));

                return parsedOrder.id;
            } catch (error) {
                console.error('Ошибка при добавлении заказа:', error);
                set({ error: error instanceof Error ? error.message : 'Неизвестная ошибка', isLoading: false });
                throw error;
            }
        },

        // Обновить заказ
        updateOrder: async (id, orderData) => {
            try {
                set({ isLoading: true, error: null });
                const response = await fetch(`/api/orders/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    throw new Error(`Ошибка обновления заказа: ${response.status}`);
                }

                const updatedOrder = await response.json();

                // Преобразуем строковые даты в объекты Date
                const parsedOrder = {
                    ...updatedOrder,
                    createdAt: new Date(updatedOrder.createdAt),
                    updatedAt: new Date(updatedOrder.updatedAt)
                };

                set((state) => ({
                    orders: state.orders.map((order) =>
                        order.id === id ? parsedOrder : order
                    ),
                    isLoading: false
                }));
            } catch (error) {
                console.error('Ошибка при обновлении заказа:', error);
                set({ error: error instanceof Error ? error.message : 'Неизвестная ошибка', isLoading: false });
                throw error;
            }
        },

        // Обновить статус заказа
        updateOrderStatus: async (id, status) => {
            try {
                await get().updateOrder(id, { status });
            } catch (error) {
                console.error('Ошибка при обновлении статуса заказа:', error);
                throw error;
            }
        },

        // Получить заказ по ID
        getOrderById: (id) => {
            return get().orders.find((order) => order.id === id);
        },

        // Добавить услугу к заказу
        addServiceToOrder: async (orderId, service) => {
            try {
                const order = get().getOrderById(orderId);
                if (!order) {
                    throw new Error('Заказ не найден');
                }

                const updatedServices = [...order.services, { ...service, id: crypto.randomUUID() }];
                await get().updateOrder(orderId, { services: updatedServices });
            } catch (error) {
                console.error('Ошибка при добавлении услуги к заказу:', error);
                throw error;
            }
        },

        // Удалить услугу из заказа
        removeServiceFromOrder: async (orderId, serviceId) => {
            try {
                const order = get().getOrderById(orderId);
                if (!order) {
                    throw new Error('Заказ не найден');
                }

                const updatedServices = order.services.filter((s) => s.id !== serviceId);
                await get().updateOrder(orderId, { services: updatedServices });
            } catch (error) {
                console.error('Ошибка при удалении услуги из заказа:', error);
                throw error;
            }
        },

        // Обновить количество услуги
        updateServiceQuantity: async (orderId, serviceId, quantity) => {
            try {
                const order = get().getOrderById(orderId);
                if (!order) {
                    throw new Error('Заказ не найден');
                }

                const updatedServices = order.services.map((s) =>
                    s.id === serviceId ? { ...s, quantity } : s
                );

                await get().updateOrder(orderId, { services: updatedServices });
            } catch (error) {
                console.error('Ошибка при обновлении количества услуги:', error);
                throw error;
            }
        },

        // Удалить заказ
        deleteOrder: async (id) => {
            try {
                set({ isLoading: true, error: null });
                const response = await fetch(`/api/orders/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`Ошибка удаления заказа: ${response.status}`);
                }

                set((state) => ({
                    orders: state.orders.filter((order) => order.id !== id),
                    isLoading: false
                }));
            } catch (error) {
                console.error('Ошибка при удалении заказа:', error);
                set({ error: error instanceof Error ? error.message : 'Неизвестная ошибка', isLoading: false });
                throw error;
            }
        },
    }));
};

// Ensure we only create one store instance in the client
let orderStore: ReturnType<typeof createStore> | undefined;

export const useOrderStore = typeof window !== "undefined"
    ? (() => {
        if (!orderStore) {
            orderStore = createStore();
        }
        return orderStore;
    })()
    : createStore(); 