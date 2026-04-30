import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '../api'
import EventCard from '../components/EventCard'
import Pagination from '../components/Pagination'
import { SkeletonCard } from '../components/Loading'
import { Plus, Search, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['Technology', 'Music', 'Sports', 'Art', 'Business', 'Education', 'Health', 'Food', 'Networking', 'Other']

export default function EventsPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [available, setAvailable] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('asc')

  const queryParams = {
    page, size: 9, search: search || undefined,
    category: category || undefined,
    date: date || undefined,
    available: available || undefined,
    sortBy, sortDir
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['events', queryParams],
    queryFn: () => eventsApi.getAll(queryParams),
    keepPreviousData: true,
  })

  const events = data?.content || []
  const totalPages = data?.totalPages || 0

  const clearFilters = () => {
    setSearch(''); setCategory(''); setDate(''); setAvailable(false)
    setSortBy('date'); setSortDir('asc'); setPage(0)
  }

  const hasFilters = search || category || date || available

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 className="page-title">Events</h1>
            <p className="page-subtitle">
              {data ? `${data.totalElements} event${data.totalElements !== 1 ? 's' : ''} found` : 'Explore all events'}
            </p>
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => navigate('/events/create')} id="events-create-btn">
              <Plus size={16} /> Create Event
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={15} />
            <input
              type="text"
              className="form-input"
              placeholder="Search events"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              id="events-search"
            />
          </div>

          <select
            className="form-input form-select"
            style={{ width: '160px' }}
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(0) }}
            id="events-category-filter"
          >
            <option value="">All categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            type="date"
            className="form-input"
            style={{ width: '160px' }}
            value={date}
            onChange={e => { setDate(e.target.value); setPage(0) }}
            id="events-date-filter"
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <input
              type="checkbox"
              checked={available}
              onChange={e => { setAvailable(e.target.checked); setPage(0) }}
              id="events-available-filter"
              style={{ accentColor: 'var(--color-accent-primary)', width: '16px', height: '16px' }}
            />
            Available only
          </label>

          <select
            className="form-input form-select"
            style={{ width: '140px' }}
            value={`${sortBy}-${sortDir}`}
            onChange={e => { const [by, dir] = e.target.value.split('-'); setSortBy(by); setSortDir(dir); setPage(0) }}
            id="events-sort"
          >
            <option value="date-asc">Date: Soonest</option>
            <option value="date-desc">Date: Latest</option>
            <option value="title-asc">Title: A-Z</option>
            <option value="title-desc">Title: Z-A</option>
          </select>

          {hasFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters} id="events-clear-filters">
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Events grid */}
        {isLoading || isFetching ? (
          <div className="events-grid">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Search size={44} /></div>
            <h3>No events found</h3>
            <p>Try adjusting your search or filters.</p>
            {hasFilters && (
              <button className="btn btn-ghost" style={{ marginTop: '12px' }} onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="events-grid">
              {events.map(event => <EventCard key={event.id} event={event} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  )
}
