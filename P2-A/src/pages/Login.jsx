import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import { isLoggedIn, login } from '../lib/auth.js'
import { DEFAULT_PASSWORD } from '../config.js'

const LOGO = '/site/logo/logo.png'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const base = location.pathname.startsWith('/admin') ? '/admin' : ''

  if (isLoggedIn()) return <Navigate to={base || '/'} replace />

  const submit = (e) => {
    e.preventDefault()
    if (login(value)) {
      const destination = location.state?.from || (base || '/')
      navigate(destination, { replace: true })
    } else {
      setError('Incorrect password. Try again.')
      setValue('')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'var(--bg)',
      }}
    >
      <div
        className="pa-card"
        style={{
          width: '100%',
          maxWidth: 380,
          padding: 24,
          gap: 18,
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <img
            src={LOGO}
            alt="Parimatch Logo"
            style={{ width: 44, height: 44, objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Parimatch <span style={{ color: 'var(--accent)' }}>Admin</span>
          </h1>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label htmlFor="login-pass">Admin Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-pass"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  setError('')
                }}
                autoFocus
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 0,
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <Icon name={showPass ? 'eye-off' : 'eye'} size={16} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn primary block"
            disabled={!value.trim()}
          >
            <span>Login</span>
            <Icon name="arrow-right" size={16} />
          </button>

          {error && (
            <div
              style={{
                background: 'var(--no-soft)',
                color: 'var(--no)',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                fontSize: '0.8rem',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              background: 'var(--card-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '8px 12px',
              fontSize: '0.74rem',
              color: 'var(--muted)',
              textAlign: 'center',
            }}
          >
            Default password: <strong style={{ color: 'var(--text)' }}>{DEFAULT_PASSWORD}</strong>
          </div>
        </form>
      </div>
    </div>
  )
}
