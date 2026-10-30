import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import { initialsOf } from '../components/status.js'
import { Icon } from '../components/Icons.jsx'
import { useData } from '../App.jsx'
import { getAdminName, setAdminName } from '../lib/prefs.js'
import { getPassword, logout, setPassword } from '../lib/auth.js'
import { DEFAULT_PASSWORD } from '../config.js'

export default function Setting() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { complaints, messages, ready } = useData()

  const [name, setName] = useState(getAdminName())
  const [savedName, setSavedName] = useState(false)
  const [pass, setPass] = useState('')
  const [pass2, setPass2] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [passMsg, setPassMsg] = useState({ tone: 'success', text: '' })

  const base = pathname.startsWith('/admin') ? '/admin' : ''

  const saveName = (e) => {
    e.preventDefault()
    setAdminName(name)
    setSavedName(true)
    setTimeout(() => setSavedName(false), 2000)
  }

  const changePass = (e) => {
    e.preventDefault()
    if (pass.length < 4) return setPassMsg({ tone: 'danger', text: 'Password must be at least 4 characters.' })
    if (pass !== pass2) return setPassMsg({ tone: 'danger', text: 'Passwords do not match.' })
    setPassword(pass)
    setPass('')
    setPass2('')
    setPassMsg({ tone: 'success', text: 'Password updated successfully.' })
    setTimeout(() => setPassMsg({ tone: 'success', text: '' }), 3000)
  }

  const doLogout = () => {
    logout()
    navigate(base ? `${base}/login` : '/login', { replace: true })
  }

  const isDefaultPass = getPassword() === DEFAULT_PASSWORD

  return (
    <AppShell title="Settings">
      {/* Profile Card */}
      <div className="pa-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="pa-avatar" style={{ width: 44, height: 44, fontSize: '1rem' }}>
            {initialsOf(getAdminName())}
          </div>
          <div>
            <h2 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text)' }}>
              {getAdminName()}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
              Parimatch Support Administrator
            </p>
          </div>
        </div>

        <form onSubmit={saveName} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="form-group">
            <label htmlFor="admin-name">Admin Name</label>
            <input
              id="admin-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Admin"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="submit" className="btn primary sm">
              <Icon name="check" size={15} />
              <span>Save Name</span>
            </button>
            {savedName && (
              <span style={{ fontSize: '0.78rem', color: 'var(--yes)' }}>Saved</span>
            )}
          </div>
        </form>
      </div>

      {/* Security & Password Card */}
      <div className="pa-card">
        <div className="pa-card-head">
          <h2 className="pa-card-title">Change Password</h2>
        </div>

        <form onSubmit={changePass} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="form-group">
            <label htmlFor="new-pass">New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="new-pass"
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="New password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: 10,
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

          <div className="form-group">
            <label htmlFor="repeat-pass">Confirm Password</label>
            <input
              id="repeat-pass"
              type={showPass ? 'text' : 'password'}
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              placeholder="Confirm password"
            />
          </div>

          <button type="submit" className="btn primary sm" style={{ alignSelf: 'flex-start' }}>
            <Icon name="shield" size={15} />
            <span>Update Password</span>
          </button>

          {passMsg.text && (
            <div
              style={{
                fontSize: '0.78rem',
                padding: '6px 10px',
                borderRadius: 'var(--radius)',
                background: passMsg.tone === 'success' ? 'var(--yes-soft)' : 'var(--no-soft)',
                color: passMsg.tone === 'success' ? 'var(--yes)' : 'var(--no)',
              }}
            >
              {passMsg.text}
            </div>
          )}

          {isDefaultPass && (
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
              Default password: {DEFAULT_PASSWORD}
            </span>
          )}
        </form>
      </div>

      {/* Database Status Card */}
      <div className="pa-card">
        <div className="pa-card-head">
          <h2 className="pa-card-title">System Status</h2>
          <span className={`pa-badge ${ready ? 'resolved' : 'pending'}`}>
            {ready ? 'Connected' : 'Offline'}
          </span>
        </div>

        <div className="pa-kv-grid">
          <div className="pa-kv-item">
            <span className="pa-kv-lbl">Database</span>
            <span className="pa-kv-val">{ready ? 'Firestore Live' : 'LocalStorage'}</span>
          </div>
          <div className="pa-kv-item">
            <span className="pa-kv-lbl">Complaints</span>
            <span className="pa-kv-val">{complaints.length}</span>
          </div>
          <div className="pa-kv-item">
            <span className="pa-kv-lbl">Messages</span>
            <span className="pa-kv-val">{messages.length}</span>
          </div>
          <div className="pa-kv-item">
            <span className="pa-kv-lbl">Mode</span>
            <span className="pa-kv-val">Light Mode</span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <button type="button" className="btn secondary block" onClick={doLogout} style={{ color: 'var(--no)', borderColor: 'var(--border)' }}>
        <Icon name="logout" size={16} />
        <span>Logout</span>
      </button>
    </AppShell>
  )
}
