import { create } from 'zustand';
import { Service } from '../types';
import { v4 as uuidv4 } from 'uuid';

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

// Mock data for development
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

// Fix for Next.js hydration issue - creating store with initial state on client side
const createStore = () => {
    return create<ServiceStore>((set, get) => ({
        services: [],
        isLoading: false,
        error: null,

        fetchServices: async () => {
            try {
                set({ isLoading: true, error: null });
                // Имитация задержки загрузки для демонстрации
                await new Promise(resolve => setTimeout(resolve, 500));
                set({ services: generateMockServices(), isLoading: false });
            } catch (error) {
                console.error('Ошибка при загрузке услуг:', error);
                set({
                    error: error instanceof Error ? error.message : 'Неизвестная ошибка при загрузке услуг',
                    isLoading: false
                });
            }
        },

        addService: (serviceData) => {
            const id = uuidv4();
            const newService: Service = {
                ...serviceData,
                id,
            };

            set((state) => ({
                services: [...state.services, newService],
            }));

            return id;
        },

        updateService: (id, data) => {
            set((state) => ({
                services: state.services.map((service) =>
                    service.id === id ? { ...service, ...data } : service
                ),
            }));
        },

        deleteService: (id) => {
            set((state) => ({
                services: state.services.filter((service) => service.id !== id),
            }));
        },

        getServiceById: (id) => {
            return get().services.find((service) => service.id === id);
        },
    }));
};

// Ensure we only create one store instance in the client
let serviceStore: ReturnType<typeof createStore> | undefined;

export const useServiceStore = typeof window !== "undefined"
    ? (() => {
        if (!serviceStore) {
            serviceStore = createStore();
        }
        return serviceStore;
    })()
    : createStore(); 