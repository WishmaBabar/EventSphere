import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi, registrationsApi, attendanceApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { LoadingPage } from '../components/Loading'
import ConfirmModal from '../components/ConfirmModal'
import { Calendar, MapPin, Clock, Users, ArrowLeft, Edit, Trash2, UserCheck, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRegistrants, setShowRegistrants] = useState(false)

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(id),
  })

  const { data: myRegistrations } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: registrationsApi.getMy,
    enabled: !isAdmin,
  })

  const { data: registrants } = useQuery({
    queryKey: ['registrants', id],
    queryFn: () => attendanceApi.getAllRegistrants(id),
    enabled: isAdmin && showRegistrants,
  })

  const myReg = myRegistrations?.find(r => String(r.eventId) === String(id) && r.status === 'REGISTERED')

  const registerMutation = useMutation({
    mutationFn: () => registrationsApi.register(id),
    onSuccess: () => {
      toast.success('Successfully registered!')
      queryClient.invalidateQueries(['my-registrations'])
      queryClient.invalidateQueries(['event', id])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed')
  })

  const cancelMutation = useMutation({
    mutationFn: () => registrationsApi.cancel(myReg?.id),
    onSuccess: () => {
      toast.success('Registration cancelled')
      queryClient.invalidateQueries(['my-registrations'])
      queryClient.invalidateQueries(['event', id])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Cancellation failed')
  })

  const deleteMutation = useMutation({
    mutationFn: () => eventsApi.delete(id),
    onSuccess: () => {
      toast.success('Event deleted')
      queryClient.invalidateQueries(['events'])
      navigate('/events')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed')
  })

  const markAttendedMutation = useMutation({
    mutationFn: (regId) => attendanceApi.markAttended(regId),
    onSuccess: () => {
      toast.success('Attendance marked!')
      queryClient.invalidateQueries(['registrants', id])
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to mark attendance')
  })

  if (isLoading) return <LoadingPage message="Loading event..." />
  if (!event) return null

  const fillPct = event.capacity > 0 ? Math.round((event.registeredCount / event.capacity) * 100) : 0
  const formattedDate = event.date ? format(new Date(event.date), 'EEEE, MMMM d, yyyy') : 'TBD'

  const statusChip = (status) => (
    <span className={`status-chip status-${status.toLowerCase()}`}>{status}</span>
  )

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Back button */}
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '24px' }} id="event-detail-back-btn">
          <ArrowLeft size={15} /> Back
        </button>

        {/* Event Hero Card */}
        <div className="event-detail-hero animate-slide-up">
          <div className="event-detail-banner" />
          <div className="event-detail-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">{event.category}</span>
                {!event.available && <span className="badge badge-danger">Fully Booked</span>}
                {event.available && <span className="badge badge-success">Available</span>}
              </div>
              {isAdmin && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/events/${id}/edit`)} id="event-edit-btn">
                    <Edit size={13} /> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setShowDeleteModal(true)} id="event-delete-btn">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}
            </div>

            <h1 className="event-detail-title">{event.title}</h1>

            {/* Meta grid */}
            <div className="event-detail-meta-grid">
              <div className="event-meta-box">
                <div className="event-meta-box-icon" style={{ background: 'rgba(99,102,241,0.12)' }}>
                  <Calendar size={16} color="#818cf8" />
                </div>
                <div>
                  <div className="text-xs text-muted">Date</div>
                  <div className="text-sm font-semibold">{formattedDate}</div>
                </div>
              </div>
              <div className="event-meta-box">
                <div className="event-meta-box-icon" style={{ background: 'rgba(6,182,212,0.12)' }}>
                  <Clock size={16} color="#06b6d4" />
                </div>
                <div>
                  <div className="text-xs text-muted">Time</div>
                  <div className="text-sm font-semibold">{event.time || 'TBD'}</div>
                </div>
              </div>
              <div className="event-meta-box">
                <div className="event-meta-box-icon" style={{ background: 'rgba(245,158,11,0.12)' }}>
                  <MapPin size={16} color="#f59e0b" />
                </div>
                <div>
                  <div className="text-xs text-muted">Location</div>
                  <div className="text-sm font-semibold">{event.location}</div>
                </div>
              </div>
              <div className="event-meta-box">
                <div className="event-meta-box-icon" style={{ background: 'rgba(16,185,129,0.12)' }}>
                  <Users size={16} color="#10b981" />
                </div>
                <div>
                  <div className="text-xs text-muted">Capacity</div>
                  <div className="text-sm font-semibold">{event.registeredCount}/{event.capacity} registered</div>
                </div>
              </div>
            </div>

            {/* Capacity bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="text-xs text-muted">Registration progress</span>
                <span className="text-xs text-muted">{fillPct}% filled</span>
              </div>
              <div className="capacity-bar" style={{ height: '6px' }}>
                <div
                  className={`capacity-fill ${fillPct < 50 ? 'low' : fillPct < 80 ? 'medium' : 'high'}`}
                  style={{ width: `${Math.min(fillPct, 100)}%` }}
                />
              </div>
              {event.available && (
                <div className="text-xs text-emerald" style={{ marginTop: '4px' }}>
                  {event.availableSpots} spot{event.availableSpots !== 1 ? 's' : ''} remaining
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '28px' }}>
              <h3 className="text-base font-semibold" style={{ marginBottom: '10px' }}>About this event</h3>
              <p className="text-sm text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{event.description}</p>
            </div>

            {/* Action buttons */}
            {!isAdmin && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {myReg ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => cancelMutation.mutate()}
                    disabled={cancelMutation.isPending}
                    id="cancel-registration-btn"
                  >
                    {cancelMutation.isPending ? <div className="spinner" style={{ width: 16, height: 16 }} /> : null}
                    Cancel Registration
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => registerMutation.mutate()}
                    disabled={!event.available || registerMutation.isPending}
                    id="register-event-btn"
                  >
                    {registerMutation.isPending ? <div className="spinner" style={{ width: 16, height: 16 }} /> : null}
                    {!event.available ? 'Event Full' : 'Register Now'}
                  </button>
                )}
              </div>
            )}

            {/* Admin: Manage Registrants */}
            {isAdmin && (
              <div>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowRegistrants(v => !v)}
                  id="toggle-registrants-btn"
                >
                  <Users size={15} />
                  {showRegistrants ? 'Hide' : 'Show'} Registrants ({event.registeredCount})
                </button>

                {showRegistrants && registrants && (
                  <div style={{ marginTop: '20px' }}>
                    <h3 className="text-base font-semibold" style={{ marginBottom: '12px' }}>Registrants</h3>
                    {registrants.length === 0 ? (
                      <p className="text-sm text-muted">No registrants yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {registrants.map(reg => (
                          <div key={reg.id} className="card-premium p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-500/30">
                            <div>
                              <div className="font-bold text-sm text-white">{reg.userName || 'Unknown User'}</div>
                              <div className="text-xs text-slate-500 mb-2">{reg.userEmail}</div>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1 w-fit ${
                                reg.status === 'ATTENDED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                                reg.status === 'CANCELLED' ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20' : 
                                'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              }`}>
                                {reg.status === 'ATTENDED' && <CheckCircle className="w-2.5 h-2.5" />}
                                {reg.status === 'CANCELLED' && <XCircle className="w-2.5 h-2.5" />}
                                {reg.status}
                              </span>
                            </div>

                            {reg.status === 'REGISTERED' && (
                              <button
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold transition-all hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-500/10"
                                onClick={() => markAttendedMutation.mutate(reg.id)}
                                disabled={markAttendedMutation.isPending}
                                id={`mark-attended-${reg.id}`}
                              >
                                <UserCheck size={13} /> Mark Attended
                              </button>
                            )}
                            {reg.status === 'ATTENDED' && (
                              <div className="p-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-glow">
                                <CheckCircle size={18} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete confirmation modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => deleteMutation.mutate()}
          title="Delete Event"
          message={`Are you sure you want to delete "${event.title}"? This action cannot be undone and will remove all registrations.`}
          confirmLabel="Delete Event"
          isDanger
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  )
}
