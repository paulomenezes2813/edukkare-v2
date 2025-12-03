import React from 'react';
import { COLORS } from '../../utils/constants';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  style,
  ...props
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: COLORS.textSecondary,
          }}
        >
          {label}
          {props.required && <span style={{ color: COLORS.error }}> *</span>}
        </label>
      )}
      <input
        {...props}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: `2px solid ${error ? COLORS.error : COLORS.border}`,
          borderRadius: '0.5rem',
          fontSize: '1rem',
          color: COLORS.textPrimary,
          background: COLORS.background,
          ...style,
        }}
      />
      {error && (
        <p style={{ fontSize: '0.75rem', color: COLORS.error, marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p style={{ fontSize: '0.75rem', color: COLORS.textTertiary, marginTop: '0.25rem' }}>
          {helperText}
        </p>
      )}
    </div>
  );
};

