/**
 * FeatureCard – single feature tile used inside FeaturesSection.
 */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="card p-6 space-y-4 hover:shadow-md transition-shadow duration-200">
      <div className="h-10 w-10 rounded-xl bg-dark-100 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-dark-900">{title}</h3>
        <p className="text-sm text-dark-500 mt-1.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: 'AI Interview Sessions',
    description:
      'Generate unlimited practice interviews tailored to specific job descriptions and company cultures.',
    icon: (
      <svg className="h-5 w-5 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    title: 'Performance Analytics',
    description:
      'Track your vocabulary, tone, and confidence levels over time with detailed visual progress reports.',
    icon: (
      <svg className="h-5 w-5 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Student Friendly',
    description:
      'Designed for busy schedules. Engage in high-impact 15-minute sessions between classes or work.',
    icon: (
      <svg className="h-5 w-5 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
];

/**
 * FeaturesSection – three feature cards with a section header.
 */
export function FeaturesSection() {
  return (
    <section id="features" className="bg-dark-50 py-24">
      <div className="max-w-6xl mx-auto px-5">
        {/* Section header */}
        <div className="text-center max-w-lg mx-auto mb-12">
          <h2 className="text-3xl font-bold text-dark-900">Precision tools for career success</h2>
          <p className="text-sm text-dark-500 mt-3 leading-relaxed">
            Our platform combines state-of-the-art language models with career coaching methodology.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
