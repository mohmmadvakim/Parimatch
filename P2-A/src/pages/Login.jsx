import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '../components/Icons.jsx'
import { isLoggedIn, login } from '../lib/auth.js'
import { APP_NAME, DEFAULT_PASSWORD } from '../config.js'

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
      setError('Password galat hai. Dobara koshish karein.')
      setValue('')
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        {/* Parimatch Header inside card */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <img src={LOGO} alt="Parimatch Logo" style={{ width: 48, height: 48 }} />
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Parimatch <span style={{ color: 'var(--accent)' }}>Admin</span>
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 4 }}>
              Secure Support Operations Console
            </p>
          </div>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label htmlFor="login-pass">Admin Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-pass"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter admin password"
                value={value}
                onChange={(e) => { setValue(e.target.value); setError('') }}
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
                }}
              >
                <Icon name={showPass ? 'eye-off' : 'eye'} size={18} />
              </button>
            </div>
          </div>

          <button type="submit" className="btn primary block" disabled={!value.trim()}>
            <span>Login to Console</span>
            <Icon name="arrow-right" size={16} />
          </button>

          {error && (
            <div style={{ background: 'var(--no-soft)', color: 'var(--no)', padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ background: '#1e2128', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
            Default password: <strong style={{ color: 'var(--accent)' }}>{DEFAULT_PASSWORD}</strong> (Aap login ke baad Settings se change kar sakte hain).
          </div>
        </form>
      </div>
    </div>
  )
}
