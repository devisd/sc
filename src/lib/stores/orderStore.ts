import { create } from 'zustand';
import { Order, OrderStatus, Service, OrderService } from '../types';
import { supabase } from '@/supabase/supabase';

/**
 * Тип заказа, полученного с API (с датами в виде строк)
 */
type ApiOrder = Omit<Order, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
};

/**
 * Преобразует услуги в заказе в корректный формат
 */
const processOrderServices = (services: any[]): OrderService[] => {
    return services.map(service => ({
        id: service.id,
        price: service.price,
        quantity: service.quantity || 1,
        service_id: service.service_id,
        name: service.name
    }));
};

/**
 * Преобразует данные с сервера в объект Order
 */
const mapApiDataToOrder = (data: any): Order => {
    return {
        id: data.id,
        orderNumber: data.order_number,
        deviceType: data.device_type,
        deviceModel: data.device_model,
        serialNumber: data.serial_number,
        clientName: data.client_name,
        clientPhone: data.client_phone,
        clientEmail: data.client_email,
        issueDescription: data.issue_description,
        prepayment: data.prepayment,
        masterComment: data.master_comment,
        status: data.status as OrderStatus,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        services: processOrderServices(data.services || [])
    };
};

/**
 * Обрабатывает и логирует ошибки API
 */
const handleApiError = (error: unknown, errorMessage: string): string => {
    console.error(errorMessage, error);
    return error instanceof Error ? error.message : 'Неизвестная ошибка';
};

/** Время кэширования данных в миллисекундах (5 минут) */
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Интерфейс хранилища заказов
 */
export interface OrderStore {
    /** Список всех заказов */
    orders: Order[];
    /** Детали конкретного заказа */
    orderDetails: Order | null;
    /** Флаг загрузки данных */
    isLoading: boolean;
    /** Сообщение об ошибке, если есть */
    error: string | null;
    /** Время последнего обновления для кэширования */
    lastFetched: number | null;
    /** Загружает список всех заказов */
    fetchOrders: () => Promise<void>;
    /** Добавляет новый заказ */
    addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>) => Promise<string>;
    /** Обновляет данные заказа */
    updateOrder: (id: string, orderData: Partial<Order>) => Promise<void>;
    /** Обновляет статус заказа */
    updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
    /** Получает заказ по ID */
    getOrderById: (id: string) => Order | undefined;
    /** Добавляет услугу или запчасть к заказу */
    addServiceToOrder: (id: string, service: Service, quantity: number) => Promise<void>;
    /** Удаляет услугу или запчасть из заказа */
    removeServiceFromOrder: (orderId: string, serviceId: string) => Promise<void>;
    /** Обновляет количество услуги или запчасти в заказе */
    updateServiceQuantity: (orderId: string, serviceId: string, quantity: number) => Promise<void>;
    /** Удаляет заказ */
    deleteOrder: (id: string) => Promise<void>;
    /** Получает детали конкретного заказа */
    fetchOrderDetails: (orderId: string) => Promise<void>;
    /** Обновляет комментарий к заказу */
    updateOrderComment: (orderId: string, comment: string) => Promise<void>;
    /** Добавляет услугу к заказу */
    addOrderService: (orderId: string, serviceId: string) => Promise<void>;
    /** Удаляет услугу из заказа */
    removeOrderService: (orderId: string, orderServiceId: string) => Promise<void>;
    /** Обновляет количество услуги в заказе */
    updateOrderServiceQuantity: (orderId: string, orderServiceId: string, quantity: number) => Promise<void>;
    /** Обновляет услуги в заказе */
    updateServices: (id: string, services: Service[]) => Promise<void>;
}

/**
 * Создает хранилище заказов с помощью zustand
 */
