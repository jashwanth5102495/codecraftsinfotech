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
      const res = await api.getApplications();
      if (res.success && res.data){
        setApplications(res.data as any[]);
      } else {
        setError(res.error || 'Failed to fetch applications');
      }
    } catch (err){
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
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
                          <th className="p-2">Resume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app, idx) => (
                          <tr key={idx} className="border-t border-white/10">
                            <td className="p-2 text-white/60">{new Date(app.createdAt).toLocaleString()}</td>
                            <td className="p-2">{app.name}</td>
                            <td className="p-2">
                              <div>{app.email}</div>
                              <div className="text-xs text-white/50">{app.phone}</div>
                            </td>
                            <td className="p-2">
                              <div>{app.college}</div>
                              <div className="text-xs text-white/50">{app.year}</div>
                            </td>
                            <td className="p-2">
                              <div>{app.domain}</div>
                              <div className="text-xs text-white/50">{app.project}</div>
                            </td>
                            <td className="p-2">
                              {app.resume ? (
                                <a 
                                  href={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${app.resume}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 underline"
                                >
                                  Download Resume
                                </a>
                              ) : (
                                <span className="text-white/30">N/A</span>
                              )}
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
      </div>
    </main>
  );
};

export default AdminPage;