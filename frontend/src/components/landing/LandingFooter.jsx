const FOOTER_COLS = [
  {
    heading: 'Product',
    links: ['Features', 'Pricing', 'Demo'],
  },
  {
    heading: 'Company',
    links: ['Careers', 'About Us', 'Contact'],
  },
  {
    heading: 'Support',
    links: ['Contact Support', 'Help Center', 'Resources'],
  },
  {
    heading: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  },
];

/**
 * LandingFooter – multi-column footer matching the design.
 * Links are non-functional placeholders for future pages.
 */
export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-50 border-t border-dark-200 pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-5">
        {/* Top row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 pb-10 border-b border-dark-200">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 space-y-3">
            <p className="text-sm font-bold text-dark-900">InterviewCopilot</p>
            <p className="text-xs text-dark-500 leading-relaxed max-w-[200px]">
              Empowering the next generation of professionals with AI-driven interview intelligence.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-dark-500">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <span className="text-xs text-dark-500 hover:text-dark-900 transition-colors cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-6 text-center">
          <p className="text-xs text-dark-400">
            © {year} InterviewCopilot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
