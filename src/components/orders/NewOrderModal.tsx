'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Typography,
    IconButton,
    SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Order, DEVICE_TYPE_LABELS } from '@/lib/types';
import { useOrderStore } from '@/lib/stores/orderStore';

type DeviceType = Order['deviceType'];

interface NewOrderModalProps {
    open: boolean;
    onClose: () => void;
}

export default function NewOrderModal({ open, onClose }: NewOrderModalProps) {
    const { addOrder } = useOrderStore();
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        deviceType: 'smartphone' as DeviceType,
        model: '',
        problemDescription: '',
        prepayment: 0,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (!name) return;

        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<DeviceType>) => {
        const { name, value } = e.target;
        if (!name) return;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

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

        if (formData.prepayment < 0) {
            newErrors.prepayment = 'Предоплата не может быть отрицательной';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        addOrder({
            client: {
                fullName: formData.clientName,
                phone: formData.clientPhone,
            },
            deviceType: formData.deviceType,
            model: formData.model,
            problemDescription: formData.problemDescription,
            prepayment: formData.prepayment,
            masterComment: '',
            status: 'new',
            services: [],
        });

        // Reset form and close modal
        setFormData({
            clientName: '',
            clientPhone: '',
            deviceType: 'smartphone' as DeviceType,
            model: '',
            problemDescription: '',
            prepayment: 0,
        });
        onClose();
    };

    const handleClose = useCallback(() => {
        setErrors({});
        setFormData({
            clientName: '',
            clientPhone: '',
            deviceType: 'smartphone' as DeviceType,
            model: '',
            problemDescription: '',
            prepayment: 0,
        });
        onClose();
    }, [onClose]);

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
            aria-labelledby="order-dialog-title"
            aria-modal={true}
            role="dialog"
        >
            <DialogTitle id="order-dialog-title">
                <Typography variant="h6" component="span">Новый заказ</Typography>
                <IconButton
                    onClick={handleClose}
                    aria-label="Закрыть"
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                    ref={closeButtonRef}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Информация о клиенте
                    </Typography>
                    <TextField
                        label="ФИО клиента"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.clientName}
                        helperText={errors.clientName}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.clientName}
                        aria-describedby={errors.clientName ? "clientName-error" : undefined}
                        id="clientName"
                    />
                    <TextField
                        label="Телефон"
                        name="clientPhone"
                        value={formData.clientPhone}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.clientPhone}
                        helperText={errors.clientPhone || 'Пример: +79991234567'}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.clientPhone}
                        aria-describedby={errors.clientPhone ? "clientPhone-error" : undefined}
                        id="clientPhone"
                    />

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                        Информация об устройстве
                    </Typography>
                    <FormControl fullWidth>
                        <InputLabel id="device-type-label">Тип устройства</InputLabel>
                        <Select
                            name="deviceType"
                            value={formData.deviceType}
                            label="Тип устройства"
                            onChange={handleSelectChange}
                            labelId="device-type-label"
                            id="deviceType"
                            aria-labelledby="device-type-label"
                        >
                            {Object.entries(DEVICE_TYPE_LABELS).map(([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Модель устройства"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.model}
                        helperText={errors.model}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.model}
                        aria-describedby={errors.model ? "model-error" : undefined}
                        id="model"
                    />
                    <TextField
                        label="Описание проблемы"
                        name="problemDescription"
                        value={formData.problemDescription}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        id="problemDescription"
                        aria-label="Описание проблемы"
                    />

                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                        Финансовая информация
                    </Typography>
                    <TextField
                        label="Предоплата (₽)"
                        name="prepayment"
                        type="number"
                        value={formData.prepayment}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.prepayment}
                        helperText={errors.prepayment}
                        id="prepayment"
                        aria-invalid={!!errors.prepayment}
                        aria-describedby={errors.prepayment ? "prepayment-error" : undefined}
                        InputProps={{
                            endAdornment: '₽',
                            inputProps: {
                                min: 0,
                                'aria-valuemin': 0
                            }
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    color="inherit"
                    tabIndex={0}
                    type="button"
                    ref={cancelButtonRef}
                >
                    Отмена
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    tabIndex={0}
                    type="button"
                >
                    Создать заказ
                </Button>
            </DialogActions>
        </Dialog>
    );
} 