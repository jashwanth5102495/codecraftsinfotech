import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type JobType = 'Full-time' | 'Internship' | 'Contract';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote?: boolean;
  type: JobType;
  level: 'Junior' | 'Mid' | 'Senior';
  salary?: string; // e.g. "₹8–12 LPA" or "₹25,000/mo"
  tags: string[];
  posted: string; // e.g. "2 days ago"
  description: string;
}

const JOBS: Job[] = [
  {
    id: 'se-react-01',
    title: 'Software Engineer (React + TypeScript)',
    company: 'CodeCrafts',
    location: 'Bengaluru, IND',
    remote: true,
    type: 'Full-time',
    level: 'Mid',
    salary: '₹8–12 LPA',
    tags: ['React', 'TypeScript', 'Tailwind', 'Vite'],
    posted: '2 days ago',
    description: 'Build polished, accessible frontends; collaborate with design; write high-quality, tested code.'
  },
  {
    id: 'se-node-01',
    title: 'Backend Engineer (Node.js + API)',
    company: 'NextWave IT',
    location: 'Hyderabad, IND',
    type: 'Full-time',
    level: 'Mid',
    salary: '₹10–15 LPA',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'API'],
    posted: '3 days ago',
    description: 'Design scalable APIs; optimize database queries; ensure reliability and robust monitoring.'
  },
  {
    id: 'ml-intern-01',
    title: 'Machine Learning Intern',
    company: 'DataForge Labs',
    location: 'Pune, IND',
    remote: true,
    type: 'Internship',
    level: 'Junior',
    salary: '₹25,000/mo',
    tags: ['Python', 'Pandas', 'scikit-learn', 'Jupyter'],
    posted: '1 day ago',
    description: 'Assist in prototyping ML models; perform EDA; support production handoff.'
  },
  {
    id: 'frontend-intern-01',
    title: 'Frontend Intern (React UI)',
    company: 'PixelWorks Studio',
    location: 'Remote (IND)',
    remote: true,
    type: 'Internship',
    level: 'Junior',
    salary: '₹20,000–30,000/mo',
    tags: ['React', 'CSS', 'Accessibility', 'Testing'],
    posted: 'Today',
    description: 'Implement responsive UI; fix bugs; learn best practices in accessibility and testing.'
  },
  {
    id: 'devops-01',
    title: 'DevOps Engineer',
    company: 'InfraCloud',
    location: 'Mumbai, IND',
    type: 'Full-time',
    level: 'Mid',
    salary: '₹12–18 LPA',
    tags: ['AWS', 'Docker', 'CI/CD', 'Terraform'],
    posted: '4 days ago',
    description: 'Own CI/CD; containerize services; maintain IaC; champion reliability and cost efficiency.'
  },
];

const Tag: React.FC<{ label: string }> = ({ label }) => (
  <span className="px-2 py-1 rounded-md bg-white/10 border border-white/20 text-xs text-white/80">
    {label}
  </span>
);

const JobCard: React.FC<{ job: Job; onApply: (job: Job) => void }> = ({ job, onApply }) => {
  return (
    <div className="rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 p-5 hover:bg-white/8 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{job.title}</h3>
            {job.remote && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-400/30">Remote</span>
            )}
          </div>
          <div className="mt-1 text-sm text-white/70">{job.company} • {job.location}</div>
          <div className="mt-1 text-xs text-white/60">{job.type} • {job.level} • {job.posted}</div>
        </div>
        <div className="text-sm text-white/80">
          {job.salary && <span className="px-2 py-1 rounded-md bg-black/40 border border-white/20">{job.salary}</span>}
        </div>
      </div>
      <p className="mt-3 text-sm text-white/80">{job.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {job.tags.map(t => <Tag key={t} label={t} />)}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => onApply(job)}
        >
          Apply
        </button>
        <button
          className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/15"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const Career: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<JobType | 'All'>('All');
  const [location, setLocation] = useState('All');

  const filtered = useMemo(() => {
    return JOBS.filter(j => {
      const matchesQuery = [j.title, j.company, j.location, j.tags.join(' ')].join(' ').toLowerCase().includes(query.toLowerCase());
      const matchesType = type === 'All' ? true : j.type === type;
      const matchesLocation = location === 'All' ? true : j.location.toLowerCase().includes(location.toLowerCase());
      return matchesQuery && matchesType && matchesLocation;
    });
  }, [query, type, location]);

  const vacancies = filtered.filter(j => j.type !== 'Internship');
  const internships = filtered.filter(j => j.type === 'Internship');

  const onApply = (job: Job) => {
    // For demo, route to Contact page to collect candidate info
    navigate('/contact', { state: { jobId: job.id, role: job.title, company: job.company } });
  };

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Careers</h1>
            <p className="text-white/70 text-sm">Discover roles and internships similar to Indeed/LinkedIn listings.</p>
          </div>
          <button className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm hover:bg-white/15" onClick={()=>navigate('/')}>Home</button>
        </div>

        {/* Filters */}
        <div className="rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-white/60">Search</label>
              <input
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Keyword, company, tech"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-white/60">Type</label>
              <select
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:outline-none"
                value={type}
                onChange={(e)=>setType(e.target.value as JobType | 'All')}
              >
                <option className="bg-black text-white" value="All">All</option>
                <option className="bg-black text-white" value="Full-time">Full-time</option>
                <option className="bg-black text-white" value="Internship">Internship</option>
                <option className="bg-black text-white" value="Contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/60">Location</label>
              <select
                className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white focus:outline-none"
                value={location}
                onChange={(e)=>setLocation(e.target.value)}
              >
                <option className="bg-black text-white" value="All">All</option>
                <option className="bg-black text-white" value="Bengaluru">Bengaluru</option>
                <option className="bg-black text-white" value="Hyderabad">Hyderabad</option>
                <option className="bg-black text-white" value="Mumbai">Mumbai</option>
                <option className="bg-black text-white" value="Pune">Pune</option>
                <option className="bg-black text-white" value="Remote">Remote</option>
              </select>
            </div>
          </div>
        </div>

        {/* Vacancies */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Open Roles</h2>
            <span className="text-xs text-white/60">{vacancies.length} roles</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map(job => (
              <JobCard key={job.id} job={job} onApply={onApply} />
            ))}
            {vacancies.length === 0 && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-sm text-white/70">No matching roles found. Try adjusting filters.</div>
            )}
          </div>
        </section>

        {/* Internships */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Internships</h2>
            <span className="text-xs text-white/60">{internships.length} listings</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internships.map(job => (
              <JobCard key={job.id} job={job} onApply={onApply} />
            ))}
            {internships.length === 0 && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-sm text-white/70">No matching internships found. Try adjusting filters.</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Career;