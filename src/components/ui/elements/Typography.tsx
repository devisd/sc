'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Typography.module.scss';

type TypographyVariant =
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'button'
    | 'overline';

type TypographyAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify';
type TypographyColor = 'initial' | 'inherit' | 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error';
type TypographyDisplay = 'initial' | 'displayBlock' | 'displayInline';
type TypographyFontWeight = 'light' | 'regular' | 'medium' | 'bold';

type TypographyComponent = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

interface TypographyProps {
    children: React.ReactNode;
    variant?: TypographyVariant;
    component?: TypographyComponent;
    align?: TypographyAlign;
    color?: TypographyColor;
    display?: TypographyDisplay;
    gutterBottom?: boolean;
    noWrap?: boolean;
    paragraph?: boolean;
    fontWeight?: TypographyFontWeight;
    className?: string;
    style?: React.CSSProperties;
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body1',
    component,
    align = 'inherit',
    color = 'initial',
    display = 'initial',
    gutterBottom = false,
    noWrap = false,
    paragraph = false,
    fontWeight,
    className = '',
    style = {},
    ...props
}) => {
    // Generate font weight class
    const fontWeightClass = fontWeight ? styles[`font${fontWeight.charAt(0).toUpperCase() + fontWeight.slice(1)}`] : '';

    // Combine all classes
    const typographyClasses = clsx(
        styles[variant],
        align !== 'inherit' && styles[align],
        color !== 'initial' && styles[color],
        display !== 'initial' && styles[display],
        fontWeightClass,
        gutterBottom && styles.gutterBottom,
        noWrap && styles.noWrap,
        paragraph && styles.paragraph,
        className
    );

    // Determine which component to render based on props
    const actualComponent = component ||
        (variant === 'h1' ? 'h1' :
            variant === 'h2' ? 'h2' :
                variant === 'h3' ? 'h3' :
                    variant === 'h4' ? 'h4' :
                        variant === 'h5' ? 'h5' :
                            variant === 'h6' ? 'h6' :
                                paragraph ? 'p' : 'span');

    // Conditional rendering based on component type
    switch (actualComponent) {
        case 'h1':
            return <h1 className={typographyClasses} style={style} {...props}>{children}</h1>;
        case 'h2':
            return <h2 className={typographyClasses} style={style} {...props}>{children}</h2>;
        case 'h3':
            return <h3 className={typographyClasses} style={style} {...props}>{children}</h3>;
        case 'h4':
            return <h4 className={typographyClasses} style={style} {...props}>{children}</h4>;
        case 'h5':
            return <h5 className={typographyClasses} style={style} {...props}>{children}</h5>;
        case 'h6':
            return <h6 className={typographyClasses} style={style} {...props}>{children}</h6>;
        case 'p':
            return <p className={typographyClasses} style={style} {...props}>{children}</p>;
        case 'div':
            return <div className={typographyClasses} style={style} {...props}>{children}</div>;
        default:
            return <span className={typographyClasses} style={style} {...props}>{children}</span>;
    }
};
