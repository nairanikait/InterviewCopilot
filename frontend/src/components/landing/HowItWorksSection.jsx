const STEPS = [
  {
    number: '01',
    title: 'Step 1: Create Account',
    description: 'Set up your profile and upload your current resume for AI personalisation.',
    icon: (
      <svg className="h-7 w-7 text-dark-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Step 2: Practice Interviews',
    description: 'Engage in voice or text-based mock sessions with our supportive AI interviewer.',
    icon: (
      <svg className="h-7 w-7 text-dark-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Step 3: Track Progress',
    description: 'Review feedback, improve your weak spots, and celebrate your growth.',
    icon: (
      <svg className="h-7 w-7 text-dark-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

/**
 * HowItWorksSection – three numbered steps in a horizontal layout.
 */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        {/* Section header */}
        <div className="text-center max-w-md mx-auto mb-14">
          <h2 className="text-3xl font-bold text-dark-900">How it Works</h2>
          <p className="text-sm text-dark-500 mt-3">Three simple steps to interview confidence.</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          {/* Connector line – desktop only */}
          <div className="hidden sm:block absolute top-9 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-dark-200" aria-hidden="true" />

          {STEPS.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center gap-4 relative">
              {/* Circle icon */}
              <div className="h-18 w-18 rounded-full border-2 border-dark-200 bg-white flex items-center justify-center flex-shrink-0 z-10 p-4">
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-dark-900">{step.title}</p>
                <p className="text-sm text-dark-500 mt-1.5 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
