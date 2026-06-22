
/**
 * HeroSection – landing page hero with headline, subheadline, and CTAs.
 * Mirrors the left/right split from the design: copy on left, product preview card on right.
 */
export function HeroSection() {

  return (
    <section className="max-w-6xl mx-auto px-5 pt-20 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left – copy */}
      <div className="space-y-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-dark-900 leading-tight tracking-tight">
          Master your next{' '}
          <span className="text-brand-600">interview.</span>
        </h1>
        <p className="text-base text-dark-500 leading-relaxed max-w-md">
          Practice with AI-assisted mock interviews and track your progress with
          data-driven insights designed for the modern job seeker.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            id="hero-view-demo"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary px-6 py-3 text-sm"
          >
            View Demo
          </button>
        </div>
      </div>

      {/* Right – product preview card */}
      <div className="hidden lg:flex justify-end">
        <div className="relative w-full max-w-sm">
          {/* Browser chrome dots */}
          <div className="card overflow-hidden shadow-xl">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-dark-100 bg-dark-50">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-auto text-xs text-dark-400 font-mono">Interview dashboard v1</span>
            </div>

            {/* Mock dashboard content */}
            <div className="p-5 bg-white space-y-4">
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-dark-200 bg-dark-50 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Avg Score</p>
                  <p className="text-2xl font-bold text-dark-900 mt-0.5">84%</p>
                </div>
                <div className="rounded-xl border border-dark-200 bg-dark-50 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Sessions</p>
                  <p className="text-2xl font-bold text-dark-900 mt-0.5">12</p>
                </div>
              </div>

              {/* Mini bar chart (static visual, no fake data) */}
              <div>
                <p className="text-[10px] font-semibold text-dark-400 mb-2 uppercase tracking-wide">Improvement over time</p>
                <div className="flex items-end gap-1.5 h-14">
                  {[35, 45, 42, 55, 60, 65, 72, 80].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{ height: `${h}%`, backgroundColor: i === 7 ? '#0f172a' : '#e2e8f0' }}
                    />
                  ))}
                </div>
              </div>

              {/* Next interview */}
              <div className="flex items-center gap-2 text-xs text-dark-500 border-t border-dark-100 pt-3">
                <svg className="h-3.5 w-3.5 text-brand-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Next interview: Senior Dev @ Stripe
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
