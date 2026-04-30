import { useMemo, useState } from 'react'
import {
  AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie
} from 'recharts'
import { Activity, Calendar, Download, Eye, FileText, TrendingUp, Users, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../api'
import Loading from '../components/Loading'

const CHART_COLORS = ['#6366f1', '#a855f7', '#f43f5e', '#06b6d4', '#ca8a04']

function formatDate(value) {
  if (!value) return 'TBD'
  return new Date(`${value}T00:00:00`).toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function buildReportHtml(report) {
  const eventRows = report.events.map(event => `
    <tr>
      <td>${event.title}</td>
      <td>${formatDate(event.date)}</td>
      <td>${event.category || 'Uncategorized'}</td>
      <td>${event.location || 'TBD'}</td>
      <td>${event.capacity}</td>
      <td>${event.registeredCount}</td>
      <td>${event.availableSpots}</td>
    </tr>
  `).join('')

  return `
    <!doctype html>
    <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
          h1 { margin: 0 0 6px; font-size: 28px; }
          h2 { margin-top: 28px; font-size: 18px; }
          p { color: #4b5563; }
          .meta { margin-bottom: 24px; font-size: 13px; color: #6b7280; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0; }
          .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; }
          .label { font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: 700; }
          .value { font-size: 24px; font-weight: 800; margin-top: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #e5e7eb; padding: 9px; text-align: left; font-size: 12px; }
          th { background: #f9fafb; text-transform: uppercase; font-size: 11px; }
          @media print { button { display: none; } body { margin: 18mm; } }
        </style>
      </head>
      <body>
        <h1>${report.title}</h1>
        <div class="meta">Generated on ${new Date().toLocaleString()}</div>
        <p>${report.description}</p>
        <div class="summary">
          <div class="box"><div class="label">Events</div><div class="value">${report.summary.totalEvents}</div></div>
          <div class="box"><div class="label">Capacity</div><div class="value">${report.summary.totalCapacity}</div></div>
          <div class="box"><div class="label">Registrations</div><div class="value">${report.summary.totalRegistrations}</div></div>
          <div class="box"><div class="label">Fill Rate</div><div class="value">${report.summary.fillRate}%</div></div>
        </div>
        <h2>Event Details</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th><th>Date</th><th>Category</th><th>Location</th><th>Capacity</th><th>Registered</th><th>Available</th>
            </tr>
          </thead>
          <tbody>${eventRows}</tbody>
        </table>
      </body>
    </html>
  `
}

function ReportPreviewModal({ report, onClose }) {
  if (!report) return null

  const handlePrintPdf = () => {
    const win = window.open('', '_blank', 'width=1000,height=800')
    if (!win) return
    win.document.write(buildReportHtml(report))
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 250)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="report-title">
      <div className="report-modal">
        <div className="report-modal-header">
          <div>
            <h2 id="report-title">{report.title}</h2>
            <p>Review this report before exporting it as PDF.</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close report preview">
            <X size={18} />
          </button>
        </div>

        <div className="report-preview">
          <div className="report-preview-title">
            <FileText size={22} />
            <div>
              <h3>{report.title}</h3>
              <span>Generated {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <p className="report-description">{report.description}</p>

          <div className="report-summary-grid">
            <div><span>Events</span><strong>{report.summary.totalEvents}</strong></div>
            <div><span>Capacity</span><strong>{report.summary.totalCapacity}</strong></div>
            <div><span>Registrations</span><strong>{report.summary.totalRegistrations}</strong></div>
            <div><span>Fill Rate</span><strong>{report.summary.fillRate}%</strong></div>
          </div>

          <div className="report-table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Capacity</th>
                  <th>Registered</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {report.events.map(event => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{formatDate(event.date)}</td>
                    <td>{event.category || 'Uncategorized'}</td>
                    <td>{event.capacity}</td>
                    <td>{event.registeredCount}</td>
                    <td>{event.availableSpots}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="report-modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={handlePrintPdf}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [report, setReport] = useState(null)

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events', 'analytics'],
    queryFn: () => api.get('/events', { params: { size: 100, sortBy: 'date', sortDir: 'asc' } })
      .then(res => res.data.data.content)
  })

  const stats = useMemo(() => {
    const totalEvents = events.length
    const totalCapacity = events.reduce((acc, curr) => acc + curr.capacity, 0)
    const totalRegistrations = events.reduce((acc, curr) => acc + curr.registeredCount, 0)
    const averageCapacity = totalEvents ? Math.round(totalCapacity / totalEvents) : 0
    const fillRate = totalCapacity ? Math.round((totalRegistrations / totalCapacity) * 100) : 0

    const categoryData = events.reduce((acc, curr) => {
      const category = curr.category || 'Uncategorized'
      const existing = acc.find(item => item.name === category)
      if (existing) existing.value += curr.registeredCount || 0
      else acc.push({ name: category, value: curr.registeredCount || 0 })
      return acc
    }, [])

    const trendMap = events.reduce((acc, event) => {
      const month = event.date
        ? new Date(`${event.date}T00:00:00`).toLocaleString('en', { month: 'short' })
        : 'TBD'
      acc[month] = (acc[month] || 0) + (event.registeredCount || 0)
      return acc
    }, {})

    const trendData = Object.entries(trendMap).map(([name, value]) => ({ name, value }))

    return { totalEvents, totalCapacity, totalRegistrations, fillRate, averageCapacity, categoryData, trendData }
  }, [events])

  const openSystemReport = () => {
    setReport({
      title: 'EventSphere System Analytics Report',
      description: 'A complete administrative overview of event capacity, registrations, availability, and category demand.',
      summary: stats,
      events,
    })
  }

  const openEventReport = (event) => {
    const fillRate = event.capacity ? Math.round((event.registeredCount / event.capacity) * 100) : 0
    setReport({
      title: `${event.title} Event Report`,
      description: `Individual event report for ${event.title}, including schedule, category, capacity, registrations, and availability.`,
      summary: {
        totalEvents: 1,
        totalCapacity: event.capacity,
        totalRegistrations: event.registeredCount,
        fillRate,
      },
      events: [event],
    })
  }

  if (eventsLoading) return <Loading />

  const pieData = stats.categoryData.length ? stats.categoryData : [{ name: 'No registrations', value: 1 }]

  return (
    <div className="page-wrapper container">
      <div className="page-toolbar">
        <div>
          <h1 className="text-4xl font-heading font-black mb-2">System Analytics</h1>
          <p className="text-slate-400">Operational view of event capacity, registrations, and category demand.</p>
        </div>
        <button className="btn btn-secondary" onClick={openSystemReport} disabled={!events.length}>
          <Eye size={16} /> Preview Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="card-premium">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><Calendar className="w-6 h-6" /></div>
            <span className="metric-chip">Live</span>
          </div>
          <div className="text-3xl font-black mb-1">{stats.totalEvents}</div>
          <div className="text-slate-400 text-sm font-medium">Total Events</div>
        </div>

        <div className="card-premium">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400"><Users className="w-6 h-6" /></div>
            <span className="metric-chip">Seats</span>
          </div>
          <div className="text-3xl font-black mb-1">{stats.totalCapacity}</div>
          <div className="text-slate-400 text-sm font-medium">Global Capacity</div>
        </div>

        <div className="card-premium">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400"><TrendingUp className="w-6 h-6" /></div>
            <span className="metric-chip">{stats.fillRate}%</span>
          </div>
          <div className="text-3xl font-black mb-1">{stats.fillRate}%</div>
          <div className="text-slate-400 text-sm font-medium">Fill Rate</div>
        </div>

        <div className="card-premium">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Activity className="w-6 h-6" /></div>
            <span className="metric-chip">Actual</span>
          </div>
          <div className="text-3xl font-black mb-1">{stats.totalRegistrations}</div>
          <div className="text-slate-400 text-sm font-medium">Total Registrations</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-premium p-8 h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" /> Registration Velocity
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff20', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-premium p-8 h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-400" /> Category Distribution
          </h3>
          <div className="chart-with-legend">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={110} paddingAngle={8} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff20', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {(stats.categoryData.length ? stats.categoryData : [{ name: 'No registrations', value: 0 }]).map((entry, index) => (
                <div key={entry.name} className="chart-legend-item">
                  <span style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                  <strong>{entry.name}</strong>
                  <small>{entry.value} registrations</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="card-premium report-section">
        <div className="report-section-header">
          <div>
            <h2 className="text-xl font-bold">Individual Event Reports</h2>
            <p className="text-slate-400 text-sm">Preview and export a dedicated PDF report for each event.</p>
          </div>
          <FileText className="text-indigo-400" size={24} />
        </div>

        <div className="event-report-list">
          {events.map(event => (
            <div key={event.id} className="event-report-row">
              <div>
                <h3>{event.title}</h3>
                <p>{formatDate(event.date)} · {event.category || 'Uncategorized'} · {event.registeredCount}/{event.capacity} registered</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => openEventReport(event)}>
                <Eye size={14} /> Preview
              </button>
            </div>
          ))}
          {!events.length && <p className="text-slate-400 text-sm">No events are available for reporting.</p>}
        </div>
      </section>

      <ReportPreviewModal report={report} onClose={() => setReport(null)} />
    </div>
  )
}
