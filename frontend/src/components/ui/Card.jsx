import React from 'react'

export default function Card({
  children,
  className = '',
  hover = true,
  shadow = true,
}) {
  const classes = [
    'card-premium',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 pb-4 border-b border-color-border ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-semibold text-color-text-primary ${className}`}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-color-text-secondary mt-1 ${className}`}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`flex gap-3 pt-4 mt-4 border-t border-color-border ${className}`}>
      {children}
    </div>
  )
}
