import { Routes, Route, Navigate } from 'react-router-dom'
import { siteRoutes, RouteLoader } from '../Site/src/App'
import Landing from './pages/Landing'
import AdminApp from '../P2-A/src/App'

/**
 * Combined local project: marketing Landing at "/", full Support
 * Center mounted under /site, and Admin Panel mounted under /admin.
 */
export default function App() {
  return (
    <>
      <RouteLoader />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/p2-a/*" element={<AdminApp />} />
        {siteRoutes()}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
