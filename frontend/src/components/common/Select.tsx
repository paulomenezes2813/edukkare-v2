import React from 'react';
import { COLORS } from '../../utils/constants';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
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
      <select
        {...props}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: `2px solid ${error ? COLORS.error : COLORS.border}`,
          borderRadius: '0.5rem',
          fontSize: '1rem',
          color: COLORS.textPrimary,
          background: COLORS.background,
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          ...style,
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

