import React, { useEffect, useState } from 'react';
import api, { ApiResponse } from '@/services/api';

interface PurchaseItem { title: string; price: number; quantity: number; certificate?: string }
interface PurchaseRecord {
  id: string;
  txnId: string;
  student: any;
  items: PurchaseItem[];
  subtotal: number;
  taxes: number;
  total: number;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  // New: referrals state
  const [activeTab, setActiveTab] = useState<'purchases' | 'referrals' | 'applications'>('purchases');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [refForm, setRefForm] = useState({ agentName: '', email: '', code: '', discountPercent: 10 });
  const [refStatus, setRefStatus] = useState<string | null>(null);

  useEffect(()=>{
    // try token verify if exists
    (async ()=>{
      const res = await api.verifyToken();
      if (res.success && res.data?.valid){ setIsAuthed(true); fetchPurchases(); fetchReferrals(); fetchApplications(); }
    })();
  },[]);

  async function login(){
    setLoading(true); setError(null);
    const res = await api.login({ username, password });
    setLoading(false);
    if (res.success && res.data){ setIsAuthed(true); fetchPurchases(); fetchReferrals(); fetchApplications(); }
    else setError(res.error || 'Login failed');
  }

  async function logout(){
    await api.logout();
    setIsAuthed(false);
  }

  async function createReferral(e: React.FormEvent){
    e.preventDefault();
    setRefStatus(null); setError(null);
    const payload = { ...refForm, discountPercent: Number(refForm.discountPercent) } as any;
    const res = await api.createReferral(payload);
    if (res.success && res.data){
      setRefStatus('Referral created');
      setRefForm({ agentName: '', email: '', code: '', discountPercent: 10 });
      fetchReferrals();
    } else {
      setError(res.error || 'Failed to create referral');
    }
  }

  async function deleteReferral(code: string){
    setError(null);
    const res = await api.deleteReferral(code);
    if (res.success){ fetchReferrals(); }
    else setError(res.error || 'Failed to delete referral');
  }

