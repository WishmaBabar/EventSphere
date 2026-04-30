import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor: attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle expired authenticated sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('ems_token')
      localStorage.removeItem('ems_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// Auth API
// ============================================
export const authApi = {
  register: (data) => api.post('/auth/register', data).then(r => r.data.data),
  login: (data) => api.post('/auth/login', data).then(r => r.data.data),
}

// ============================================
// Events API
// ============================================
export const eventsApi = {
  getAll: (params) => api.get('/events', { params }).then(r => r.data.data),
  getById: (id) => api.get(`/events/${id}`).then(r => r.data.data),
  create: (data) => api.post('/events', data).then(r => r.data.data),
  update: (id, data) => api.put(`/events/${id}`, data).then(r => r.data.data),
  delete: (id) => api.delete(`/events/${id}`).then(r => r.data),
}

// ============================================
// Registrations API
// ============================================
export const registrationsApi = {
  register: (eventId) => api.post('/registrations', { eventId: Number(eventId) }).then(r => r.data.data),
  getMy: () => api.get('/registrations/my').then(r => r.data.data),
  cancel: (id) => api.delete(`/registrations/${id}`).then(r => r.data),
}

// ============================================
// Attendance API (Admin)
// ============================================
export const attendanceApi = {
  markAttended: (registrationId) =>
    api.put(`/attendance/${registrationId}`).then(r => r.data.data),
  getAttendees: (eventId) =>
    api.get(`/attendance/event/${eventId}/attendees`).then(r => r.data.data),
  getAllRegistrants: (eventId) =>
    api.get(`/attendance/event/${eventId}/registrants`).then(r => r.data.data),
}

// ============================================
// Users API
// ============================================
export const usersApi = {
  getMe: () => api.get('/users/me').then(r => r.data.data),
  getAll: () => api.get('/users').then(r => r.data.data),
}

// ============================================
// Admin Management API
// ============================================
export const adminApi = {
  getPendingUsers: () => api.get('/admin/users/pending').then(r => r.data.data),
  approveUser: (id) => api.put(`/admin/users/${id}/approve`).then(r => r.data),
  rejectUser: (id) => api.put(`/admin/users/${id}/reject`).then(r => r.data),
  getAllUsers: () => api.get('/admin/users').then(r => r.data.data),
}

export default api