const createStore = () => {
    return create<OrderStore>((set, get) => ({
        orders: [],
        orderDetails: null,
        isLoading: false,
        error: null,
        lastFetched: null,

        /**
         * Получение списка заказов с кэшированием
         * Если данные были загружены недавно, повторный запрос не выполняется
         */
        fetchOrders: async () => {
            try {
                // Проверяем кэш - если данные свежие, не запрашиваем заново
                const now = Date.now();
                const lastFetched = get().lastFetched;

                if (lastFetched && now - lastFetched < CACHE_DURATION && get().orders.length > 0) {
                    return; // Используем закэшированные данные
                }

                set({ isLoading: true, error: null });
                const { data, error } = await supabase
                    .from('orders')
                    .select('*, order_services(*)')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Преобразуем данные в формат Order
                const orders = (data || []).map(order => {
                    // Преобразуем услуги
                    const services = (order.order_services || []).map((service: any) => ({
                        id: service.id,
                        name: service.name,
                        price: service.price,
                        quantity: service.quantity || 1,
                        type: 'service' // По умолчанию все услуги, если нет явного указания
                    }));

                    // Преобразуем заказ
                    return {
                        id: order.id,
                        orderNumber: order.order_number,
                        clientName: order.client_name,
                        clientPhone: order.client_phone,
                        clientEmail: order.client_email || '',
                        deviceType: order.device_type,
                        deviceModel: order.device_model,
                        serialNumber: order.serial_number || '',
                        issueDescription: order.issue_description,
                        prepayment: order.prepayment || 0,
                        masterComment: order.master_comment || '',
                        status: order.status,
                        createdAt: new Date(order.created_at),
                        updatedAt: new Date(order.updated_at),
                        services: services
                    } as Order;
                });

                set({
                    orders,
                    isLoading: false,
                    lastFetched: now
                });
            } catch (error) {
                set({
                    error: handleApiError(error, 'Ошибка при загрузке заказов:'),
                    isLoading: false
                });
            }
        },

        /**
         * Добавление нового заказа
         */
        addOrder: async (orderData) => {
            try {
                set({ isLoading: true, error: null });

                // Преобразуем данные в формат, ожидаемый API
                const apiOrderData = {
                    deviceType: orderData.deviceType,
                    model: orderData.deviceModel,
                    client: {
                        fullName: orderData.clientName,
                        phone: orderData.clientPhone
                    },
                    problemDescription: orderData.issueDescription,
                    prepayment: orderData.prepayment,
                    masterComment: orderData.masterComment,
                    status: orderData.status,
                    services: orderData.services
                };

                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(apiOrderData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Ошибка добавления заказа: ${response.status}, ${JSON.stringify(errorData)}`);
                }

                const newOrder = await response.json();
                const parsedOrder = mapApiDataToOrder(newOrder);

                set((state) => ({
                    orders: [...state.orders, parsedOrder],
                    isLoading: false
                }));

                return parsedOrder.id;
            } catch (error) {
                set({
                    error: handleApiError(error, 'Ошибка при добавлении заказа:'),
                    isLoading: false
                });
                throw error;
            }
        },

        /**
         * Обновление данных заказа
         */
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
                const parsedOrder = mapApiDataToOrder(updatedOrder);

                set((state) => ({
                    orders: state.orders.map((order) =>
                        order.id === id ? parsedOrder : order
                    ),
                    isLoading: false
                }));
            } catch (error) {
                set({
                    error: handleApiError(error, 'Ошибка при обновлении заказа:'),
                    isLoading: false
                });
                throw error;
            }
        },

        /**
         * Обновление статуса заказа
         */
        updateOrderStatus: async (id, status) => {
            try {
                set({ isLoading: true, error: null });
                const { error } = await supabase
                    .from('orders')
                    .update({ status, updated_at: new Date() })
                    .eq('id', id);

                if (error) throw error;

                // Обновляем локальный state
                const { orderDetails } = get();
                if (orderDetails && orderDetails.id === id) {
                    set({
                        orderDetails: {
                            ...orderDetails,
                            status,
                            updatedAt: new Date()
                        }
                    });
                }
            } catch (error) {
                handleApiError(error, 'Ошибка при обновлении статуса заказа:');
                throw error;
            } finally {
                set({ isLoading: false });
            }
        },

        /**
         * Получение заказа по ID
         */
        getOrderById: (id) => {
            return get().orders.find((order) => order.id === id);
        },

        /**
         * Добавление услуги или запчасти к заказу
         */
        addServiceToOrder: async (id, service, quantity) => {
            if (!service) return;

            set((state) => {
                const orderIndex = state.orders.findIndex((order) => order.id === id);
                if (orderIndex === -1) return state;

                const orders = [...state.orders];
                const order = orders[orderIndex];

                // Проверяем, есть ли уже эта услуга в заказе
                const existingServiceIndex = order.services.findIndex(
                    (s) => s.id === service.id
                );

                if (existingServiceIndex !== -1) {
                    // Если услуга уже есть, обновляем количество
                    order.services[existingServiceIndex].quantity += quantity;
                } else {
                    // Если услуги еще нет, добавляем ее с указанным количеством
                    order.services.push({
                        ...service,
                        quantity: quantity
                    });
                }

                return { orders };
            });
        },

        /**
         * Удаление услуги или запчасти из заказа
         */
        removeServiceFromOrder: async (orderId, serviceId) => {
            try {
                const order = get().getOrderById(orderId);
                if (!order) {
                    throw new Error('Заказ не найден');
                }

                const updatedServices = order.services.filter((s) => s.id !== serviceId);
                await get().updateOrder(orderId, { services: updatedServices });
            } catch (error) {
                handleApiError(error, 'Ошибка при удалении услуги из заказа:');
                throw error;
            }
        },

        /**
         * Обновление количества услуги или запчасти в заказе
         */
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
                handleApiError(error, 'Ошибка при обновлении количества услуги:');
                throw error;
            }
        },

        /**
         * Удаление заказа
         */
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
                set({
                    error: handleApiError(error, 'Ошибка при удалении заказа:'),
                    isLoading: false
                });
                throw error;
            }
        },

        /**
         * Получение деталей конкретного заказа
         */
        fetchOrderDetails: async (orderId) => {
            try {
                set({ isLoading: true, error: null });
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        services:order_services(*)
                    `)
                    .eq('id', orderId)
                    .single();

                if (error) throw error;

                // Преобразуем данные в формат Order
                const orderData = mapApiDataToOrder(data);
                set({ orderDetails: orderData });
            } catch (error) {
                set({ error: handleApiError(error, 'Ошибка при получении деталей заказа:') });
            } finally {
                set({ isLoading: false });
            }
        },

        /**
         * Обновление комментария к заказу
         */
        updateOrderComment: async (orderId, comment) => {
            try {
                set({ isLoading: true, error: null });
                const { error } = await supabase
                    .from('orders')
                    .update({ master_comment: comment, updated_at: new Date() })
                    .eq('id', orderId);

                if (error) throw error;

                // Обновляем локальный state
                const { orderDetails } = get();
                if (orderDetails && orderDetails.id === orderId) {
                    set({
                        orderDetails: {
                            ...orderDetails,
                            masterComment: comment,
                            updatedAt: new Date()
                        }
                    });
                }
            } catch (error) {
                set({ error: handleApiError(error, 'Ошибка при обновлении комментария к заказу:') });
            } finally {
                set({ isLoading: false });
            }
        },

        /**
         * Добавление услуги к заказу
         */
        addOrderService: async (orderId, serviceId) => {
            try {
                set({ isLoading: true, error: null });
                // Получаем информацию об услуге
                const { data: serviceData, error: serviceError } = await supabase
                    .from('services')
                    .select('*')
                    .eq('id', serviceId)
                    .single();

                if (serviceError) throw serviceError;

                // Добавляем услугу в заказ
                const { error } = await supabase
                    .from('order_services')
                    .insert({
                        order_id: orderId,
                        service_id: serviceId,
                        quantity: 1,
                        price: serviceData.price
                    });

                if (error) throw error;

                // Обновляем данные заказа
                await get().fetchOrderDetails(orderId);
            } catch (error) {
                set({ error: handleApiError(error, 'Ошибка при добавлении услуги к заказу:') });
            } finally {
                set({ isLoading: false });
            }
        },

        /**
         * Удаление услуги из заказа
         */
        removeOrderService: async (orderId, orderServiceId) => {
            try {
                set({ isLoading: true, error: null });
                const { error } = await supabase
                    .from('order_services')
                    .delete()
                    .eq('id', orderServiceId);

                if (error) throw error;

                // Обновляем данные заказа
                await get().fetchOrderDetails(orderId);
            } catch (error) {
                set({ error: handleApiError(error, 'Ошибка при удалении услуги из заказа:') });
            } finally {
                set({ isLoading: false });
            }
        },

        /**
         * Обновление количества услуги в заказе
         */
        updateOrderServiceQuantity: async (orderId, orderServiceId, quantity) => {
            try {
                set({ isLoading: true, error: null });
                const { error } = await supabase
                    .from('order_services')
                    .update({ quantity })
                    .eq('id', orderServiceId);

                if (error) throw error;

                // Обновляем данные заказа
                await get().fetchOrderDetails(orderId);
            } catch (error) {
                set({ error: handleApiError(error, 'Ошибка при обновлении количества услуги:') });
            } finally {
                set({ isLoading: false });
            }
        },

        /**
         * Обновляет услуги в заказе
         */
        updateServices: async (id, services) => {
            set((state) => {
                const orderIndex = state.orders.findIndex((order) => order.id === id);
                if (orderIndex === -1) return state;

                const orders = [...state.orders];
                // Преобразуем услуги в формат OrderService
                orders[orderIndex].services = services.map(service => ({
                    ...service,
                    quantity: service.quantity || 1
                }));

                return { orders };
            });
        }
    }));
};

/**
 * Синглтон хранилища для использования на стороне клиента
 */
let orderStore: ReturnType<typeof createStore> | undefined;

/**
 * Хук для доступа к хранилищу заказов в компонентах
 */
export const useOrderStore = typeof window !== "undefined"
    ? () => {
        if (!orderStore) {
            orderStore = createStore();
        }
        return orderStore();
    }
    : () => {
        throw new Error(
            "Хранилище заказов нельзя использовать на стороне сервера"
        );
    }; 