  // Fetch purchases for admin
  async function fetchPurchases(){
    try {
      setLoading(true); setError(null);
      const res = await api.getPurchases();
      if (res.success && res.data){
        setPurchases(res.data as PurchaseRecord[]);
      } else {
        setError(res.error || 'Failed to fetch purchases');
      }
    } catch (err){
      setError(err instanceof Error ? err.message : 'Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  }

  // Fetch referrals for admin
  async function fetchReferrals(){
    try {
      setLoading(true); setError(null);
      const res = await api.getReferrals();
      if (res.success && res.data){
        setReferrals(res.data as any[]);
      } else {
        setError(res.error || 'Failed to fetch referrals');
      }
    } catch (err){
      setError(err instanceof Error ? err.message : 'Failed to fetch referrals');
    } finally {
      setLoading(false);
    }
  }

  // Fetch internship applications for admin
  async function fetchApplications(){
    try {
      setLoading(true); setError(null);
      const [appsRes, purchasesRes] = await Promise.all([
        api.getApplications(),
        api.getPurchases()
      ]);
      if (appsRes.success && appsRes.data){
        let apps: any[] = appsRes.data as any[];
        if (purchasesRes.success && purchasesRes.data){
          const purchases: any[] = purchasesRes.data as any[];
          // Build latest purchase-by-email map
          const latestByEmail: Record<string, { txnId: string; createdAt: string }> = {};
          for (const p of purchases){
            const email = String(p?.student?.email || '').toLowerCase();
            if (!email) continue;
            const prev = latestByEmail[email];
            if (!prev || new Date(p.createdAt).getTime() >= new Date(prev.createdAt).getTime()){
              latestByEmail[email] = { txnId: p.txnId, createdAt: p.createdAt };
            }
          }
          // Attach computed txn id for display if missing on record
          apps = apps.map(a => {
            if (!a.txnId){
              const em = String(a.email || '').toLowerCase();
              const hit = latestByEmail[em];
              if (hit) return { ...a, _computedTxnId: hit.txnId };
            }
            return a;
          });
        }
        setApplications(apps);
      } else {
        setError(appsRes.error || 'Failed to fetch applications');
      }
    } catch (err){
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }

  async function removeApplication(id: string){
    const ok = window.confirm('Delete this application permanently? This cannot be undone.');
    if (!ok) return;
    setError(null);
    const res = await api.deleteApplication(id);
    if (res.success){
      setApplications(prev => prev.filter(a => String(a.id) !== String(id)));
      if (selectedApplication?.id === id) setSelectedApplication(null);
    } else {
      setError(res.error || 'Failed to delete application');
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {!isAuthed ? (
          <div className="max-w-sm mx-auto bg-white/5 rounded-xl border border-white/10 p-4">
            <h2 className="text-lg font-semibold mb-3">Admin Login</h2>
            <div className="space-y-3">
              <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50" />
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50" />
              <button onClick={login} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">Login</button>
              {error && <div className="text-red-400 text-sm">{error}</div>}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <button onClick={()=>setActiveTab('purchases')} className={`px-3 py-2 rounded-lg border ${activeTab==='purchases'?'bg-white/15 border-white/30':'border-white/20'}`}>Purchases</button>
              <button onClick={()=>setActiveTab('referrals')} className={`px-3 py-2 rounded-lg border ${activeTab==='referrals'?'bg-white/15 border-white/30':'border-white/20'}`}>Referrals</button>
              <button onClick={()=>setActiveTab('applications')} className={`px-3 py-2 rounded-lg border ${activeTab==='applications'?'bg-white/15 border-white/30':'border-white/20'}`}>Internship Applications</button>
              <div className="ml-auto flex gap-2">
                <button onClick={() => {
                  if (activeTab === 'purchases') fetchPurchases();
                  else if (activeTab === 'referrals') fetchReferrals();
                  else fetchApplications();
                }} className="px-3 py-2 border border-white/20 rounded-md">Refresh</button>
                <button onClick={logout} className="px-3 py-2 border border-white/20 rounded-md">Logout</button>
              </div>
            </div>

            {activeTab==='purchases' && (
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="flex items-center mb-4">
                  <h2 className="text-lg font-semibold">Project Purchases</h2>
                </div>
                {loading && <div className="text-white/70 text-sm">Loading...</div>}
                {error && <div className="text-red-400 text-sm">{error}</div>}
                {!loading && purchases.length === 0 && (
                  <div className="text-white/60 text-sm">No purchases yet.</div>
                )}
                {purchases.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-white/70">
                          <th className="p-2">Created</th>
                          <th className="p-2">Transaction ID</th>
                          <th className="p-2">Student</th>
                          <th className="p-2">Contact</th>
                          <th className="p-2">Location</th>
                          <th className="p-2">Items</th>
                          <th className="p-2">Subtotal</th>
                          <th className="p-2">Taxes</th>
                          <th className="p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map(p => (
                          <tr key={p.id} className="border-t border-white/10">
                            <td className="p-2 text-white/60">{new Date(p.createdAt).toLocaleString()}</td>
                            <td className="p-2">{p.txnId}</td>
                            <td className="p-2">
                              {p.student?.firstName || ''} {p.student?.lastName || ''}
                              <div className="text-xs text-white/50">{p.student?.description || ''}</div>
                            </td>
                            <td className="p-2">
                              <div>{p.student?.email || 'N/A'}</div>
                              <div className="text-xs text-white/50">{p.student?.phone || ''}</div>
                            </td>
                            <td className="p-2">
                              <div>{p.student?.city || ''}</div>
                              <div className="text-xs text-white/50">{p.student?.state || ''} {p.student?.zip || ''}</div>
                            </td>
                            <td className="p-2">
                              {p.items.map((it, idx)=> (
                                <div key={idx} className="text-white/80">
                                  {it.title} × {it.quantity} — ₹{it.price.toLocaleString('en-IN')}
                                </div>
                              ))}
                            </td>
                            <td className="p-2">₹{p.subtotal.toLocaleString('en-IN')}</td>
                            <td className="p-2">₹{p.taxes.toLocaleString('en-IN')}</td>
                            <td className="p-2 font-semibold">₹{p.total.toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab==='referrals' && (
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <h2 className="text-lg font-semibold mb-4">Create Referral Code</h2>
                <form onSubmit={createReferral} className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-white/70">Agent Name *</label>
                    <input value={refForm.agentName} onChange={(e)=>setRefForm(v=>({ ...v, agentName: e.target.value }))} required className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70">Email *</label>
                    <input type="email" value={refForm.email} onChange={(e)=>setRefForm(v=>({ ...v, email: e.target.value }))} required className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70">Referral Code *</label>
                    <input value={refForm.code} onChange={(e)=>setRefForm(v=>({ ...v, code: e.target.value }))} required className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/70">Discount Percentage *</label>
                    <input type="number" min={1} max={100} value={refForm.discountPercent} onChange={(e)=>setRefForm(v=>({ ...v, discountPercent: Number(e.target.value) }))} required className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50" />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3">
                    <button type="submit" className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700">Create Code</button>
                    {refStatus && <span className="text-green-400 text-sm">{refStatus}</span>}
                    {error && <span className="text-red-400 text-sm">{error}</span>}
                  </div>
                </form>

                <h3 className="text-lg font-semibold mb-2">Existing Referral Codes</h3>
                {loading && <div className="text-white/70 text-sm">Loading...</div>}
                {referrals.length === 0 && !loading && <div className="text-white/60 text-sm">No referral codes yet.</div>}
                {referrals.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-white/70">
                          <th className="p-2">Agent</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Code</th>
                          <th className="p-2">Discount %</th>
                          <th className="p-2">Active</th>
                          <th className="p-2">Created</th>
                          <th className="p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map((r, idx)=> (
                          <tr key={idx} className="border-t border-white/10">
                            <td className="p-2">{r.agentName}</td>
                            <td className="p-2">{r.email}</td>
                            <td className="p-2 font-mono">{r.code}</td>
                            <td className="p-2">{r.discountPercent}%</td>
                            <td className="p-2">{String(r.active)}</td>
                            <td className="p-2 text-white/60">{new Date(r.createdAt).toLocaleString()}</td>
                            <td className="p-2">
                              <button onClick={()=>deleteReferral(r.code)} className="px-2 py-1 rounded bg-red-600/60 border border-red-600/40">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab==='applications' && (
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="flex items-center mb-4">
                  <h2 className="text-lg font-semibold">Internship Applications</h2>
                </div>
                {loading && <div className="text-white/70 text-sm">Loading...</div>}
                {error && <div className="text-red-400 text-sm">{error}</div>}
                {!loading && applications.length === 0 && (
                  <div className="text-white/60 text-sm">No applications yet.</div>
                )}
                {applications.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-white/70">
                          <th className="p-2">Date</th>
                          <th className="p-2">Name</th>
                          <th className="p-2">Email / Phone</th>
                          <th className="p-2">Education</th>
                          <th className="p-2">Domain / Project</th>
                          <th className="p-2">Txn ID</th>
                          <th className="p-2">Resume</th>
                          <th className="p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app, idx) => (
                          <tr key={idx} className="border-t border-white/10">
                            <td className="p-2 text-white/60">{new Date(app.createdAt).toLocaleString()}</td>
                            <td className="p-2">
                              <button 
                                onClick={() => setSelectedApplication(app)}
                                className="text-blue-400 hover:text-blue-300 hover:underline font-medium text-left"
                              >
                                {app.name}
                              </button>
                            </td>
                            <td className="p-2">
                              <div>{app.email}</div>
                              <div className="text-xs text-white/50">{app.phone}</div>
                            </td>
                            <td className="p-2">
                              <div>{app.college}</div>
                              {app.universityName && <div className="text-xs text-white/50">{app.universityName}</div>}
                              {app.currentCourse && <div className="text-xs text-white/50">{app.currentCourse}</div>}
                              <div className="text-xs text-white/50">{app.year}</div>
                            </td>
                            <td className="p-2">
                              <div>{app.domain}</div>
                              <div className="text-xs text-white/50">{app.project}</div>
                            </td>
                            <td className="p-2">
                              {(app.txnId || app._computedTxnId)
                                ? <span className="font-mono text-xs text-white/90">{app.txnId || app._computedTxnId}</span>
                                : <span className="text-white/30">—</span>}
                            </td>
                            <td className="p-2">
                              {app.resume ? (
                                <a 
                                  href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${app.resume}`} 
                                  download
                                  className="text-blue-400 hover:text-blue-300 underline"
                                >
                                  Download Resume
                                </a>
                              ) : (
                                <span className="text-white/30">N/A</span>
                              )}
                            </td>
                            <td className="p-2">
                              <button
                                onClick={()=>removeApplication(app.id)}
                                className="px-2 py-1 rounded bg-red-600/70 hover:bg-red-700 border border-red-600/50 text-white text-xs"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <button 
                onClick={() => setSelectedApplication(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="mb-6 border-b border-white/10 pb-4">
                <h3 className="text-2xl font-bold text-white">Application Details</h3>
                <p className="text-gray-400 text-sm mt-1">Submitted on {new Date(selectedApplication.createdAt).toLocaleString()}</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Full Name</label>
                    <p className="text-white text-lg font-medium">{selectedApplication.name}</p>
                  </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Transaction ID</label>
                        <p className="text-white text-lg font-mono">{selectedApplication.txnId || selectedApplication._computedTxnId || '—'}</p>
                      </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Status</label>
                    <span className="inline-block px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 uppercase tracking-wide">
                      {selectedApplication.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Email</label>
                    <p className="text-white text-lg">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Phone</label>
                    <p className="text-white text-lg">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">College</label>
                    <p className="text-white text-lg">{selectedApplication.college}</p>
                  </div>
                  {selectedApplication.universityName && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">University</label>
                      <p className="text-white text-lg">{selectedApplication.universityName}</p>
                    </div>
                  )}
                  {selectedApplication.currentCourse && (
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Current Course</label>
                      <p className="text-white text-lg">{selectedApplication.currentCourse}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Year of Study</label>
                    <p className="text-white text-lg">{selectedApplication.year}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Domain</label>
                    <p className="text-white text-lg">{selectedApplication.domain}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Project</label>
                    <p className="text-white text-lg">{selectedApplication.project}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Cover Letter</label>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedApplication.coverLetter || 'No cover letter provided.'}
                  </div>
                </div>

                {selectedApplication.resume && (
                  <div className="pt-6 border-t border-white/10 flex justify-end">
                    <a 
                      href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${selectedApplication.resume}`} 
                      download
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Resume
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div className="text-sm text-white/60">
                    Application ID: <span className="font-mono">{selectedApplication.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={()=>removeApplication(selectedApplication.id)}
                      className="px-3 py-2 rounded-lg bg-red-600/70 hover:bg-red-700 border border-red-600/40"
                    >
                      Delete Application
                    </button>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="px-3 py-2 rounded-lg border border-white/20"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
