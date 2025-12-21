import React, { useMemo, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const currencyFormat = (n: number) => `${n.toLocaleString('en-IN')} rupees`;

const CheckoutPage: React.FC = () => {
  const { items, removeFromCart, setQuantity, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneCountry: 'IND',
    phone: '',
    city: '',
    state: '',
    zip: '',
    description: '',
  });

  const shipping = 0;
  // taxes removed
  const taxes = 0;
  const total = subtotal + shipping;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student.email) {
      alert('Please enter student email to receive project delivery.');
      return;
    }
    alert(`Order placed!\nStudent: ${student.firstName} ${student.lastName}\nEmail: ${student.email}\nTotal: ${currencyFormat(total)}\nWe will deliver the project to the same email.`);
    // Clear cart for demo
    clearCart();
  };

  const cartEmpty = items.length === 0;

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Student Details */}
          <section className="lg:col-span-8 order-2 lg:order-2">
            <form onSubmit={onSubmit} className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-4">Student Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/70">First Name*</label>
                  <input className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" value={student.firstName} onChange={(e)=>setStudent(s=>({ ...s, firstName: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-white/70">Last Name*</label>
                  <input className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" value={student.lastName} onChange={(e)=>setStudent(s=>({ ...s, lastName: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-white/70">Email*</label>
                  <input type="email" className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="student@example.com" value={student.email} onChange={(e)=>setStudent(s=>({ ...s, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-white/70">Phone number</label>
                  <div className="mt-1 flex gap-2">
                    <select className="w-28 rounded-lg bg-white/10 border border-white/20 px-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option className="bg-gray-900 text-white">IND</option>
                    </select>
                    <input className="flex-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91 9876543210" value={student.phone} onChange={(e)=>setStudent(s=>({ ...s, phone: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-white/70">City*</label>
                  <input className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" value={student.city} onChange={(e)=>setStudent(s=>({ ...s, city: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-white/70">State*</label>
                  <input className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" value={student.state} onChange={(e)=>setStudent(s=>({ ...s, state: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-white/70">Zip Code*</label>
                  <input className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" value={student.zip} onChange={(e)=>setStudent(s=>({ ...s, zip: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-white/70">Description*</label>
                  <input className="mt-1 w-full rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter a description..." value={student.description} onChange={(e)=>setStudent(s=>({ ...s, description: e.target.value }))} />
                </div>
              </div>

              {/* Delivery removed */}

              <div className="mt-6">
                <button type="button" onClick={()=>navigate('/payment', { state: { student } })} disabled={cartEmpty} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 disabled:opacity-60">Continue to Payment</button>
              </div>
            </form>
          </section>

          {/* Right: Cart */}
          <aside className="lg:col-span-4 order-1 lg:order-1">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold">Your Cart</h2>

              <div className="mt-4 space-y-4">
                {items.length === 0 && (
                  <div className="text-white/60 text-sm">Your cart is empty.</div>
                )}
                {items.map(item => (
                  <div key={`${item.slug}-${item.certificate}`} className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-lg object-cover border border-white/20" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-white/60">{item.certificate === 'without' ? 'Without certificate' : 'With certificate'}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm">{currencyFormat(item.price)}</div>
                      <button onClick={()=>removeFromCart(item.slug, item.certificate)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount */}
              <div className="mt-6 flex gap-2">
                <input className="flex-1 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Discount code" />
                <button className="rounded-lg border border-white/20 px-4 py-2 bg-white/10">Apply</button>
              </div>

              {/* Totals */}
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between text-white/80"><span>Subtotal</span><span>{currencyFormat(subtotal)}</span></div>
                <div className="flex justify-between text-white/80"><span>Shipping</span><span>{currencyFormat(shipping)}</span></div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-semibold"><span>Total</span><span>{currencyFormat(total)}</span></div>
              </div>

              <button onClick={onSubmit} disabled={cartEmpty} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 disabled:opacity-60">Continue to Payment</button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;