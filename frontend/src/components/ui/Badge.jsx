import React from 'react'

const badgeVariants = {
  primary: 'badge-primary',
  success: 'badge-success',
  danger: 'badge-danger',
  warning: 'badge-warning',
  info: 'badge-info',
}

export default function Badge({
  children,
  variant = 'primary',
  className = '',
}) {
  const variantClass = badgeVariants[variant] || 'badge-primary'
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  )
}
