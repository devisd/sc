import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // синий цвет
            light: '#42a5f5',
            dark: '#1565c0',
        },
        secondary: {
            main: '#f50057', // розовый цвет
            light: '#ff4081',
            dark: '#c51162',
        },
        error: {
            main: '#f44336', // красный для отмененных заказов
        },
        warning: {
            main: '#ff9800', // оранжевый для заказов в работе
        },
        info: {
            main: '#2196f3', // синий для новых заказов
        },
        success: {
            main: '#4caf50', // зеленый для выполненных заказов
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08)',
                },
            },
        },
    },
});

export default theme; 