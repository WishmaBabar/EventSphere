import React, { forwardRef } from 'react'

const FormInput = forwardRef(({
  label,
  error,
  icon: Icon,
  placeholder,
  type = 'text',
  required = false,
  hint,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span style={{ color: 'var(--accent-tertiary)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={15}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
            }}
          />
        )}
        <input
          ref={ref}
          type={type}
          className={`form-input ${error ? 'error' : ''} ${Icon ? 'pl-9' : ''} ${className}`}
          placeholder={placeholder}
          style={{
            paddingLeft: Icon ? '36px' : '1rem',
          }}
          {...props}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', display: 'block' }}>{hint}</span>}
    </div>
  )
})

FormInput.displayName = 'FormInput'

export default FormInput
