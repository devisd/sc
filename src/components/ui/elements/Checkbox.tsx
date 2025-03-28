'use client';

import React from 'react';
import { clsx } from 'clsx';
import styles from './Checkbox.module.scss';

interface CheckboxProps {
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    value?: string;
    label?: string;
    className?: string;
    disabled?: boolean;
    color?: 'primary' | 'secondary' | 'error';
    indeterminate?: boolean;
    size?: 'small' | 'medium';
    required?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    checked = false,
    onChange,
    name,
    value,
    label,
    className = '',
    disabled = false,
    color = 'primary',
    indeterminate = false,
    size = 'medium',
    required = false,
    ...props
}) => {
    const id = React.useId();

    const checkboxClasses = clsx(
        styles.checkbox,
        styles[color],
        styles[size],
        disabled ? styles.disabled : styles.enabled,
        className
    );

    const labelClasses = clsx(
        styles.label,
        disabled ? styles.disabled : styles.enabled
    );

    React.useEffect(() => {
        const element = document.getElementById(id) as HTMLInputElement;
        if (element) {
            element.indeterminate = indeterminate;
        }
    }, [id, indeterminate]);

    return (
        <label className={labelClasses}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                name={name}
                value={value}
                disabled={disabled}
                required={required}
                className={checkboxClasses}
                {...props}
            />
            {label && <span className={styles.labelText}>{label}</span>}
        </label>
    );
};

interface FormControlLabelProps {
    control: React.ReactElement;
    label: string;
    labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
    disabled?: boolean;
    className?: string;
}

export const FormControlLabel: React.FC<FormControlLabelProps> = ({
    control,
    label,
    labelPlacement = 'end',
    disabled = false,
    className = '',
}) => {
    const formControlLabelClasses = clsx(
        styles.formControlLabel,
        styles[`placement${labelPlacement.charAt(0).toUpperCase() + labelPlacement.slice(1)}`],
        disabled ? styles.disabled : styles.enabled,
        className
    );

    return (
        <label className={formControlLabelClasses}>
            {['start', 'top'].includes(labelPlacement) && (
                <span className={styles.labelText}>{label}</span>
            )}
            {React.cloneElement(control, { disabled })}
            {['end', 'bottom'].includes(labelPlacement) && (
                <span className={styles.labelText}>{label}</span>
            )}
        </label>
    );
};
