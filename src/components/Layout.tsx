'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Box, AppBar, Toolbar, Typography,
    Button, Drawer, List,
    ListItem, ListItemButton, ListItemIcon,
    ListItemText, Divider, IconButton
} from '@mui/material';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(path + '/');
    };

    // Навигационные пункты меню
    const navItems = [
        { path: '/orders', label: 'Заказы', icon: <RecentActorsIcon /> },
        { path: '/services', label: 'Услуги и запчасти', icon: <SettingsIcon /> },
    ];

    const drawerContent = (
        <Box sx={{ width: 260 }} role="presentation">
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    Сервисный Центр
                </Typography>
            </Box>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={Link}
                            href={item.path}
                            selected={isActive(item.path)}
                            onClick={toggleDrawer}
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="sticky" color="default" elevation={1}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleDrawer}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component={Link}
                        href="/"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 'bold',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Сервисный Центр
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.path}
                                component={Link}
                                href={item.path}
                                sx={{
                                    mx: 1,
                                    color: 'inherit',
                                    fontWeight: isActive(item.path) ? 'bold' : 'normal',
                                    borderBottom: isActive(item.path) ? '2px solid' : 'none',
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
                sx={{ display: { xs: 'block', sm: 'none' } }}
            >
                {drawerContent}
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>
        </Box>
    );
} 