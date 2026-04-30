import React from 'react'

const buttonVariants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
}

const buttonSizes = {
  sm: 'btn-sm',
  md: 'btn',
  lg: 'btn-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  loading = false,
  icon: Icon,
  className = '',
  ...props
}) {
  const baseClass = buttonSizes[size] || 'btn'
  const variantClass = buttonVariants[variant] || 'btn-primary'

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <div className="spinner" style={{ width: 16, height: 16 }} />}
      {Icon && !loading && <Icon size={18} />}
      {children}
    </button>
  )
}
