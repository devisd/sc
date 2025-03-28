'use client';

import { useState, useEffect, useCallback } from 'react';

import { AddIcon, EditIcon, DeleteIcon } from '@/components/ui/icons';
import { useServiceStore } from '@/lib/stores/serviceStore';
import { Service } from '@/lib/types';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { Alert, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@/components/ui/elements';
import styles from './page.module.scss';

/**
 * Интерфейс для формы добавления/редактирования услуг и запчастей
 */
interface ServiceFormData {
    /** Название услуги или запчасти */
    name: string;
    /** Тип: услуга или запчасть */
    type: 'service' | 'part';
    /** Цена в рублях */
    price: number;
}

/**
 * Страница управления услугами и запчастями
 * Позволяет просматривать, добавлять, редактировать и удалять услуги и запчасти
 */
export default function ServicesPage() {
    // Получаем данные и методы из хранилища услуг
    const { services, isLoading, error, fetchServices, addService, updateService, deleteService } = useServiceStore();

    // Локальные состояния страницы
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentService, setCurrentService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<ServiceFormData>({
        name: '',
        type: 'service',
        price: 0
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    /**
     * Загрузка услуг и запчастей при монтировании компонента
     */
    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    /**
     * Обработчик переключения вкладок
     */
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    /**
     * Открывает диалог добавления или редактирования
     * @param mode Режим работы: добавление или редактирование
     * @param service Данные услуги при редактировании
     */
    const handleOpenDialog = useCallback((mode: 'add' | 'edit', service?: Service) => {
        setIsEditMode(mode === 'edit');
        if (mode === 'edit' && service) {
            // Заполняем форму данными редактируемой услуги
            setCurrentService(service);
            setFormData({
                name: service.name,
                type: service.type,
                price: service.price
            });
        } else {
            // Сбрасываем форму для добавления новой услуги
            setCurrentService(null);
            setFormData({
                name: '',
                type: activeTab === 0 ? 'service' : 'part',
                price: 0
            });
        }
        setErrors({});
        setOpenDialog(true);
    }, [activeTab]);

    /**
     * Закрывает диалог добавления/редактирования
     */
    const handleCloseDialog = () => setOpenDialog(false);

    /**
     * Валидирует данные формы перед отправкой
     * @returns Результат валидации (true если валидация успешна)
     */
    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Введите наименование';
        }

        if (formData.price < 0) {
            newErrors.price = 'Цена не может быть отрицательной';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    /**
     * Обработчик отправки формы
     */
    const handleSubmit = useCallback(() => {
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                if (isEditMode && currentService) {
                    // Обновляем существующую услугу
                    updateService(currentService.id, formData);
                } else {
                    // Добавляем новую услугу
                    addService(formData);
                }
                handleCloseDialog();
            } catch (error) {
                console.error('Ошибка при сохранении:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [validateForm, isEditMode, currentService, formData, updateService, addService]);

    /**
     * Обработчик изменения полей формы
     */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (!name) return;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value,
        }));

        // Очищаем ошибку при редактировании поля
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    /**
     * Показывает диалог подтверждения удаления
     */
    const handleConfirmDelete = useCallback((serviceId: string) => {
        setServiceToDelete(serviceId);
        setShowConfirmDelete(true);
    }, []);

    /**
     * Выполняет удаление услуги после подтверждения
     */
    const handleDelete = useCallback(() => {
        if (serviceToDelete) {
            setIsDeleting(true);
            try {
                deleteService(serviceToDelete);
                handleCancelDelete();
            } catch (error) {
                console.error('Ошибка при удалении:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    }, [serviceToDelete, deleteService]);

    /**
     * Отменяет удаление услуги
     */
    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
        setServiceToDelete(null);
    };

    // Фильтруем услуги/запчасти в зависимости от активной вкладки
    const filteredServices = services.filter(service =>
        (activeTab === 0 && service.type === 'service') ||
        (activeTab === 1 && service.type === 'part')
    );

    return (
        <Container maxWidth="lg" className="py-4">
            {/* Заголовок и кнопка добавления */}
            <div className={styles.header}>
                <Typography variant="h3" component="h1" className={styles.title}>
                    Услуги и запчасти
                </Typography>
                <Button
                    onClick={() => handleOpenDialog('add')}
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    disabled={isSubmitting || isDeleting}
                >
                    Добавить {activeTab === 0 ? 'услугу' : 'запчасть'}
                </Button>
            </div>

            {/* Отображение ошибки, если есть */}
            {error && (
                <Alert severity="error" className={styles.errorAlert}>
                    {error}
                </Alert>
            )}

            {/* Обработка ошибок рендеринга */}
            <ErrorBoundary>
                {isLoading ? (
                    <SkeletonLoader />
                ) : (
                    <div className="space-y-2">
                        {/* Вкладки для переключения между услугами и запчастями */}
                        <div className={styles.tabBar}>
                            <div className={styles.tabsContainer}>
                                <button
                                    onClick={(e) => handleTabChange(e, 0)}
                                    className={`${styles.tab} ${activeTab === 0 ? styles.tabActive : ''}`}
                                >
                                    Услуги
                                </button>
                                <button
                                    onClick={(e) => handleTabChange(e, 1)}
                                    className={`${styles.tab} ${activeTab === 1 ? styles.tabActive : ''}`}
                                >
                                    Запчасти
                                </button>
                            </div>
                        </div>

                        {/* Таблица услуг/запчастей */}
                        <div className={styles.tableContainer}>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className={styles.tableHeader}>
                                    <tr>
                                        <th className={styles.tableHeaderCell}>
                                            Название
                                        </th>
                                        <th className={styles.tableHeaderCell}>
                                            Цена (₽)
                                        </th>
                                        <th className={styles.tableHeaderCellRight}>
                                            Действия
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={styles.tableBody}>
                                    {filteredServices.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className={styles.emptyMessage}>
                                                Нет данных
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredServices.map(service => (
                                            <tr key={service.id} className={styles.tableRow}>
                                                <td className={styles.tableCellName}>
                                                    {service.name}
                                                </td>
                                                <td className={styles.tableCellPrice}>
                                                    {service.price} ₽
                                                </td>
                                                <td className={styles.tableCellActions}>
                                                    <button
                                                        className={styles.editButton}
                                                        onClick={() => handleOpenDialog('edit', service)}
                                                    >
                                                        <EditIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className={styles.deleteButton}
                                                        onClick={() => handleConfirmDelete(service.id)}
                                                    >
                                                        <DeleteIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </ErrorBoundary>

            {/* Диалог добавления/редактирования */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {isEditMode ? 'Редактировать' : 'Добавить'} {formData.type === 'service' ? 'услугу' : 'запчасть'}
                </DialogTitle>
                <DialogContent>
                    <div className={styles.formControl}>
                        <label htmlFor="name" className={styles.label}>Наименование</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                        />
                        {errors.name && <div className={styles.errorText}>{errors.name}</div>}
                    </div>

                    <div className={styles.formControl}>
                        <label htmlFor="type" className={styles.label}>Тип</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="service">Услуга</option>
                            <option value="part">Запчасть</option>
                        </select>
                    </div>

                    <div className={styles.formControl}>
                        <label htmlFor="price" className={styles.label}>Цена (₽)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                        />
                        {errors.price && <div className={styles.errorText}>{errors.price}</div>}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог подтверждения удаления */}
            <Dialog
                open={showConfirmDelete}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Удаление</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить этот элемент?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="inherit">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Удаление...' : 'Удалить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 