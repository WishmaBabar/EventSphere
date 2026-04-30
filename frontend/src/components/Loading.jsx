export function Spinner({ size = 'md', className = '' }) {
  const cls = size === 'lg' ? 'spinner spinner-lg' : 'spinner'
  return <div className={`${cls} ${className}`} role="status" aria-label="Loading" />
}

export function LoadingPage({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <Spinner size="lg" />
      <span className="text-sm text-secondary">{message}</span>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div className="skeleton" style={{ height: '16px', width: '60px', marginBottom: '12px' }} />
      <div className="skeleton" style={{ height: '22px', width: '80%', marginBottom: '8px' }} />
      <div className="skeleton" style={{ height: '16px', width: '55%', marginBottom: '6px' }} />
      <div className="skeleton" style={{ height: '16px', width: '45%', marginBottom: '20px' }} />
      <div className="skeleton" style={{ height: '4px', width: '100%' }} />
    </div>
  )
}

export default LoadingPage

