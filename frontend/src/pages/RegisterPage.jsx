import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '../components/ui/Button'
import FormInput from '../components/ui/FormInput'

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: 'onBlur',
  })

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.token) {
        login(data)
        toast.success(`Account created! Welcome, ${data.name}!`)
        navigate('/dashboard')
      } else {
        toast.success('Registration successful! Please wait for admin approval before logging in.')
        navigate('/login')
      }
    },
    onError: (err) => {
      const errData = err.response?.data
      if (errData?.data && typeof errData.data === 'object') {
        Object.values(errData.data).forEach(msg => toast.error(msg))
      } else {
        toast.error(errData?.message || 'Registration failed. Please try again.')
      }
    }
  })

  const onSubmit = (data) => mutation.mutate(data)

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-card animate-slide-up">
        <div className="auth-logo">
          <div className="auth-logo-icon flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className="text-gradient" style={{ fontSize: '22px', fontWeight: 800 }}>
            EventSphere
          </span>
        </div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join EventSphere to discover and manage events</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label="Full Name"
            type="text"
            icon={User}
            placeholder="John Doe"
            autoComplete="name"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
              maxLength: { value: 100, message: 'Name is too long' }
            })}
            error={errors.name?.message}
            required
          />

          <FormInput
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
            })}
            error={errors.email?.message}
            required
          />

          <div className="form-group">
            <label className="form-label">
              Password
              <span style={{ color: 'var(--accent-tertiary)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-input${errors.password ? ' error' : ''}`}
                style={{ paddingLeft: '36px', paddingRight: '40px' }}
                placeholder="8+ chars, uppercase, number & special char"
                autoComplete="new-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: { value: PASSWORD_PATTERN, message: 'Must include uppercase, lowercase, number & special char (@$!%*?&)' }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password.message}</span>}
            {!errors.password && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', display: 'block' }}>
                At least 8 characters with uppercase, number and special character
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={mutation.isPending}
            loading={mutation.isPending}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {mutation.isPending ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="auth-link">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
