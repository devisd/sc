'use client';

import { useState } from 'react';
import {
    Box, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, FormControl, InputLabel,
    Select, MenuItem, Divider, Typography, IconButton,
    List, ListItem, ListItemText,
    Paper, Stack, SelectChangeEvent, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Service } from '@/lib/types';
import { useServiceStore } from '@/lib/stores/serviceStore';

interface ServiceSelectorProps {
    onAddService: (service: Omit<Service, 'id'>) => Promise<void>;
    onRemoveService: (serviceId: string) => Promise<void>;
    onUpdateQuantity: (serviceId: string, quantity: number) => Promise<void>;
    orderServices: Service[];
}

export default function ServiceSelector({
    onAddService,
    onRemoveService,
    onUpdateQuantity,
    orderServices
}: ServiceSelectorProps) {
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

    const handleServiceChange = (event: SelectChangeEvent) => {
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
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                    id="service-add-button"
                    disabled={isLoading}
                >
                    Добавить
                </Button>
            </Box>

            {orderServices.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary" component="div">
                        Услуги и запчасти не добавлены
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={3}>
                    {servicesItems.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" component="div" sx={{ mb: 1 }}>Услуги</Typography>
                            <List disablePadding>
                                {servicesItems.map((service) => (
                                    <ListItem
                                        key={service.id}
                                        divider
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemove(service.id)}
                                                size="small"
                                                disabled={loadingServiceId === service.id}
                                            >
                                                {loadingServiceId === service.id ?
                                                    <CircularProgress size={16} /> :
                                                    <DeleteIcon fontSize="small" />
                                                }
                                            </IconButton>
                                        }
                                        dense
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 5 }}>
                                                    <Typography component="div" variant="body2" sx={{ flexGrow: 1 }}>{service.name}</Typography>
                                                    <Typography component="div" variant="body2" sx={{ fontWeight: 'medium' }}>
                                                        {service.price} ₽
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleQuantityChange(service.id, (service.quantity || 1) - 1)}
                                                        disabled={(service.quantity || 1) <= 1 || loadingServiceId === service.id}
                                                        sx={{ minWidth: '30px', px: 0 }}
                                                    >
                                                        -
                                                    </Button>
                                                    <Typography component="div" variant="body2" sx={{ mx: 1 }}>
                                                        {loadingServiceId === service.id ?
                                                            <CircularProgress size={14} sx={{ mx: 0.5 }} /> :
                                                            (service.quantity || 1)
                                                        }
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleQuantityChange(service.id, (service.quantity || 1) + 1)}
                                                        disabled={loadingServiceId === service.id}
                                                        sx={{ minWidth: '30px', px: 0 }}
                                                    >
                                                        +
                                                    </Button>
                                                    <Typography component="div" variant="body2" sx={{ ml: 2 }}>
                                                        Итого: {service.price * (service.quantity || 1)} ₽
                                                    </Typography>
                                                </Box>
                                            }
                                            secondaryTypographyProps={{ component: 'div' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    {partsItems.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" component="div" sx={{ mb: 1 }}>Запчасти</Typography>
                            <List disablePadding>
                                {partsItems.map((part) => (
                                    <ListItem
                                        key={part.id}
                                        divider
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleRemove(part.id)}
                                                size="small"
                                                disabled={loadingServiceId === part.id}
                                            >
                                                {loadingServiceId === part.id ?
                                                    <CircularProgress size={16} /> :
                                                    <DeleteIcon fontSize="small" />
                                                }
                                            </IconButton>
                                        }
                                        dense
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: 5 }}>
                                                    <Typography component="div" variant="body2" sx={{ flexGrow: 1 }}>{part.name}</Typography>
                                                    <Typography component="div" variant="body2" sx={{ fontWeight: 'medium' }}>
                                                        {part.price} ₽
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleQuantityChange(part.id, (part.quantity || 1) - 1)}
                                                        disabled={(part.quantity || 1) <= 1 || loadingServiceId === part.id}
                                                        sx={{ minWidth: '30px', px: 0 }}
                                                    >
                                                        -
                                                    </Button>
                                                    <Typography component="div" variant="body2" sx={{ mx: 1 }}>
                                                        {loadingServiceId === part.id ?
                                                            <CircularProgress size={14} sx={{ mx: 0.5 }} /> :
                                                            (part.quantity || 1)
                                                        }
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() => handleQuantityChange(part.id, (part.quantity || 1) + 1)}
                                                        disabled={loadingServiceId === part.id}
                                                        sx={{ minWidth: '30px', px: 0 }}
                                                    >
                                                        +
                                                    </Button>
                                                    <Typography component="div" variant="body2" sx={{ ml: 2 }}>
                                                        Итого: {part.price * (part.quantity || 1)} ₽
                                                    </Typography>
                                                </Box>
                                            }
                                            secondaryTypographyProps={{ component: 'div' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Stack>
            )}

            {/* Диалог добавления услуги/запчасти */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Добавить услугу или запчасть</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel id="service-select-label">Услуга или запчасть</InputLabel>
                            <Select
                                labelId="service-select-label"
                                value={selectedService}
                                label="Услуга или запчасть"
                                onChange={handleServiceChange}
                            >
                                {availableServices.length === 0 ? (
                                    <MenuItem disabled>Нет доступных услуг или запчастей</MenuItem>
                                ) : (
                                    [
                                        <MenuItem key="placeholder" disabled value="">
                                            <em>Выберите услугу или запчасть</em>
                                        </MenuItem>,
                                        <MenuItem key="service-header" disabled sx={{ opacity: 0.7 }}>
                                            <Typography variant="subtitle2" component="span">Услуги</Typography>
                                        </MenuItem>,
                                        ...availableServices
                                            .filter(s => s.type === 'service')
                                            .map(service => (
                                                <MenuItem key={service.id} value={service.id}>
                                                    {service.name} - {service.price} ₽
                                                </MenuItem>
                                            )),
                                        <Divider key="divider" />,
                                        <MenuItem key="part-header" disabled sx={{ opacity: 0.7 }}>
                                            <Typography variant="subtitle2" component="span">Запчасти</Typography>
                                        </MenuItem>,
                                        ...availableServices
                                            .filter(s => s.type === 'part')
                                            .map(part => (
                                                <MenuItem key={part.id} value={part.id}>
                                                    {part.name} - {part.price} ₽
                                                </MenuItem>
                                            ))
                                    ]
                                )}
                            </Select>
                        </FormControl>

                        {selectedService && (
                            <TextField
                                label="Количество"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                fullWidth
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="inherit" disabled={isLoading}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        disabled={!selectedService || isLoading}
                        startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
                    >
                        {isLoading ? 'Добавление...' : 'Добавить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
} 