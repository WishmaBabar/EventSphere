import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '../api'
import { LoadingPage } from '../components/Loading'
import { ArrowLeft, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Technology', 'Music', 'Sports', 'Art', 'Business', 'Education', 'Health', 'Food', 'Networking', 'Other']

export default function EditEventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(id),
  })

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
        capacity: event.capacity,
      })
    }
  }, [event, reset])

  const mutation = useMutation({
    mutationFn: (data) => eventsApi.update(id, data),
    onSuccess: (data) => {
      toast.success('Event updated successfully!')
      queryClient.invalidateQueries(['events'])
      queryClient.invalidateQueries(['event', id])
      navigate(`/events/${id}`)
    },
    onError: (err) => {
      const errData = err.response?.data
      if (errData?.data && typeof errData.data === 'object') {
        Object.values(errData.data).forEach(msg => toast.error(msg))
      } else {
        toast.error(errData?.message || 'Failed to update event')
      }
    }
  })

  const onSubmit = (data) => mutation.mutate({ ...data, capacity: parseInt(data.capacity) })

  if (isLoading) return <LoadingPage message="Loading event..." />

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '720px' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '24px' }} id="edit-event-back-btn">
          <ArrowLeft size={15} /> Back
        </button>

        <div className="card animate-slide-up" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div className="navbar-logo-icon">
              <Calendar size={18} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Event</h1>
              <p className="text-sm text-secondary">Update the event details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="edit-title">Event Title *</label>
              <input id="edit-title" type="text" className={`form-input${errors.title ? ' error' : ''}`}
                {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'At least 3 characters' } })} />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-description">Description *</label>
              <textarea id="edit-description" className={`form-input form-textarea${errors.description ? ' error' : ''}`}
                rows={4}
                {...register('description', { required: 'Description is required' })} />
              {errors.description && <span className="form-error">{errors.description.message}</span>}
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-date">Date *</label>
                <input id="edit-date" type="date" className={`form-input${errors.date ? ' error' : ''}`}
                  {...register('date', { required: 'Date is required' })} />
                {errors.date && <span className="form-error">{errors.date.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-time">Time *</label>
                <input id="edit-time" type="time" className={`form-input${errors.time ? ' error' : ''}`}
                  {...register('time', { required: 'Time is required' })} />
                {errors.time && <span className="form-error">{errors.time.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-location">Location *</label>
              <input id="edit-location" type="text" className={`form-input${errors.location ? ' error' : ''}`}
                {...register('location', { required: 'Location is required' })} />
              {errors.location && <span className="form-error">{errors.location.message}</span>}
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label className="form-label" htmlFor="edit-category">Category *</label>
                <select id="edit-category" className={`form-input form-select${errors.category ? ' error' : ''}`}
                  {...register('category', { required: 'Category is required' })}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="form-error">{errors.category.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-capacity">Capacity *</label>
                <input id="edit-capacity" type="number" className={`form-input${errors.capacity ? ' error' : ''}`}
                  {...register('capacity', {
                    required: 'Capacity is required',
                    min: { value: 1, message: 'At least 1' },
                    max: { value: 100000, message: 'Max 100,000' }
                  })} />
                {errors.capacity && <span className="form-error">{errors.capacity.message}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)} id="edit-event-cancel-btn">Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={mutation.isPending} id="edit-event-submit-btn">
                {mutation.isPending ? (
                  <><div className="spinner" style={{ width: 16, height: 16 }} /> Saving...</>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
