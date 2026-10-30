import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Input from '../own/ui/input/Input.jsx'
import Button from '../own/ui/button/Button.jsx'
import { Alert } from '../own/ui/feedback/Alert.jsx'
import { isLoggedIn, login } from '../lib/auth.js'
import { APP_NAME, DEFAULT_PASSWORD } from '../config.js'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

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
    <div className="pa-app pa-app--no-nav">
      <div className="pa-login">
        <div className="pa-center pa-stack" style={{ alignItems: 'center', gap: 10 }}>
          <span className="pa-brand" style={{ fontSize: '1.4rem' }}>
            <span className="pa-brand__badge" style={{ width: 36, height: 36, fontSize: '0.95rem' }}>P2</span>
            <span>{APP_NAME} Admin</span>
          </span>
          <p className="pa-muted">Support Admin Panel · Secure Console</p>
        </div>

        <form className="pa-login-card" onSubmit={submit}>
          <h2 className="pa-section__title" style={{ fontSize: '0.85rem' }}>Admin authentication</h2>
          <Input
            id="login-pass"
            label="Admin Password"
            type="password"
            allowPasswordToggle
            icon="lock"
            placeholder="Enter password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError('') }}
            autoFocus
            autoComplete="current-password"
            error={error}
          />
          <Button type="submit" fullWidth icon="arrow-right" disabled={!value}>
            Login to Admin
          </Button>

          <p className="pa-muted" style={{ lineHeight: 1.5 }}>
            Default password: <code style={{ color: 'var(--accent)', fontWeight: 700 }}>{DEFAULT_PASSWORD}</code> — Setting page se badal sakte ho.
          </p>

          {error ? <Alert tone="danger" title="Login fail">{error}</Alert> : null}
        </form>
      </div>
    </div>
  )
}
