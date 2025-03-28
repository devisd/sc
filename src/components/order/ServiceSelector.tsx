'use client';

import { useState, useEffect } from 'react';
import { OrderService } from '@/lib/types';

interface ServiceSelectorProps {
    orderServices: OrderService[];
    onAddService: (serviceId: string) => Promise<void>;
    onRemoveService: (orderServiceId: string) => Promise<void>;
    onUpdateQuantity: (orderService: OrderService, newQuantity: number) => Promise<void>;
}

export function ServiceSelector({
    orderServices,
    onAddService,
    onRemoveService,
    onUpdateQuantity
}: ServiceSelectorProps) {
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [availableServices, setAvailableServices] = useState<any[]>([]);

    // Загрузка доступных услуг при монтировании компонента
    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Здесь можно загрузить услуги из API
                // Для демонстрации используем моковые данные
                setAvailableServices([
                    { id: 'service1', name: 'Диагностика', price: 1000 },
                    { id: 'service2', name: 'Замена экрана', price: 5000 },
                    { id: 'service3', name: 'Замена батареи', price: 2500 },
                ]);
            } catch (error) {
                console.error('Ошибка при загрузке услуг:', error);
            }
        };

        fetchServices();
    }, []);

    const handleAddService = async () => {
        if (!selectedServiceId) return;
        await onAddService(selectedServiceId);
        setSelectedServiceId('');
    };

    return (
        <div className="space-y-4">
            <div className="flex space-x-2">
                <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="flex-grow p-2 border rounded"
                >
                    <option value="">Выберите услугу или запчасть</option>
                    {availableServices.map(service => (
                        <option key={service.id} value={service.id}>
                            {service.name} - {service.price} ₽
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleAddService}
                    disabled={!selectedServiceId}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Добавить
                </button>
            </div>

            <div className="mt-4">
                <h4 className="font-medium mb-2">Добавленные услуги и запчасти</h4>
                {orderServices.length === 0 ? (
                    <p className="text-gray-500">Нет добавленных услуг</p>
                ) : (
                    <ul className="divide-y">
                        {orderServices.map((service) => (
                            <li key={service.id} className="py-2 flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{service.name || 'Услуга'}</p>
                                    <p className="text-sm text-gray-500">{service.price} ₽</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => onUpdateQuantity(service, Math.max(1, service.quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center rounded bg-gray-200"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center">{service.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(service, service.quantity + 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded bg-gray-200"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => onRemoveService(service.id)}
                                        className="ml-2 px-2 py-1 bg-red-500 text-white text-sm rounded"
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
} 