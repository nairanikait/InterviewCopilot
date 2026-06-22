import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { InputField } from '../components/forms/InputField';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';
import { authService } from '../services/api';

export default function Login() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, run } = useAsync();
  const [isRegister, setIsRegister] = useState(location.state?.register === true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async (data) => {
    await run(async () => {
      if (isRegister) {
        const res = await authService.register({ name: data.name, email: data.email, password: data.password });
        saveSession(res.data.token, res.data.user);
      } else {
        const res = await authService.login({ email: data.email, password: data.password });
        saveSession(res.data.token, res.data.user);
      }
      navigate('/dashboard', { replace: true });
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex w-[480px] flex-shrink-0 flex-col justify-between bg-dark-950 p-10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-brand-700 opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 h-64 w-64 rounded-full bg-brand-500 opacity-10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <p className="text-white font-bold text-lg tracking-tight">InterviewCopilot</p>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-extrabold text-white leading-tight text-balance">
            Master your next interview with AI-driven prep.
          </h1>
          <p className="text-dark-300 text-sm leading-relaxed">
            Tailored to your resume and the specific job description, our Copilot helps you practice the tough questions before they're asked.
          </p>

          {/* AI insight callout */}
          <div className="rounded-xl border border-dark-700 bg-dark-900/60 backdrop-blur-sm px-4 py-4 flex items-start gap-3">
            <svg className="h-5 w-5 text-brand-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">AI Insight</p>
              <p className="text-xs text-dark-300 leading-relaxed">
                "Focus on quantifying your impact. Users who mention metrics see a 40% higher success rate in technical screenings."
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-dark-500">© 2024 InterviewCopilot. Student Edition.</p>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold text-dark-900">
              {isRegister ? 'Create account' : 'Welcome back'}
            </h2>
            <p className="mt-1.5 text-sm text-dark-500">
              {isRegister
                ? 'Start your AI-powered interview prep today.'
                : 'Sign in to continue your preparation journey.'}
            </p>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <form id="auth-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {isRegister && (
              <InputField
                id="auth-name"
                label="Full name"
                type="text"
                placeholder="Alex Johnson"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />
            )}

            <InputField
              id="auth-email"
              label="Email address"
              type="email"
              placeholder="name@university.edu"
              error={errors.email?.message}
              prefix={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              })}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="auth-password" className="block text-sm font-medium text-dark-700">
                  Password
                </label>
                {!isRegister && (
                  <span className="text-xs text-dark-500 hover:text-dark-900 cursor-pointer transition-colors">
                    Forgot password?
                  </span>
                )}
              </div>
              <InputField
                id="auth-password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                prefix={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
              />
            </div>

            {isRegister && (
              <InputField
                id="auth-confirm-password"
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === watch('password') || 'Passwords do not match',
                })}
              />
            )}

            {!isRegister && (
              <label htmlFor="auth-remember" className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="auth-remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-dark-300 text-dark-900 focus:ring-brand-500"
                  {...register('remember')}
                />
                <span className="text-sm text-dark-600">Remember me for 30 days</span>
              </label>
            )}

            <Button
              id="auth-submit"
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3 text-base"
            >
              {isRegister ? 'Create account' : 'Login'}
              {!loading && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px bg-dark-200" />
            <span className="text-xs text-dark-400">Or continue with</span>
            <div className="flex-1 h-px bg-dark-200" />
          </div>

          {/* Social (UI only – no OAuth per spec) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              id="auth-google"
              type="button"
              disabled
              className="btn-secondary justify-center py-2.5 text-sm opacity-60 cursor-not-allowed"
              title="Google SSO not configured"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              id="auth-sso"
              type="button"
              disabled
              className="btn-secondary justify-center py-2.5 text-sm opacity-60 cursor-not-allowed"
              title="Student SSO not configured"
            >
              <svg className="h-4 w-4 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Student SSO
            </button>
          </div>

          <p className="text-center text-sm text-dark-500">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              id="auth-toggle"
              type="button"
              onClick={() => setIsRegister((v) => !v)}
              className="font-bold text-dark-900 hover:underline transition-all"
            >
              {isRegister ? 'Sign in' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
