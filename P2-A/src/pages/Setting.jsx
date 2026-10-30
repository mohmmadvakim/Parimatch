import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import { initialsOf } from '../components/status.js'
import { Icon } from '../components/Icons.jsx'
import { useData } from '../App.jsx'
import { getAdminName, setAdminName } from '../lib/prefs.js'
import { getPassword, logout, setPassword } from '../lib/auth.js'
import { firebaseConfig } from '../firebase-config.js'
import { APP_NAME, APP_VERSION, DEFAULT_PASSWORD } from '../config.js'

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
    if (pass.length < 4) return setPassMsg({ tone: 'danger', text: 'Kam se kam 4 characters ka password daalein.' })
    if (pass !== pass2) return setPassMsg({ tone: 'danger', text: 'Dono password match nahi kar rahe hain.' })
    setPassword(pass)
    setPass('')
    setPass2('')
    setPassMsg({ tone: 'success', text: 'Password successfully update ho gaya!' })
    setTimeout(() => setPassMsg({ tone: 'success', text: '' }), 3000)
  }

  const doLogout = () => {
    logout()
    navigate(base ? `${base}/login` : '/login', { replace: true })
  }

  const isDefaultPass = getPassword() === DEFAULT_PASSWORD

  return (
    <AppShell title="Admin Settings" subtitle="Configure profile, security, and data preferences">
      {/* Admin Profile Overview */}
      <div className="card panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="admin-avatar" style={{ width: 56, height: 56, fontSize: '1.25rem' }}>
            {initialsOf(getAdminName())}
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)' }}>{getAdminName()}</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginTop: 2 }}>
              {APP_NAME} Control Panel · v{APP_VERSION}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {/* Profile Form */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 14 }}>
            Admin Profile
          </h3>
          <form onSubmit={saveName} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label htmlFor="admin-name">Display Name</label>
              <input
                id="admin-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button type="submit" className="btn primary sm">
                <Icon name="check" size={15} />
                <span>Save Name</span>
              </button>
              {savedName && (
                <span style={{ fontSize: '0.8rem', color: 'var(--yes)' }}>Saved successfully!</span>
              )}
            </div>
          </form>
        </div>

        {/* Security / Password Form */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 14 }}>
            Security &amp; Password
          </h3>
          <form onSubmit={changePass} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group">
              <label htmlFor="new-pass">New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="new-pass"
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Enter new password"
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
                  }}
                >
                  <Icon name={showPass ? 'eye-off' : 'eye'} size={18} />
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
                placeholder="Repeat password"
              />
            </div>

            <button type="submit" className="btn secondary sm" style={{ alignSelf: 'flex-start' }}>
              <Icon name="shield" size={15} />
              <span>Update Password</span>
            </button>

            {passMsg.text && (
              <div
                style={{
                  fontSize: '0.82rem',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius)',
                  background: passMsg.tone === 'success' ? 'var(--yes-soft)' : 'var(--no-soft)',
                  color: passMsg.tone === 'success' ? 'var(--yes)' : 'var(--no)',
                }}
              >
                {passMsg.text}
              </div>
            )}

            <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              {isDefaultPass ? `Default password active hai: ${DEFAULT_PASSWORD}` : 'Custom password set hai.'}
            </p>
          </form>
        </div>
      </div>

      {/* System & Firestore Data Details Grid */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 14 }}>
          System &amp; Database
        </h3>
        <div className="complain-details-grid">
          <div className="complain-detail">
            <span className="complain-detail-label">Database Status</span>
            <span className="complain-detail-value" style={{ color: ready ? 'var(--yes)' : 'var(--warn)' }}>
              {ready ? '● Firestore Live Connected' : '● LocalStorage Fallback'}
            </span>
          </div>
          <div className="complain-detail">
            <span className="complain-detail-label">Firebase Project</span>
            <span className="complain-detail-value">{firebaseConfig.projectId || 'None'}</span>
          </div>
          <div className="complain-detail">
            <span className="complain-detail-label">Total Unique Users</span>
            <span className="complain-detail-value">{new Set(complaints.map((c) => c.clientId)).size}</span>
          </div>
          <div className="complain-detail">
            <span className="complain-detail-label">Total Complaints</span>
            <span className="complain-detail-value">{complaints.length}</span>
          </div>
          <div className="complain-detail">
            <span className="complain-detail-label">Total Messages</span>
            <span className="complain-detail-value">{messages.length}</span>
          </div>
          <div className="complain-detail">
            <span className="complain-detail-label">UI Design</span>
            <span className="complain-detail-value">Parimatch Site Signature Theme</span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div style={{ marginTop: 8 }}>
        <button type="button" className="btn danger block" onClick={doLogout}>
          <Icon name="logout" size={18} />
          <span>Logout from Admin</span>
        </button>
      </div>
    </AppShell>
  )
}
