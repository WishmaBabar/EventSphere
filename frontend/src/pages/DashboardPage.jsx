import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { eventsApi, registrationsApi } from '../api'
import EventCard from '../components/EventCard'
import { LoadingPage, SkeletonCard } from '../components/Loading'
import { Calendar, Ticket, Users, TrendingUp, Plus, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

function StatCard({ icon: Icon, value, label, color, glowColor }) {
  return (
    <div className="stat-card">
      <div className="stat-card-glow" style={{ background: glowColor }} />
      <div className="stat-icon" style={{ background: `${color}20`, color }}>
        <Icon size={20} />
      </div>
      <div className="stat-value gradient-text">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', 'dashboard'],
    queryFn: () => eventsApi.getAll({ size: 6, sortBy: 'date', sortDir: 'asc' }),
  })

  const { data: myRegistrations, isLoading: regsLoading } = useQuery({
    queryKey: ['my-registrations'],
    queryFn: registrationsApi.getMy,
    enabled: !isAdmin,
  })

  const events = eventsData?.content || []
  const totalEvents = eventsData?.totalElements || 0
  const availableEvents = events.filter(e => e.available).length
  const activeRegs = myRegistrations?.filter(r => r.status === 'REGISTERED').length || 0
  const attendedCount = myRegistrations?.filter(r => r.status === 'ATTENDED').length || 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Welcome header */}
        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 className="page-title">
                {greeting},{' '}
                <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
                <Sparkles size={28} style={{ marginLeft: '10px', verticalAlign: '-3px', color: 'var(--color-accent-primary-light)' }} />
              </h1>
              <p className="page-subtitle">
                {isAdmin
                  ? 'Manage events, track registrations, and monitor attendance.'
                  : 'Discover events and manage your registrations.'}
              </p>
            </div>
            {isAdmin && (
              <button className="btn btn-primary" onClick={() => navigate('/events/create')} id="dashboard-create-event-btn">
                <Plus size={16} /> Create Event
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard icon={Calendar} value={totalEvents} label="Total Events" color="#6366f1" glowColor="rgba(99,102,241,0.3)" />
          <StatCard icon={TrendingUp} value={availableEvents} label="Available Events" color="#10b981" glowColor="rgba(16,185,129,0.3)" />
          {isAdmin ? (
            <>
              <StatCard icon={Users} value={events.reduce((a, e) => a + e.registeredCount, 0)} label="Total Registrations" color="#06b6d4" glowColor="rgba(6,182,212,0.3)" />
              <StatCard icon={CheckCircle} value={events.filter(e => !e.available).length} label="Sold Out Events" color="#f43f5e" glowColor="rgba(244,63,94,0.3)" />
            </>
          ) : (
            <>
              <StatCard icon={Ticket} value={activeRegs} label="My Registrations" color="#06b6d4" glowColor="rgba(6,182,212,0.3)" />
              <StatCard icon={CheckCircle} value={attendedCount} label="Events Attended" color="#10b981" glowColor="rgba(16,185,129,0.3)" />
            </>
          )}
        </div>

        {/* Recent / Upcoming Events */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/events')} id="dashboard-view-all-btn">
            View all <ArrowRight size={14} />
          </button>
        </div>

        {eventsLoading ? (
          <div className="events-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Calendar size={44} /></div>
            <h3>No events yet</h3>
            <p>{isAdmin ? 'Create your first event to get started.' : 'Check back soon for upcoming events.'}</p>
            {isAdmin && (
              <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/events/create')}>
                <Plus size={16} /> Create Event
              </button>
            )}
          </div>
        ) : (
          <div className="events-grid">
            {events.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>
    </div>
  )
}
