import './SoftPro.css';

const RobotSVG = ({ primary = '#7BF6FF', secondary = '#0A0E12' }: { primary?: string; secondary?: string }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Robot illustration">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor={primary} />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
    </defs>
    <rect x="20" y="60" width="160" height="100" rx="16" fill="url(#g)" opacity="0.25" />
    <circle cx="100" cy="60" r="24" fill={primary} />
    <rect x="40" y="90" width="120" height="60" rx="10" fill={secondary} />
    <circle cx="75" cy="120" r="10" fill={primary} />
    <circle cx="125" cy="120" r="10" fill={primary} />
    <rect x="85" y="140" width="30" height="8" rx="4" fill="#e2e8f0" />
    <rect x="10" y="100" width="20" height="50" rx="6" fill="#1f2937" />
    <rect x="170" y="100" width="20" height="50" rx="6" fill="#1f2937" />
  </svg>
);

const robots = [
  { caption: 'Autonomous Inspection Bot', primary: '#7BF6FF' },
  { caption: 'Collaborative Factory Robot', primary: '#F97316' },
  { caption: 'Service Companion Robot', primary: '#22D3EE' },
];

const RobotsShowcase = () => {
  return (
    <section className="container mx-auto px-6 mt-16 text-white">
      <div className="robots-grid">
        {robots.map((r) => (
          <div key={r.caption} className="robot-card">
            <RobotSVG primary={r.primary} />
            <div className="caption">{r.caption}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RobotsShowcase;