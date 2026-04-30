import React, { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  required = false,
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
        <select
          ref={ref}
          className={`form-input form-select ${error ? 'error' : ''} ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
