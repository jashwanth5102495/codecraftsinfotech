import React from 'react';

const About: React.FC = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Intro */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-white/60 tracking-wider">ABOUT CODECRAFTS INFOTECH</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            We build reliable software products and user‑aligned AI agents
          </h1>
          <p className="text-white/80 max-w-3xl">
            CodeCrafts Infotech is a product‑focused IT company. We design, build, and ship
            production‑grade software products — web, mobile, and platform integrations — with
            an emphasis on performance, security, and maintainability. Our AI practice crafts
            task‑specific agents that automate workflows, assist decision‑making, and adapt to
            your organization’s needs.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: 'Software Products',
              desc: 'Full‑stack web and mobile apps, modular architectures, robust CI/CD, and cloud‑native deployments.'
            },
            {
              title: 'AI Agents',
              desc: 'Goal‑driven agents that plan, call tools/APIs, maintain memory and autonomy, and respect governance.'
            },
            {
              title: 'Integrations',
              desc: 'Payments, CRM/ERP, analytics, data pipelines, and secure identity — all connected cleanly.'
            },
          ].map((card) => (
            <div key={card.title} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-white/70 text-sm">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Capabilities */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Capabilities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Product discovery & roadmapping',
              'UX design & accessible UI',
              'API design, data modeling, and testing',
              'Performance tuning & observability',
              'Security, compliance, and privacy‑first patterns',
              'Agent orchestration, tools, and memory systems',
            ].map((cap) => (
              <div key={cap} className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 text-white/80 text-sm">{cap}</div>
            ))}
          </div>
        </div>

        {/* Approach */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Approach</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Discover',
                desc: 'We align on outcomes, define success metrics, and design an incremental delivery plan.'
              },
              {
                title: 'Build',
                desc: 'We implement in small, testable slices with automated checks and clear documentation.'
              },
              {
                title: 'Evolve',
                desc: 'We instrument, measure, and iterate — ensuring the product and agents improve over time.'
              },
            ].map((step) => (
              <div key={step.title} className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-white/70 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-red-500/10 to-blue-500/10 ring-1 ring-white/10 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">Have a product or agent idea?</h3>
              <p className="text-white/70 text-sm">Let’s turn it into a reliable, measurable solution.</p>
            </div>
            <a href="/contact" className="softpro-btn softpro-btn--primary">Start a conversation</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;