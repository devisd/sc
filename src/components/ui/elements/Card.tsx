'use client';

import clsx from 'clsx';
import React from 'react';
import styles from './Card.module.scss';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    raised?: boolean;
    variant?: 'outlined' | 'elevation';
    square?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    raised = false,
    variant = 'elevation',
    square = false,
    onClick,
    ...props
}) => {
    const cardClasses = clsx(
        styles.card,
        styles[variant],
        raised && variant !== 'outlined' && styles.raised,
        !square && styles.rounded,
        onClick && styles.clickable,
        className
    );

    return (
        <div className={cardClasses} onClick={onClick} {...props}>
            {children}
        </div>
    );
};

interface CardHeaderProps {
    title: React.ReactNode;
    subheader?: React.ReactNode;
    avatar?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    subheader,
    avatar,
    action,
    className = '',
    ...props
}) => {
    return (
        <div className={clsx(styles.header, className)} {...props}>
            {avatar && <div className={styles.headerAvatar}>{avatar}</div>}
            <div className={styles.headerContent}>
                <div className={styles.headerTitle}>{title}</div>
                {subheader && <div className={styles.headerSubheader}>{subheader}</div>}
            </div>
            {action && <div className={styles.headerAction}>{action}</div>}
        </div>
    );
};

interface CardMediaProps {
    component?: 'img' | 'video' | 'iframe';
    image?: string;
    alt?: string;
    src?: string;
    height?: string | number;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export const CardMedia: React.FC<CardMediaProps> = ({
    component = 'img',
    image,
    alt = '',
    src,
    height,
    className = '',
    style = {},
    children,
    ...props
}) => {
    const finalSrc = src || image;
    const mediaStyle = {
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        ...style
    };

    const mediaClasses = clsx(styles.media, className);

    if (component === 'img') {
        return (
            <img
                src={finalSrc}
                alt={alt}
                className={mediaClasses}
                style={mediaStyle}
                {...props}
            />
        );
    } else if (component === 'video') {
        return (
            <video
                src={finalSrc}
                className={mediaClasses}
                style={mediaStyle}
                controls
                {...props}
            >
                {children}
            </video>
        );
    } else if (component === 'iframe') {
        return (
            <iframe
                src={finalSrc}
                className={mediaClasses}
                style={mediaStyle}
                frameBorder="0"
                allowFullScreen
                {...props}
            >
                {children}
            </iframe>
        );
    }

    return null;
};

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
    children,
    className = '',
    ...props
}) => {
    return (
        <div className={clsx(styles.content, className)} {...props}>
            {children}
        </div>
    );
};

interface CardActionsProps {
    children: React.ReactNode;
    className?: string;
    disableSpacing?: boolean;
}

export const CardActions: React.FC<CardActionsProps> = ({
    children,
    className = '',
    disableSpacing = false,
    ...props
}) => {
    return (
        <div
            className={clsx(
                styles.actions,
                !disableSpacing && styles.actionsSpaced,
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

// Дополнительные компоненты, которые могут понадобиться
interface CardActionAreaProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const CardActionArea: React.FC<CardActionAreaProps> = ({
    children,
    className = '',
    onClick,
    ...props
}) => {
    return (
        <div
            className={clsx(
                styles.actionArea,
                className
            )}
            onClick={onClick}
            tabIndex={0}
            role="button"
            {...props}
        >
            {children}
        </div>
    );
};
