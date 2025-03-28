import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Service } from '../types';

// Интерфейс хранилища услуг
interface ServiceStore {
    services: Service[];
    isLoading: boolean;
    error: string | null;
    fetchServices: () => Promise<void>;
    addService: (service: Omit<Service, 'id'>) => string;
    updateService: (id: string, data: Partial<Omit<Service, 'id'>>) => void;
    deleteService: (id: string) => void;
    getServiceById: (id: string) => Service | undefined;
}

// Вспомогательная функция для обработки ошибок
const handleApiError = (error: unknown, errorMessage: string): string => {
    console.error(errorMessage, error);
    return error instanceof Error ? error.message : 'Неизвестная ошибка';
};

// Генерация тестовых услуг для разработки
const generateMockServices = (): Service[] => {
    return [
        {
            id: '1',
            type: 'service',
            name: 'Диагностика устройства',
            price: 500,
        },
        {
            id: '2',
            type: 'service',
            name: 'Замена экрана смартфона',
            price: 3000,
        },
        {
            id: '3',
            type: 'service',
            name: 'Чистка ноутбука от пыли',
            price: 2000,
        },
        {
            id: '4',
            type: 'part',
            name: 'Дисплейный модуль iPhone 13',
            price: 15000,
        },
        {
            id: '5',
            type: 'part',
            name: 'Аккумулятор для MacBook Pro 2019',
            price: 8000,
        },
    ];
};

// Создание хранилища с персистентностью данных
const createStore = () => {
    return create<ServiceStore>()(
        persist(
            (set, get) => ({
                services: [],
                isLoading: false,
                error: null,

                // Загрузка списка услуг
                fetchServices: async () => {
                    try {
                        set({ isLoading: true, error: null });

                        // В будущем тут будет API запрос
                        // Имитация задержки загрузки для демонстрации
                        await new Promise(resolve => setTimeout(resolve, 300));

                        // Если услуги уже загружены, не перезагружаем
                        if (get().services.length === 0) {
                            set({ services: generateMockServices(), isLoading: false });
                        } else {
                            set({ isLoading: false });
                        }
                    } catch (error) {
                        set({
                            error: handleApiError(error, 'Ошибка при загрузке услуг:'),
                            isLoading: false
                        });
                    }
                },

                // Добавление новой услуги
                addService: (serviceData) => {
                    const id = crypto.randomUUID();
                    const newService: Service = {
                        ...serviceData,
                        id,
                    };

                    set((state) => ({
                        services: [...state.services, newService],
                    }));

                    return id;
                },

                // Обновление существующей услуги
                updateService: (id, data) => {
                    set((state) => ({
                        services: state.services.map((service) =>
                            service.id === id ? { ...service, ...data } : service
                        ),
                    }));
                },

                // Удаление услуги
                deleteService: (id) => {
                    set((state) => ({
                        services: state.services.filter((service) => service.id !== id),
                    }));
                },

                // Получение услуги по ID
                getServiceById: (id) => {
                    return get().services.find((service) => service.id === id);
                },
            }),
            {
                name: 'service-store', // Уникальное имя для localStorage
                partialize: (state) => ({ services: state.services }), // Сохраняем только services
            }
        )
    );
};

// Синглтон для хранилища
let serviceStore: ReturnType<typeof createStore> | undefined;

// Экспорт хука для использования хранилища с проверкой среды
export const useServiceStore = typeof window !== "undefined"
    ? (() => {
        if (!serviceStore) {
            serviceStore = createStore();
        }
        return serviceStore;
    })()
    : createStore(); 