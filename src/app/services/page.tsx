'use client';

import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Container,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton,
    Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, FormControl,
    InputLabel, Select, MenuItem, SelectChangeEvent,
    Stack, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useServiceStore } from '@/lib/stores/serviceStore';
import { Service } from '@/lib/types';

export default function ServicesPage() {
    const { services, isLoading, error, fetchServices, addService, updateService, deleteService } = useServiceStore();
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentService, setCurrentService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'service' as 'service' | 'part',
        price: 0
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Загрузка услуг при монтировании компонента
    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleOpenDialog = (mode: 'add' | 'edit', service?: Service) => {
        setIsEditMode(mode === 'edit');
        if (mode === 'edit' && service) {
            setCurrentService(service);
            setFormData({
                name: service.name,
                type: service.type,
                price: service.price
            });
        } else {
            setCurrentService(null);
            setFormData({
                name: '',
                type: 'service',
                price: 0
            });
        }
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Введите наименование';
        }

        if (formData.price < 0) {
            newErrors.price = 'Цена не может быть отрицательной';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                if (isEditMode && currentService) {
                    updateService(currentService.id, formData);
                } else {
                    addService(formData);
                }
                handleCloseDialog();
            } catch (error) {
                console.error('Ошибка при сохранении услуги:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
        const { name, value } = e.target;
        if (!name) return;

        setFormData({
            ...formData,
            [name]: name === 'price' ? Number(value) : value,
        });

        // Очищаем ошибку при редактировании поля
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const handleConfirmDelete = (serviceId: string) => {
        setServiceToDelete(serviceId);
        setShowConfirmDelete(true);
    };

    const handleDelete = () => {
        if (serviceToDelete) {
            setIsDeleting(true);
            try {
                deleteService(serviceToDelete);
                handleCancelDelete();
            } catch (error) {
                console.error('Ошибка при удалении услуги:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
        setServiceToDelete(null);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Услуги и запчасти
                </Typography>
                <Button
                    onClick={() => handleOpenDialog('add')}
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    disabled={isSubmitting || isDeleting}
                >
                    Добавить
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={2}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Название</TableCell>
                                <TableCell>Тип</TableCell>
                                <TableCell>Цена (₽)</TableCell>
                                <TableCell align="right">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell component="th" scope="row">
                                        {service.name}
                                    </TableCell>
                                    <TableCell>{service.type === 'service' ? 'Услуга' : 'Запчасть'}</TableCell>
                                    <TableCell>{service.price} ₽</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleOpenDialog('edit', service);
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleConfirmDelete(service.id);
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Диалог добавления/редактирования */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isEditMode ? 'Редактировать' : 'Добавить'} услугу/запчасть
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Наименование"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name}
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel id="type-label">Тип</InputLabel>
                            <Select
                                labelId="type-label"
                                name="type"
                                value={formData.type}
                                label="Тип"
                                onChange={handleChange}
                            >
                                <MenuItem value="service">Услуга</MenuItem>
                                <MenuItem value="part">Запчасть</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Стоимость (₽)"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.price}
                            helperText={errors.price}
                            InputProps={{
                                endAdornment: '₽',
                                inputProps: { min: 0 }
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary" disabled={isSubmitting}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            isEditMode ? 'Сохранить' : 'Добавить'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог подтверждения удаления */}
            <Dialog
                open={showConfirmDelete}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xs"
            >
                <DialogTitle id="alert-dialog-title">Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить эту услугу/запчасть? Это действие нельзя отменить.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary" disabled={isDeleting}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        autoFocus
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Удалить'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 