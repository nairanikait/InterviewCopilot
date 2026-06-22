import { useNavigate } from 'react-router-dom';

/**
 * CtaSection – full-width dark CTA band with a single focused action.
 * No newsletter, no pricing.
 */
export function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-dark-900 py-24">
      <div className="max-w-2xl mx-auto px-5 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          Start preparing smarter.
        </h2>
        <p className="text-dark-400 text-sm leading-relaxed">
          Join thousands of students who have secured their dream roles using InterviewCopilot.
        </p>
        <button
          id="cta-create-account"
          onClick={() => navigate('/login', { state: { register: true } })}
          className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-white text-dark-900 text-sm font-semibold hover:bg-dark-100 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-dark-900"
        >
          Create Account
        </button>
      </div>
    </section>
  );
}
