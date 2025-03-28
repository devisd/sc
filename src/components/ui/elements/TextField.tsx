'use client';

import React from 'react';
import { clsx } from 'clsx';

interface TextFieldProps {
    label?: string;
    name?: string;
    id?: string;
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    type?: string;
    fullWidth?: boolean;
    variant?: 'outlined' | 'filled' | 'standard';
    size?: 'small' | 'medium';
    required?: boolean;
    disabled?: boolean;
    multiline?: boolean;
    rows?: number;
    maxRows?: number;
    className?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    InputProps?: {
        startAdornment?: React.ReactNode;
        endAdornment?: React.ReactNode;
    };
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

// Компонент текстового поля, заменяющий MUI TextField
export const TextField: React.FC<TextFieldProps> = ({
    label,
    name,
    id,
    value,
    defaultValue,
    onChange,
    error = false,
    helperText = '',
    placeholder,
    type = 'text',
    fullWidth = false,
    variant = 'outlined',
    size = 'medium',
    required = false,
    disabled = false,
    multiline = false,
    rows = 3,
    maxRows,
    className = '',
    startAdornment,
    endAdornment,
    InputProps,
    inputProps,
    textareaProps,
    onFocus,
    onBlur,
    ...props
}) => {
    const [focused, setFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const finalStartAdornment = startAdornment || InputProps?.startAdornment;
    const finalEndAdornment = endAdornment || InputProps?.endAdornment;
    const elementId = id || name;

    const variantClasses = {
        outlined: {
            container: '',
            input: clsx(
                'rounded-md border transition-colors px-3 py-2 w-full bg-transparent',
                error
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            ),
            label: 'transform origin-top-left transition-all duration-150 ease-out text-sm text-gray-500',
        },
        filled: {
            container: 'group',
            input: clsx(
                'rounded-t-md border-0 border-b-2 px-3 py-2 w-full bg-gray-100 group-hover:bg-gray-200 transition-colors',
                error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            ),
            label: 'transform origin-top-left transition-all duration-150 ease-out text-sm text-gray-500',
        },
        standard: {
            container: '',
            input: clsx(
                'border-0 border-b px-0 py-1 w-full bg-transparent transition-colors',
                error
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
            ),
            label: 'transform origin-top-left transition-all duration-150 ease-out text-sm text-gray-500',
        }
    };

    const sizeClasses = {
        small: 'text-xs',
        medium: 'text-sm',
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFocused(true);
        if (onFocus) onFocus(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFocused(false);
        if (onBlur) onBlur(event);
    };

    const fieldClasses = clsx(
        'relative',
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-60 pointer-events-none' : '',
        className
    );

    const inputClasses = clsx(
        variantClasses[variant].input,
        sizeClasses[size],
        finalStartAdornment ? 'pl-9' : '',
        finalEndAdornment ? 'pr-9' : '',
        disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '',
        'focus:outline-none focus:ring-1'
    );

    const labelClasses = clsx(
        variantClasses[variant].label,
        (focused || value || defaultValue || placeholder)
            ? '-translate-y-4 scale-75'
            : 'translate-y-0',
        error ? 'text-red-500' : (focused ? 'text-blue-500' : ''),
        required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''
    );

    return (
        <div className={fieldClasses}>
            <div className={clsx('relative mb-1', variantClasses[variant].container)}>
                {label && (
                    <label
                        className={clsx(
                            labelClasses,
                            (variant === 'outlined' && (focused || value || defaultValue || placeholder))
                                ? 'absolute -top-2 left-2 px-1 bg-white z-10'
                                : 'absolute top-2 left-3'
                        )}
                        htmlFor={elementId}
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {finalStartAdornment && (
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            {finalStartAdornment}
                        </div>
                    )}

                    {multiline ? (
                        <textarea
                            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                            id={elementId}
                            name={name}
                            value={value}
                            defaultValue={defaultValue}
                            onChange={onChange}
                            placeholder={placeholder}
                            required={required}
                            disabled={disabled}
                            rows={rows}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={inputClasses}
                            {...textareaProps}
                        />
                    ) : (
                        <input
                            ref={inputRef as React.RefObject<HTMLInputElement>}
                            id={elementId}
                            name={name}
                            type={type}
                            value={value}
                            defaultValue={defaultValue}
                            onChange={onChange}
                            placeholder={placeholder}
                            required={required}
                            disabled={disabled}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={inputClasses}
                            {...inputProps}
                            {...props}
                        />
                    )}

                    {finalEndAdornment && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {finalEndAdornment}
                        </div>
                    )}
                </div>
            </div>

            {helperText && (
                <div className={clsx(
                    'text-xs mt-1',
                    error ? 'text-red-600' : 'text-gray-500'
                )}>
                    {helperText}
                </div>
            )}
        </div>
    );
};
