import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const TO_ADDRESS = 'info@codecraftsinfotech.in';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const plain = `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`;
    const mailto = `mailto:${TO_ADDRESS}?subject=${encodeURIComponent(subject || 'Inquiry from website')}&body=${encodeURIComponent(plain)}`;

    try {
      window.location.href = mailto;
      setStatus('sent');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Intro */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-white/60">• Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold">Contact Us</h1>
          <p className="text-white/80 max-w-2xl mx-auto mt-4">
            Tell us about your product or AI agent idea. We respond within 24 hours.
          </p>
        </div>

        {/* Contact Form */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <form onSubmit={onSubmit} className="bg-white/5 ring-1 ring-white/10 rounded-2xl p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/70">Your Name</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} required className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="text-xs text-white/70">Email</label>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="jane@company.com" />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs text-white/70">Company</label>
              <input value={company} onChange={(e)=>setCompany(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acme Corp" />
            </div>
            <div className="mt-4">
              <label className="text-xs text-white/70">Subject</label>
              <input value={subject} onChange={(e)=>setSubject(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Project inquiry" />
            </div>
            <div className="mt-4">
              <label className="text-xs text-white/70">Message</label>
              <textarea value={message} onChange={(e)=>setMessage(e.target.value)} required rows={6} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe your product, timeline, and goals" />
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button type="submit" className="softpro-btn softpro-btn--primary">Send Email</button>
              <span className="text-xs text-white/50">
                {status === 'sending' && 'Opening your mail client...'}
                {status === 'sent' && 'Mail client opened. Thanks!'}
                {status === 'error' && 'Could not open mail client. Please email us directly.'}
              </span>
            </div>
          </form>

          {/* Contact Details */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-white/70 text-sm mb-2">Prefer direct email? Use the addresses below.</p>
              <div className="space-y-1">
                <a href="mailto:info@codecraftsinfotech.in" className="text-blue-400 hover:text-blue-300">info@codecraftsinfotech.in</a>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
              <h3 className="text-lg font-semibold mb-2">Office</h3>
              <p className="text-white/70 text-sm">Hyderabad, Telangana — India</p>
              <p className="text-white/70 text-sm">Austin, Texas — USA</p>
            </div>
          </div>
        </div>

        {/* Updates CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 ring-1 ring-white/10 p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">Be the first to know about new product releases and agent templates.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="softpro-btn softpro-btn--secondary">Notify Me</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;