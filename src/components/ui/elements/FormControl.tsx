'use client';

import { clsx } from 'clsx';
import styles from './FormControl.module.scss';

// FormControl
interface FormControlProps {
    children: React.ReactNode;
    fullWidth?: boolean;
    className?: string;
}

export const FormControl: React.FC<FormControlProps> = ({
    children,
    fullWidth = false,
    className = '',
}) => {
    const formControlClasses = clsx(
        styles.formControl,
        fullWidth && styles.fullWidth,
        className
    );

    return (
        <div className={formControlClasses}>
            {children}
        </div>
    );
};

// InputLabel
interface InputLabelProps {
    children: React.ReactNode;
    htmlFor?: string;
    className?: string;
}

export const InputLabel: React.FC<InputLabelProps> = ({ children, htmlFor, className = '' }) => {
    return (
        <label className={clsx(styles.inputLabel, className)} htmlFor={htmlFor}>
            {children}
        </label>
    );
};

// Select
interface SelectProps {
    name?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement> | { target: { name?: string; value: string } }) => void;
    children: React.ReactNode;
    label?: string;
    className?: string;
    error?: boolean;
    fullWidth?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    name,
    value,
    onChange,
    children,
    label,
    className = '',
    error = false,
    fullWidth = false,
    ...props
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e);
    };

    const selectClasses = clsx(
        styles.select,
        error ? styles.selectError : styles.selectNormal,
        fullWidth && styles.fullWidth,
        className
    );

    return (
        <select
            name={name}
            value={value}
            onChange={handleChange}
            className={selectClasses}
            {...props}
        >
            {children}
        </select>
    );
};

// MenuItem
interface MenuItemProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({ value, children, className = '' }) => {
    return (
        <option value={value} className={clsx(styles.menuItem, className)}>
            {children}
        </option>
    );
};

export default FormControl;
