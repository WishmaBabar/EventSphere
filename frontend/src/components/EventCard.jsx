import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import Badge from './ui/Badge'

function getCapacityClass(pct) {
  if (pct < 50) return 'low'
  if (pct < 80) return 'medium'
  return 'high'
}

export default function EventCard({ event }) {
  const navigate = useNavigate()
  const fillPct = event.capacity > 0
    ? Math.round((event.registeredCount / event.capacity) * 100)
    : 0
  const capClass = getCapacityClass(fillPct)
  const availableSpots = Math.max(0, event.capacity - event.registeredCount)

  const handleClick = () => navigate(`/events/${event.id}`)

  const formattedDate = event.date
    ? format(new Date(event.date), 'MMM d')
    : 'TBD'

  const formattedDateFull = event.date
    ? format(new Date(event.date), 'MMM d, yyyy')
    : 'TBD'

  return (
    <div
      className="card-premium group cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      aria-label={`View event: ${event.title}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
      }}
    >
      {/* Header with Badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          marginBottom: 0,
          flex: 1,
          transition: 'color var(--transition-base)',
        }} className="group-hover:text-indigo-400">
          {event.title}
        </h3>
        <Badge variant="primary">
          {event.category}
        </Badge>
      </div>

      {/* Event Details Grid */}
      <div className="event-card-meta" style={{ marginBottom: '1.5rem' }}>
        <div className="event-meta-item">
          <Calendar size={14} style={{ flexShrink: 0 }} />
          <span title={formattedDateFull}>{formattedDate}</span>
        </div>
        <div className="event-meta-item">
          <Clock size={14} style={{ flexShrink: 0 }} />
          <span>{event.time || 'TBD'}</span>
        </div>
        <div className="event-meta-item">
          <MapPin size={14} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={event.location}>
            {event.location}
          </span>
        </div>
      </div>

      {/* Capacity Info and Progress Bar */}
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
          }}>
            <Users size={14} />
            <span>{event.registeredCount}/{event.capacity}</span>
          </div>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
          }}>
            {availableSpots > 0 ? `${availableSpots} spot${availableSpots !== 1 ? 's' : ''} left` : 'Full'}
          </span>
        </div>

        <div className="capacity-bar">
          <div
            className={`capacity-fill ${capClass}`}
            style={{ width: `${Math.min(fillPct, 100)}%` }}
          />
        </div>

        {/* CTA Button */}
        <button
          onClick={handleClick}
          style={{
            width: '100%',
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-accent-primary-light)',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'var(--transition-base)',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(99, 102, 241, 0.2)'
            e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(99, 102, 241, 0.1)'
            e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)'
          }}
        >
          View Event
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
