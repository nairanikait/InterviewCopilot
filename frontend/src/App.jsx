import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { PrivateRoute, PublicRoute } from './routes/guards';
import { AppShell } from './components/layout/AppShell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Results from './pages/Results';
import Sessions from './pages/Sessions';

// Lazy-loaded to keep the main bundle lean
const Analytics = lazy(() => import('./pages/Analytics'));
const Landing   = lazy(() => import('./pages/Landing'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Fully public – no auth wrapper */}
          <Route
            path="/"
            element={
              <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <Landing />
              </Suspense>
            }
          />

          {/* Public routes (redirect to /dashboard if already authed) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected routes – wrapped in AppShell layout */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/results/:sessionId" element={<Results />} />
              {/* Analytics page – lazy loaded */}
              <Route
                path="/analytics"
                element={
                  <Suspense fallback={<div className="h-64 flex items-center justify-center"><span className="text-sm text-dark-400">Loading…</span></div>}>
                    <Analytics />
                  </Suspense>
                }
              />
            </Route>

            {/* Interview renders outside AppShell (full-screen focus mode) */}
            <Route path="/interview" element={<Interview />} />
          </Route>

          {/* Fallback – back to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
