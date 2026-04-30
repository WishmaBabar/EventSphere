import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '../api'
import { ArrowLeft, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Technology', 'Music', 'Sports', 'Art', 'Business', 'Education', 'Health', 'Food', 'Networking', 'Other']

export default function CreateEventPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const today = new Date().toISOString().split('T')[0]

  const mutation = useMutation({
    mutationFn: eventsApi.create,
    onSuccess: (data) => {
      toast.success('Event created successfully!')
      queryClient.invalidateQueries(['events'])
      navigate(`/events/${data.id}`)
    },
    onError: (err) => {
      const errData = err.response?.data
      if (errData?.data && typeof errData.data === 'object') {
        Object.values(errData.data).forEach(msg => toast.error(msg))
      } else {
        toast.error(errData?.message || 'Failed to create event')
      }
    }
  })

  const onSubmit = (data) => mutation.mutate({ ...data, capacity: parseInt(data.capacity) })

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '720px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '24px' }} id="create-event-back-btn">
          <ArrowLeft size={15} /> Back
        </button>

        <div className="card animate-slide-up" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div className="navbar-logo-icon">
              <Calendar size={18} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Create Event</h1>
              <p className="text-sm text-secondary">Fill in the details for your new event</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="create-title">Event Title *</label>
              <input id="create-title" type="text" className={`form-input${errors.title ? ' error' : ''}`}
                placeholder="e.g. Tech Conference 2025"
                {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' } })} />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="create-description">Description *</label>
              <textarea id="create-description" className={`form-input form-textarea${errors.description ? ' error' : ''}`}
                placeholder="Describe your event in detail..."
                rows={4}
                {...register('description', { required: 'Description is required' })} />
              {errors.description && <span className="form-error">{errors.description.message}</span>}
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label className="form-label" htmlFor="create-date">Date *</label>
                <input id="create-date" type="date" className={`form-input${errors.date ? ' error' : ''}`}
                  min={today}
                  {...register('date', { required: 'Date is required' })} />
                {errors.date && <span className="form-error">{errors.date.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="create-time">Time *</label>
                <input id="create-time" type="time" className={`form-input${errors.time ? ' error' : ''}`}
                  {...register('time', { required: 'Time is required' })} />
                {errors.time && <span className="form-error">{errors.time.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="create-location">Location *</label>
              <input id="create-location" type="text" className={`form-input${errors.location ? ' error' : ''}`}
                placeholder="e.g. Convention Center, New York"
                {...register('location', { required: 'Location is required' })} />
              {errors.location && <span className="form-error">{errors.location.message}</span>}
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label className="form-label" htmlFor="create-category">Category *</label>
                <select id="create-category" className={`form-input form-select${errors.category ? ' error' : ''}`}
                  {...register('category', { required: 'Category is required' })}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="form-error">{errors.category.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="create-capacity">Capacity *</label>
                <input id="create-capacity" type="number" className={`form-input${errors.capacity ? ' error' : ''}`}
                  placeholder="e.g. 100"
                  min={1} max={100000}
                  {...register('capacity', {
                    required: 'Capacity is required',
                    min: { value: 1, message: 'At least 1' },
                    max: { value: 100000, message: 'Max 100,000' }
                  })} />
                {errors.capacity && <span className="form-error">{errors.capacity.message}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)} id="create-event-cancel-btn">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={mutation.isPending} id="create-event-submit-btn">
                {mutation.isPending ? (
                  <><div className="spinner" style={{ width: 16, height: 16 }} /> Creating...</>
                ) : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
