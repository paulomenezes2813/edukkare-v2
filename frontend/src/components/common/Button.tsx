import React from 'react';
import { COLORS } from '../../utils/constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantStyles = {
  primary: {
    background: COLORS.primary,
    color: 'white',
    hover: COLORS.primaryHover,
  },
  secondary: {
    background: COLORS.secondary,
    color: 'white',
    hover: COLORS.secondaryHover,
  },
  success: {
    background: COLORS.success,
    color: 'white',
    hover: '#059669',
  },
  warning: {
    background: COLORS.warning,
    color: 'white',
    hover: '#d97706',
  },
  error: {
    background: COLORS.error,
    color: 'white',
    hover: '#dc2626',
  },
  info: {
    background: COLORS.info,
    color: 'white',
    hover: '#2563eb',
  },
};

const sizeStyles = {
  small: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
  medium: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
  large: { padding: '1rem 2rem', fontSize: '1.125rem' },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled,
  style,
  ...props
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={{
        ...sizeStyle,
        background: variantStyle.background,
        color: variantStyle.color,
        border: 'none',
        borderRadius: '0.5rem',
        fontWeight: '600',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.2s',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.background = variantStyle.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.background = variantStyle.background;
        }
      }}
    >
      {isLoading ? '⏳ Carregando...' : children}
    </button>
  );
};

