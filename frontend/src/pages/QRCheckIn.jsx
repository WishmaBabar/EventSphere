import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Calendar, CheckCircle2, Clock, MapPin, QrCode, Search, Ticket, UserCheck, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { attendanceApi, eventsApi } from '../api'
import Loading from '../components/Loading'

export default function QRCheckIn() {
  const queryClient = useQueryClient()
  const [selectedEventId, setSelectedEventId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', 'attendance'],
    queryFn: () => eventsApi.getAll({ size: 100, sortBy: 'date', sortDir: 'asc' }),
  })

  const events = eventsData?.content || []
  const activeEventId = selectedEventId || events[0]?.id
  const selectedEvent = events.find(event => String(event.id) === String(activeEventId))

  const { data: registrants = [], isLoading: registrantsLoading } = useQuery({
    queryKey: ['attendance-registrants', activeEventId],
    queryFn: () => attendanceApi.getAllRegistrants(activeEventId),
    enabled: !!activeEventId,
  })

  const checkInMutation = useMutation({
    mutationFn: attendanceApi.markAttended,
    onSuccess: () => {
      toast.success('Attendance marked successfully')
      queryClient.invalidateQueries({ queryKey: ['attendance-registrants', activeEventId] })
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Attendance update failed'),
  })

  const filteredRegistrants = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return registrants
    return registrants.filter(reg =>
      `${reg.userName || ''} ${reg.userEmail || ''} ${reg.id}`.toLowerCase().includes(term)
    )
  }, [registrants, searchTerm])

  const attendedCount = registrants.filter(reg => reg.status === 'ATTENDED').length

  if (eventsLoading) return <Loading />

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 className="page-title">Attendance Check-In</h1>
            <p className="page-subtitle">Validate registrations and mark participants as attended.</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              className="form-input form-select"
              style={{ minWidth: '260px' }}
              value={activeEventId || ''}
              onChange={event => setSelectedEventId(event.target.value)}
              aria-label="Select event"
            >
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
          </div>
        </div>

        {!activeEventId ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Calendar size={44} /></div>
            <h3>No events available</h3>
            <p>Create an event before managing attendance.</p>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                  <Ticket size={20} />
                </div>
                <div className="stat-value">{registrants.length}</div>
                <div className="stat-label">Registrants</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                  <UserCheck size={20} />
                </div>
                <div className="stat-value">{attendedCount}</div>
                <div className="stat-label">Attended</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }}>
                  <Users size={20} />
                </div>
                <div className="stat-value">{Math.max(0, registrants.length - attendedCount)}</div>
                <div className="stat-label">Pending Check-In</div>
              </div>
            </div>

            <div className="filter-bar">
              <div className="search-input-wrapper">
                <Search size={15} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name, email, or ticket ID"
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />
              </div>
              {selectedEvent && (
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  <span className="event-meta-item"><Calendar size={14} /> {selectedEvent.date}</span>
                  <span className="event-meta-item"><Clock size={14} /> {selectedEvent.time}</span>
                  <span className="event-meta-item"><MapPin size={14} /> {selectedEvent.location}</span>
                </div>
              )}
            </div>

            {registrantsLoading ? (
              <Loading />
            ) : filteredRegistrants.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><QrCode size={44} /></div>
                <h3>No registrants found</h3>
                <p>{searchTerm ? 'No registration matches your search.' : 'This event has no registrations yet.'}</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredRegistrants.map(reg => (
                  <div key={reg.id} className="card animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                      <div className="stat-icon" style={{ marginBottom: 0, background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                        <QrCode size={20} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h3 className="text-base font-semibold">{reg.userName || 'Registered user'}</h3>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{reg.userEmail || `Ticket #${reg.id}`}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span className={`status-chip status-${reg.status.toLowerCase()}`}>{reg.status}</span>
                      {reg.status === 'ATTENDED' ? (
                        <span className="btn btn-ghost btn-sm" aria-label="Already attended">
                          <CheckCircle2 size={14} /> Checked In
                        </span>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => checkInMutation.mutate(reg.id)}
                          disabled={checkInMutation.isPending}
                        >
                          <UserCheck size={14} /> Mark Attended
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
