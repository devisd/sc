/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    important: true,
    darkMode: 'class',
    theme: {
        screens: {
            'xs': '480px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'rgb(var(--color-primary))',
                    light: 'rgb(var(--color-primary-light))',
                    dark: 'rgb(var(--color-primary-dark))',
                },
                secondary: {
                    DEFAULT: 'rgb(var(--color-secondary))',
                    light: 'rgb(var(--color-secondary-light))',
                    dark: 'rgb(var(--color-secondary-dark))',
                },
                status: {
                    new: 'rgb(var(--status-new))',
                    in_progress: 'rgb(var(--status-in_progress))',
                    waiting_parts: 'rgb(var(--status-waiting_parts))',
                    ready: 'rgb(var(--status-ready))',
                    completed: 'rgb(var(--status-completed))',
                    canceled: 'rgb(var(--status-canceled))',
                },
                background: 'rgb(var(--color-background))',
                surface: 'rgb(var(--color-surface))',
                text: 'rgb(var(--color-text))',
                error: 'rgb(var(--color-error))',
                warning: 'rgb(var(--color-warning))',
                info: 'rgb(var(--color-info))',
                success: 'rgb(var(--color-success))',
            },
            fontSize: {
                'label': ['0.875rem', '1.25rem'], // text-sm с подходящим line-height
                'body': ['1rem', '1.5rem'], // стандартный текст
                'title': ['1.125rem', '1.75rem'] // для заголовков
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            },
            spacing: {
                'card-padding': '1rem', // p-4
                'container-y': '1.5rem', // py-6
                'container-x': '1rem', // px-4
            },
            borderRadius: {
                'card': '0.375rem', // rounded-md
                'button': '0.25rem', // rounded
                'input': '0.375rem', // rounded-md
            },
            animation: {
                'hover-up': 'hover-up 0.2s ease-out forwards',
            },
            keyframes: {
                'hover-up': {
                    '0%': { transform: 'translateY(0px)' },
                    '100%': { transform: 'translateY(-2px)' },
                }
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [
        // Плагин для добавления пользовательских утилит
        function ({ addUtilities, theme }) {
            const newUtilities = {
                '.text-primary': {
                    color: 'rgb(var(--color-text))',
                },
                '.dark .text-primary': {
                    color: 'rgb(var(--color-text))',
                },
                '.text-secondary': {
                    color: 'rgba(var(--color-text), 0.7)',
                },
                '.dark .text-secondary': {
                    color: 'rgba(var(--color-text), 0.7)',
                },
                '.text-tertiary': {
                    color: 'rgba(var(--color-text), 0.5)',
                },
                '.dark .text-tertiary': {
                    color: 'rgba(var(--color-text), 0.5)',
                },
                // Кнопки
                '.btn': {
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    fontWeight: 500,
                    transitionProperty: 'color, background-color',
                    transitionDuration: '150ms',
                },
                '.btn-primary': {
                    backgroundColor: 'rgb(var(--color-primary))',
                    color: 'white',
                },
                '.btn-primary:hover': {
                    backgroundColor: 'rgb(var(--color-primary-dark))',
                },
                '.btn-secondary': {
                    backgroundColor: 'rgb(var(--color-secondary))',
                    color: 'white',
                },
                '.btn-secondary:hover': {
                    backgroundColor: 'rgb(var(--color-secondary-dark))',
                },
                '.btn-outline': {
                    border: '1px solid rgba(var(--color-text), 0.2)',
                },
                '.btn-outline:hover': {
                    backgroundColor: 'rgba(var(--color-text), 0.05)',
                },
                '.dark .btn-outline': {
                    borderColor: 'rgba(var(--color-text), 0.2)',
                },
                '.dark .btn-outline:hover': {
                    backgroundColor: 'rgba(var(--color-text), 0.1)',
                },
                // Карточки
                '.card': {
                    backgroundColor: 'rgb(var(--color-surface))',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    padding: '1rem',
                },
                '.dark .card': {
                    backgroundColor: 'rgb(var(--color-surface))',
                },
            }
            addUtilities(newUtilities)
        }
    ],
} 