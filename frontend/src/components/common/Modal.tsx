import React from 'react';
import { COLORS } from '../../utils/constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  showCloseButton?: boolean;
}

const sizeStyles = {
  small: { maxWidth: '400px' },
  medium: { maxWidth: '600px' },
  large: { maxWidth: '900px' },
  full: { maxWidth: '95%', width: '95%' },
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 400,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: COLORS.background,
          borderRadius: '1rem',
          padding: '2rem',
          ...sizeStyles[size],
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 500,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {(title || showCloseButton) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              alignItems: 'center',
            }}
          >
            {title && (
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '0.25rem',
                  color: COLORS.textPrimary,
                }}
              >
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  width: '2rem',
                  height: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </>
  );
};

