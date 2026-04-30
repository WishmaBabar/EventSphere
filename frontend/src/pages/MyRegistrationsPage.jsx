import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { registrationsApi } from '../api'
import { useNavigate } from 'react-router-dom'
import { LoadingPage } from '../components/Loading'
import ConfirmModal from '../components/ConfirmModal'
import { Calendar, MapPin, Clock, ArrowRight, Ticket } from 'lucide-react'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function MyRegistrationsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [cancelTarget, setCancelTarget] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: registrationsApi.getMy,
  })

  const cancelMutation = useMutation({
    mutationFn: (id) => registrationsApi.cancel(id),
    onSuccess: () => {
      toast.success('Registration cancelled')
      queryClient.invalidateQueries(['my-registrations'])
      setCancelTarget(null)
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Cancellation failed')
      setCancelTarget(null)
    }
  })

  if (isLoading) return <LoadingPage message="Loading registrations" />

  const filtered = activeTab === 'all'
    ? registrations
    : registrations.filter(r => r.status.toLowerCase() === activeTab)

  const counts = {
    all: registrations.length,
    registered: registrations.filter(r => r.status === 'REGISTERED').length,
    attended: registrations.filter(r => r.status === 'ATTENDED').length,
    cancelled: registrations.filter(r => r.status === 'CANCELLED').length,
  }

  const statusChip = (status) => (
    <span className={`status-chip status-${status.toLowerCase()}`}>{status}</span>
  )

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Registrations</h1>
          <p className="page-subtitle">Track and manage all your event registrations</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--color-bg-card)', padding: '4px', borderRadius: 'var(--radius-lg)', width: 'fit-content', border: '1px solid var(--color-border)' }}>
          {[
            { key: 'all', label: 'All', count: counts.all },
            { key: 'registered', label: 'Registered', count: counts.registered },
            { key: 'attended', label: 'Attended', count: counts.attended },
            { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn btn-sm${activeTab === tab.key ? ' btn-primary' : ' btn-ghost'}`}
              style={{ borderRadius: 'var(--radius-md)' }}
              id={`tab-${tab.key}`}
            >
              {tab.label}
              <span style={{
                background: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius-full)',
                padding: '1px 7px',
                fontSize: '11px',
                marginLeft: '2px',
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Ticket size={44} /></div>
            <h3>No {activeTab !== 'all' ? activeTab : ''} registrations</h3>
            <p>
              {activeTab === 'all'
                ? "You haven't registered for any events yet."
                : `You have no ${activeTab} registrations.`}
            </p>
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/events')}>
              <Ticket size={15} /> Browse Events
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(reg => (
              <div key={reg.id} className="card animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '20px 24px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <h3 className="text-base font-semibold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {reg.eventTitle || reg.eventId}
                    </h3>
                    {statusChip(reg.status)}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {reg.eventDate && (
                      <span className="event-meta-item">
                        <Calendar size={12} />
                        <span>{reg.eventDate}</span>
                      </span>
                    )}
                    {reg.eventTime && (
                      <span className="event-meta-item">
                        <Clock size={12} />
                        <span>{reg.eventTime}</span>
                      </span>
                    )}
                    {reg.eventLocation && (
                      <span className="event-meta-item">
                        <MapPin size={12} />
                        <span>{reg.eventLocation}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => navigate(`/events/${reg.eventId}`)}
                    id={`view-event-${reg.id}`}
                  >
                    View <ArrowRight size={13} />
                  </button>
                  {reg.status === 'REGISTERED' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setCancelTarget(reg)}
                      id={`cancel-reg-${reg.id}`}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => cancelMutation.mutate(cancelTarget?.id)}
        title="Cancel Registration"
        message={`Are you sure you want to cancel your registration for "${cancelTarget?.eventTitle || cancelTarget?.eventId}"?`}
        confirmLabel="Yes, Cancel"
        isDanger
        isLoading={cancelMutation.isPending}
      />
    </div>
  )
}
