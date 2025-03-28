'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

import { CloseIcon } from '@/components/ui/icons';
import { Order, DEVICE_TYPE_LABELS } from '@/lib/types';
import { useOrderStore } from '@/lib/stores/orderStore';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '../ui/elements';
import styles from './NewOrderModal.module.scss';

type DeviceType = Order['deviceType'];

/**
 * Интерфейс пропсов модального окна создания заказа
 */
interface NewOrderModalProps {
    /** Флаг открытия модального окна */
    open: boolean;
    /** Обработчик закрытия модального окна */
    onClose: () => void;
}

/**
 * Компонент модального окна создания нового заказа
 */
export const NewOrderModal: React.FC<NewOrderModalProps> = ({ open, onClose }: NewOrderModalProps) => {
    const { addOrder, isLoading } = useOrderStore();
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        deviceType: 'smartphone' as DeviceType,
        model: '',
        problemDescription: '',
        prepayment: 0,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPrepayment, setShowPrepayment] = useState(false);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    /**
     * Обработчик изменения полей формы
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (!name) return;

        setFormData({
            ...formData,
            [name]: name === 'prepayment' && typeof value === 'string' ? Number(value) : value,
        });

        // Очищаем ошибку при редактировании поля
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    /**
     * Обработчик изменения выпадающих списков
     */
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (!name) return;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    /**
     * Обработчик изменения чекбокса предоплаты
     */
    const handlePrepaymentToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setShowPrepayment(isChecked);

        if (!isChecked) {
            // Если предоплата отключена, сбрасываем значение и ошибки
            setFormData({
                ...formData,
                prepayment: 0
            });

            if (errors.prepayment) {
                setErrors({
                    ...errors,
                    prepayment: ''
                });
            }
        }
    };

    /**
     * Валидация формы перед отправкой
     */
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.clientName.trim()) {
            newErrors.clientName = 'Введите ФИО клиента';
        }

        if (!formData.clientPhone.trim()) {
            newErrors.clientPhone = 'Введите телефон клиента';
        } else if (!/^\+?\d{10,12}$/.test(formData.clientPhone.replace(/\s/g, ''))) {
            newErrors.clientPhone = 'Неверный формат телефона';
        }

        if (!formData.model.trim()) {
            newErrors.model = 'Введите модель устройства';
        }

        if (showPrepayment && formData.prepayment < 0) {
            newErrors.prepayment = 'Предоплата не может быть отрицательной';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Обработчик отправки формы
     */
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            await addOrder({
                clientName: formData.clientName,
                clientPhone: formData.clientPhone,
                clientEmail: '',
                deviceType: formData.deviceType,
                deviceModel: formData.model,
                serialNumber: '',
                issueDescription: formData.problemDescription,
                prepayment: showPrepayment ? formData.prepayment : 0,
                masterComment: '',
                status: 'new',
                services: [],
            });

            // Сбрасываем форму и закрываем модальное окно
            resetFormAndClose();
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Сброс формы и закрытие модального окна
     */
    const resetFormAndClose = () => {
        setFormData({
            clientName: '',
            clientPhone: '',
            deviceType: 'smartphone' as DeviceType,
            model: '',
            problemDescription: '',
            prepayment: 0,
        });
        setErrors({});
        setShowPrepayment(true);
        onClose();
    };

    /**
     * Обработчик закрытия модального окна
     */
    const handleClose = useCallback(() => {
        resetFormAndClose();
    }, [onClose]);

    // Обработка нажатия клавиши Escape
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && open) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [open, handleClose]);

    // Установка фокуса на кнопку закрытия при открытии модального окна
    useEffect(() => {
        if (open && closeButtonRef.current) {
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 0);
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <div className={styles.dialogHeader}>
                    <Typography variant="h3">Новый заказ</Typography>
                    <button
                        onClick={handleClose}
                        aria-label="Закрыть"
                        className={styles.closeButton}
                        ref={closeButtonRef}
                    >
                        <CloseIcon className={styles.closeIcon} />
                    </button>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className={styles.formContainer}>
                    <div className={styles.formField}>
                        <label htmlFor="clientName" className={styles.label}>
                            ФИО клиента
                        </label>
                        <input
                            type="text"
                            id="clientName"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.clientName ? styles.inputError : ''}`}
                            aria-required="true"
                            aria-invalid={!!errors.clientName}
                        />
                        {errors.clientName && (
                            <p className={styles.errorText}>{errors.clientName}</p>
                        )}
                    </div>

                    <div className={styles.formField}>
                        <label htmlFor="clientPhone" className={styles.label}>
                            Телефон
                        </label>
                        <input
                            type="text"
                            id="clientPhone"
                            name="clientPhone"
                            value={formData.clientPhone}
                            onChange={handleChange}
                            placeholder="+79991234567"
                            className={`${styles.input} ${errors.clientPhone ? styles.inputError : ''}`}
                            aria-required="true"
                            aria-invalid={!!errors.clientPhone}
                        />
                        {errors.clientPhone ? (
                            <p className={styles.errorText}>{errors.clientPhone}</p>
                        ) : (
                            <p className={styles.helpText}>Пример: +79991234567</p>
                        )}
                    </div>

                    <div className={styles.formField}>
                        <label htmlFor="deviceType" className={styles.label}>
                            Тип устройства
                        </label>
                        <select
                            id="deviceType"
                            name="deviceType"
                            value={formData.deviceType}
                            onChange={handleSelectChange}
                            className={styles.select}
                        >
                            {Object.entries(DEVICE_TYPE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formField}>
                        <label htmlFor="model" className={styles.label}>
                            Модель устройства
                        </label>
                        <input
                            type="text"
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.model ? styles.inputError : ''}`}
                            aria-required="true"
                            aria-invalid={!!errors.model}
                        />
                        {errors.model && (
                            <p className={styles.errorText}>{errors.model}</p>
                        )}
                    </div>

                    <div className={styles.formField}>
                        <label htmlFor="problemDescription" className={styles.label}>
                            Описание проблемы
                        </label>
                        <textarea
                            id="problemDescription"
                            name="problemDescription"
                            value={formData.problemDescription}
                            onChange={handleChange}
                            rows={3}
                            className={styles.textarea}
                        />
                    </div>

                    <div className={styles.formField}>
                        <div className={styles.prepaymentHeader}>
                            <label htmlFor="prepaymentToggle" className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    id="prepaymentToggle"
                                    checked={showPrepayment}
                                    onChange={handlePrepaymentToggle}
                                    className={styles.checkbox}
                                />
                                <span className={styles.label}>Предоплата (₽)</span>
                            </label>
                        </div>

                        {showPrepayment && (
                            <>
                                <input
                                    type="number"
                                    id="prepayment"
                                    name="prepayment"
                                    value={formData.prepayment}
                                    onChange={handleChange}
                                    min="0"
                                    className={`${styles.input} ${errors.prepayment ? styles.inputError : ''}`}
                                />
                                {errors.prepayment && (
                                    <p className={styles.errorText}>{errors.prepayment}</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="text"
                    color="inherit"
                    onClick={handleClose}
                    disabled={isSubmitting}
                >
                    Отмена
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Создание...' : 'Создать заказ'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 