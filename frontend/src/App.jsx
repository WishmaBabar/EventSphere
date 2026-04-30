import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import EventsPage from './pages/EventsPage'
import EventDetailPage from './pages/EventDetailPage'
import CreateEventPage from './pages/CreateEventPage'
import EditEventPage from './pages/EditEventPage'
import MyRegistrationsPage from './pages/MyRegistrationsPage'
import LandingPage from './pages/LandingPage'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import QRCheckIn from './pages/QRCheckIn'
import AdminApprovalPage from './pages/AdminApprovalPage'




function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/dashboard" replace />
  return children
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><EventDetailPage /></ProtectedRoute>} />
        <Route path="/events/create" element={<ProtectedRoute requiredRole="ADMIN"><CreateEventPage /></ProtectedRoute>} />
        <Route path="/events/:id/edit" element={<ProtectedRoute requiredRole="ADMIN"><EditEventPage /></ProtectedRoute>} />
        <Route path="/my-registrations" element={<ProtectedRoute><MyRegistrationsPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute requiredRole="ADMIN"><AnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/check-in" element={<ProtectedRoute requiredRole="ADMIN"><QRCheckIn /></ProtectedRoute>} />
        <Route path="/approvals" element={<ProtectedRoute requiredRole="ADMIN"><AdminApprovalPage /></ProtectedRoute>} />



        {/* Redirects */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </>
  )
}
