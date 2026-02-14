import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import api from '@/services/api';

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState<'card'|'razorpay'|'upi'|'gpay'|'qr'>('qr');
  const [txnId, setTxnId] = useState('');
  const [txnError, setTxnError] = useState<string | null>(null);
const [popup, setPopup] = useState<{title: string; message: string} | null>(null);
  // Referral state
  const [referralCode, setReferralCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isApplyingCode, setIsApplyingCode] = useState<boolean>(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [agentName, setAgentName] = useState<string | null>(null);

// Support overrides from navigation state (for Internship flow)
const state = (location.state as any) || {};
const overrideItems = Array.isArray(state.items) ? state.items : null;
const overrideSubtotal = typeof state.subtotal === 'number' ? state.subtotal : null;
// Cart totals to keep Payment consistent with Checkout
const { items: cartItems, subtotal: cartSubtotal } = useCart();
const items = overrideItems ?? cartItems;
const subtotal = overrideSubtotal ?? cartSubtotal;
const originalSubtotal = items.reduce((sum: number, it: any) => sum + (it.originalPrice ?? it.price ?? 0) * (it.quantity ?? 1), 0);
const shipping = 0;
const taxes = 0;
const discountAmount = Math.round(subtotal * (discountPercent > 0 ? discountPercent : 0) / 100);
const total = subtotal - discountAmount + shipping;
  const student = state.student || null;
  const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const Icon: React.FC<{ id: typeof method }>=({ id })=>{
    const base = 'w-4 h-4';
    switch(id){
      case 'card':
        return (
          <svg viewBox="0 0 24 24" className={base} fill="currentColor" aria-hidden>
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
            <rect x="4" y="9" width="16" height="2" />
            <rect x="4" y="13" width="6" height="2" />
          </svg>
        );
      case 'razorpay':
        return (
          <svg viewBox="0 0 24 24" className={base} fill="currentColor" aria-hidden>
            <path d="M7 4l10 4-10 12z" />
          </svg>
        );
      case 'upi':
        return (
          <svg viewBox="0 0 24 24" className={base} aria-hidden>
            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor">₹</text>
          </svg>
        );
      case 'gpay':
        return (
          <svg viewBox="0 0 24 24" className={base} aria-hidden>
            <circle cx="12" cy="12" r="10" fill="currentColor" />
          </svg>
        );
      case 'qr':
        return (
          <svg viewBox="0 0 24 24" className={base} fill="currentColor" aria-hidden>
            <rect x="3" y="3" width="6" height="6" />
            <rect x="15" y="3" width="6" height="6" />
            <rect x="3" y="15" width="6" height="6" />
            <rect x="11" y="11" width="4" height="4" />
            <rect x="16" y="12" width="2" height="2" />
            <rect x="12" y="16" width="6" height="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  const TabButton: React.FC<{id: typeof method, label: string}> = ({ id, label }) => {
    const suspended = id !== 'qr';
    return (
      <button
        onClick={()=>setMethod(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm mr-2 ${method===id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'} ${suspended ? 'opacity-60' : ''}`}
      >
        <Icon id={id} />
        <span>{label}</span>
        {/* Suspended badge removed as requested */}
      </button>
    );
  };

  const backTo = state?.context === 'internship_application' ? '/internship' : '/checkout';
  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 grid grid-cols-12 gap-6">
        {/* Left Summary */}
        <aside className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl p-6 min-h-[560px] bg-gradient-to-br from-fuchsia-600 via-pink-500 to-violet-700 lg:sticky lg:top-24">
            <button onClick={()=>navigate(backTo)} className="text-white/80 text-sm flex items-center gap-2 mb-6">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M15 18l-6-6 6-6"/></svg>
              Back
            </button>
            <div className="text-3xl font-bold flex items-center gap-3">
              <span>{formatINR(total)}</span>
              {originalSubtotal > total && (
                <span className="text-white/80 text-base line-through">{formatINR(originalSubtotal)}</span>
              )}
            </div>
            <div className="text-white/80 text-xs mt-1">Review and confirm your payment below.</div>

            <div className="mt-8 bg-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-black/40 flex items-center justify-center font-semibold">S</div>
                <div>
                  <div className="text-sm font-semibold">Your Cart</div>
                  <div className="text-xs text-white/80">{items.length} item(s)</div>
                </div>
                <div className="ml-auto text-sm">{formatINR(subtotal)}</div>
              </div>
              {/* Includes information for internship flow */}
              {Array.isArray(items) && items.length === 1 && items[0]?.includes && (
                <div className="mt-3 text-xs text-white/90">
                  <div className="opacity-80">Includes:</div>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {items[0].includes.map((txt: string, i: number)=>(
                      <li key={i}>{txt}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Referral code (optional)"
                  value={referralCode}
                  onChange={(e)=>{ setReferralCode(e.target.value); if (applyError) setApplyError(null); }}
                />
                <button
                  onClick={async ()=>{
                    const code = referralCode.trim();
                    if (!code) { setDiscountPercent(0); setAgentName(null); return; }
                    setIsApplyingCode(true);
                    setApplyError(null);
                    try {
                      const res = await api.validateReferral(code);
                      if (res.success && res.data && (res.data as any).valid) {
                        const dp = (res.data as any).discountPercent || 0;
                        const an = (res.data as any).agentName || null;
                        setDiscountPercent(dp);
                        setAgentName(an);
                      } else {
                        setDiscountPercent(0);
                        setAgentName(null);
                        setApplyError('Invalid referral code');
                      }
                    } catch (err) {
                      setApplyError('Error validating code. Please try again.');
                    } finally {
                      setIsApplyingCode(false);
                    }
                  }}
                  className="px-3 py-2 rounded-md bg-black/40 border border-white/20"
                  disabled={isApplyingCode}
                >
                  {isApplyingCode ? 'Applying…' : 'Apply'}
                </button>
              </div>
              {applyError && <div className="text-xs text-red-200 mt-2">{applyError}</div>}
              {agentName && discountPercent>0 && (
                <div className="text-xs text-green-200 mt-2">Code applied via {agentName} ({discountPercent}% off)</div>
              )}
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center"><span className="text-white/80">Subtotal</span><span className="ml-auto">{formatINR(subtotal)}</span></div>
                {discountPercent>0 && (
                  <div className="flex items-center"><span className="text-green-300">Discount ({discountPercent}%)</span><span className="ml-auto text-green-300">- {formatINR(discountAmount)}</span></div>
                )}
                <div className="flex items-center font-semibold"><span>Total due today</span><span className="ml-auto">{formatINR(total)}</span></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Payment */}
        <section className="col-span-12 lg:col-span-7">
          <div className="rounded-xl border border-white/10 p-6 bg-black">
            {/* Billing frequency removed */}

            <h2 className="text-lg font-semibold mb-3">Payment method</h2>
            <div className="flex flex-wrap mb-6">
              <TabButton id="card" label="Credit or Debit card" />
              <TabButton id="razorpay" label="Razorpay" />
              <TabButton id="upi" label="UPI" />
              <TabButton id="gpay" label="Google Pay" />
              <TabButton id="qr" label="Instant QR Payment" />
            </div>

            {method !== 'qr' && (
              <div>
                <h3 className="text-md font-semibold mb-4">Payment information</h3>
                {/* Blurred content with overlay indicating suspension */}
                <div className="relative">
                  <div className="filter blur-sm pointer-events-none">
                    <div className="text-xs text-white/60 mb-3">VISA · MasterCard · AMEX · Discover</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-white/80">Card number</label>
                        <input className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div>
                        <label className="text-sm text-white/80">Expiry date</label>
                        <input className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="text-sm text-white/80">CVC</label>
                        <input className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none" placeholder="3-digit code" />
                      </div>
                      <div>
                        <label className="text-sm text-white/80">Name on card</label>
                        <input className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none" placeholder="e.g. John Doe" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm text-white/80">Address</label>
                        <input className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none" placeholder="Street address or PO box" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm text-white/80">Apt., suite, unit, building (Optional)</label>
                        <input className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-sm text-white/80">City</label>
                        <input className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-sm text-white/80">State</label>
                        <input className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm text-white/80">Country</label>
                        <select className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white focus:outline-none">
                          <option className="bg-black text-white">Select country</option>
                        </select>
                      </div>
                    </div>
                    <button className="mt-6 w-full bg-white/10 text-white rounded-md py-3 border border-white/20 cursor-not-allowed" disabled>Suspended</button>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white">Suspended</div>
                  </div>
                </div>
              </div>
            )}

            {method === 'qr' && (
              <div>
                <h3 className="text-md font-semibold mb-4">Instant QR Payment</h3>
                <div className="flex flex-col items-center gap-4">
                  <img src="/qr.png" alt="QR Code" className="w-56 h-56 rounded-md border border-white/20" />
                  <div className="w-full">
                    <label className="text-sm text-white/80">Transaction ID</label>
                    <input
                      className="mt-1 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Enter transaction/reference ID"
                      value={txnId}
                      onChange={(e)=>{ setTxnId(e.target.value); if (txnError) setTxnError(null); }}
                    />
                    {txnError && <div className="text-xs text-red-400 mt-1">{txnError}</div>}
                  </div>
                  <div className="text-sm text-white/80">Scan the QR with any UPI app to pay instantly.</div>
                  <button
                    onClick={async ()=>{
                      const id = txnId.trim();
                      if(!id){ setTxnError('Please enter the transaction ID.'); return; }
                      setTxnError(null);
                      try {
                        const payload = {
                          txnId: id,
                          student: { ...(student || { note: 'No student details provided' }), referralCode: referralCode.trim() || null, discountPercent },
                          items: items.map((i: any) => ({ title: i.title, price: i.price, quantity: i.quantity, certificate: i.certificate })),
                          subtotal,
                          taxes, // now 0
                          total,
                        };
                        const res = await api.createPurchase(payload);
                        if(res.success){
                          setPopup({
                            title: 'Payment Confirmed',
                            message: `Transaction ID ${id}. We will email your project and internship details.`,
                          });
                        } else {
                          setPopup({
                            title: 'Purchase Failed',
                            message: res.error || 'Failed to record purchase. Please try again.',
                          });
                        }
                      } catch (err){
                        setPopup({
                          title: 'Error',
                          message: 'Error recording purchase. Please try again.',
                        });
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3"
                  >
                    Confirm Payment
                  </button>
                  <button onClick={()=>navigate('/checkout')} className="w-full border border-white/20 text-white rounded-md py-3 hover:bg-white/5">Back to Checkout</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      {popup && (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-neutral-900 border border-white/20 rounded-xl p-6 w-[90%] max-w-md text-white">
      <h3 className="text-lg font-semibold mb-2">{popup.title}</h3>
      <p className="text-sm text-white/80 mb-4">{popup.message}</p>
      <div className="flex justify-end gap-2">
      <button className="px-3 py-2 border border-white/20 rounded-md" onClick={()=>setPopup(null)}>Close</button>
      <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md" onClick={()=>{ setPopup(null); navigate('/'); }}>Go Home</button>
      </div>
      </div>
      </div>
      )}
    </main>
  );
};

export default PaymentPage;
