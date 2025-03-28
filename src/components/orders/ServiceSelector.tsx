'use client';

import { useState } from 'react';
import { AddIcon, DeleteIcon, CloseIcon } from '@/components/ui/icons';
import { Service } from '@/lib/types';
import { useServiceStore } from '@/lib/stores/serviceStore';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '../ui/elements';
import styles from './ServiceSelector.module.scss';
import clsx from 'clsx';

interface ServiceSelectorProps {
    onAddService: (service: Omit<Service, 'id'>) => Promise<void>;
    onRemoveService: (serviceId: string) => Promise<void>;
    onUpdateQuantity: (serviceId: string, quantity: number) => Promise<void>;
    orderServices: Service[];
}

// Компонент кнопок управления количеством с использованием SCSS модуля
const QuantityButton = ({ onClick, disabled, children }: { onClick: () => void, disabled: boolean, children: React.ReactNode }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={styles.quantityButton}
    >
        {children}
    </button>
);

// Компонент ServiceItem для отображения услуги или запчасти
const ServiceItem = ({
    item,
    onRemove,
    onChangeQuantity,
    isLoading,
    loadingId
}: {
    item: Service,
    onRemove: (id: string) => Promise<void>,
    onChangeQuantity: (id: string, quantity: number) => Promise<void>,
    isLoading: boolean,
    loadingId: string | null
}) => {
    const isItemLoading = loadingId === item.id;

    return (
        <li className={styles.serviceItem}>
            <div className="flex flex-col relative pr-10">
                <div className="flex justify-between items-start">
                    <div className={styles.itemContent}>
                        <p className={styles.itemTitle}>{item.name}</p>
                        <p className={styles.itemPrice}>
                            Цена: {item.price} ₽
                        </p>
                    </div>
                    <div className="text-right">
                        <p className={styles.itemTotal}>
                            {item.price * (item.quantity || 1)} ₽
                        </p>
                    </div>
                </div>

                <div className="flex items-center mt-2 justify-between">
                    <div className="flex items-center space-x-3">
                        <QuantityButton
                            onClick={() => onChangeQuantity(item.id, (item.quantity || 1) - 1)}
                            disabled={isItemLoading || (item.quantity || 1) <= 1}
                        >
                            -
                        </QuantityButton>

                        <span className="w-8 text-center">
                            {isItemLoading ?
                                <span className={clsx(styles.spinner, "w-4 h-4 border-indigo-500 dark:border-indigo-400")}></span> :
                                (item.quantity || 1)
                            }
                        </span>

                        <QuantityButton
                            onClick={() => onChangeQuantity(item.id, (item.quantity || 1) + 1)}
                            disabled={isItemLoading}
                        >
                            +
                        </QuantityButton>
                    </div>

                    <button
                        className={styles.deleteButton}
                        onClick={() => onRemove(item.id)}
                        disabled={isItemLoading}
                        aria-label="Удалить"
                    >
                        {isItemLoading ?
                            <span className={clsx(styles.spinner, "w-5 h-5 border-red-500 dark:border-red-400")}></span> :
                            <DeleteIcon className="w-5 h-5" />
                        }
                    </button>
                </div>
            </div>
        </li>
    );
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
    onAddService,
    onRemoveService,
    onUpdateQuantity,
    orderServices
}) => {
    const { services } = useServiceStore();
    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingServiceId, setLoadingServiceId] = useState<string | null>(null);

    const handleOpen = () => {
        setOpen(true);
        setSelectedService('');
        setQuantity(1);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (!selectedService || isLoading) return;

        const serviceToAdd = services.find(s => s.id === selectedService);
        if (!serviceToAdd) return;

        setIsLoading(true);
        try {
            await onAddService({
                name: serviceToAdd.name,
                type: serviceToAdd.type,
                price: serviceToAdd.price,
                quantity: quantity
            });
            handleClose();
        } catch (error) {
            console.error('Ошибка добавления услуги:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (serviceId: string) => {
        if (loadingServiceId) return;

        setLoadingServiceId(serviceId);
        try {
            await onRemoveService(serviceId);
        } catch (error) {
            console.error('Ошибка удаления услуги:', error);
        } finally {
            setLoadingServiceId(null);
        }
    };

    const handleQuantityChange = async (serviceId: string, newQuantity: number) => {
        if (newQuantity < 1 || loadingServiceId === serviceId) return;

        setLoadingServiceId(serviceId);
        try {
            await onUpdateQuantity(serviceId, newQuantity);
        } catch (error) {
            console.error('Ошибка обновления количества:', error);
        } finally {
            setLoadingServiceId(null);
        }
    };

    const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement> | { target: { name?: string; value: string } }) => {
        setSelectedService(event.target.value);
    };

    // Фильтруем доступные услуги - исключаем уже добавленные
    const availableServices = services.filter(service =>
        !orderServices.some(s => s.name === service.name && s.type === service.type)
    );

    // Группировка услуг и запчастей для отображения
    const servicesItems = orderServices.filter(s => s.type === 'service');
    const partsItems = orderServices.filter(s => s.type === 'part');

    return (
        <div className={styles.container}>
            <div className="flex justify-end mb-4">
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                    className={styles.addButton}
                    disabled={isLoading}
                >
                    Добавить
                </Button>
            </div>

            {orderServices.length === 0 ? (
                <div className={styles.emptyContainer}>
                    <Typography color="secondary" component="div" className="text-gray-500 dark:text-gray-400">
                        Услуги и запчасти не добавлены
                    </Typography>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {servicesItems.length > 0 && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Typography variant="h3" component="div" className="font-medium text-gray-900 dark:text-white">
                                    Услуги
                                </Typography>
                            </div>
                            <ul className={styles.sectionList}>
                                {servicesItems.map((service) => (
                                    <ServiceItem
                                        key={service.id}
                                        item={service}
                                        onRemove={handleRemove}
                                        onChangeQuantity={handleQuantityChange}
                                        isLoading={isLoading}
                                        loadingId={loadingServiceId}
                                    />
                                ))}
                            </ul>
                        </div>
                    )}

                    {partsItems.length > 0 && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <Typography variant="h3" component="div" className="font-medium text-gray-900 dark:text-white">
                                    Запчасти
                                </Typography>
                            </div>
                            <ul className={styles.sectionList}>
                                {partsItems.map((part) => (
                                    <ServiceItem
                                        key={part.id}
                                        item={part}
                                        onRemove={handleRemove}
                                        onChangeQuantity={handleQuantityChange}
                                        isLoading={isLoading}
                                        loadingId={loadingServiceId}
                                    />
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <div className="flex justify-between items-center">
                        <Typography variant="h3" className={styles.modalTitle}>
                            Добавить услугу или запчасть
                        </Typography>
                        <button
                            onClick={handleClose}
                            aria-label="Закрыть"
                            className={styles.closeButton}
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="px-2 py-2">
                        {availableServices.length === 0 ? (
                            <div className="text-center py-4">
                                <Typography color="secondary" className="text-gray-500 dark:text-gray-400">
                                    Все доступные услуги и запчасти уже добавлены
                                </Typography>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <FormControl fullWidth>
                                    <label htmlFor="service-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Выберите услугу или запчасть
                                    </label>
                                    <select
                                        id="service-select"
                                        value={selectedService}
                                        onChange={(e) => handleServiceChange({ target: { name: 'selectedService', value: e.target.value } })}
                                        className={styles.formInput}
                                    >
                                        <option value="">Выберите из списка</option>
                                        <optgroup label="Услуги">
                                            {availableServices
                                                .filter(s => s.type === 'service')
                                                .map(service => (
                                                    <option key={service.id} value={service.id}>
                                                        {service.name} - {service.price} ₽
                                                    </option>
                                                ))}
                                        </optgroup>
                                        <optgroup label="Запчасти">
                                            {availableServices
                                                .filter(s => s.type === 'part')
                                                .map(part => (
                                                    <option key={part.id} value={part.id}>
                                                        {part.name} - {part.price} ₽
                                                    </option>
                                                ))}
                                        </optgroup>
                                    </select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <label htmlFor="quantity-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Количество
                                    </label>
                                    <input
                                        id="quantity-input"
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className={styles.formInput}
                                    />
                                </FormControl>
                            </div>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className={styles.modalActions}>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm"
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            disabled={!selectedService || isLoading}
                            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-md text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <span className={clsx(styles.spinner, "w-4 h-4 mr-2 border-white")}></span>
                                    Добавление...
                                </span>
                            ) : "Добавить"}
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}; 