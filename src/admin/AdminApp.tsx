import { useState } from 'react';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import AdminOrderDetail from './components/AdminOrderDetail';

export type AdminPage = 'dashboard' | 'products' | 'orders' | 'order-detail';

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'krisha_admin_2024';

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      sessionStorage.setItem('admin_auth', 'true');
      setAuthed(true);
    } else {
      setError('Incorrect password');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <div className="card p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-cream-50">K</span>
            </div>
            <div>
              <div className="font-serif text-lg font-bold text-brand-900">Krisha Admin</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-brand-500">Management Panel</div>
            </div>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-brand-700 mb-1.5 block">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="input-field"
                placeholder="Enter admin password"
                autoFocus
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
            <button type="submit" className="btn-primary w-full">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  const navigate = (p: AdminPage, orderId?: string) => {
    setPage(p);
    if (orderId) setSelectedOrderId(orderId);
  };

  return (
    <AdminLayout
      page={page}
      onNavigate={(p) => navigate(p as AdminPage)}
      onLogout={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false); }}
    >
      {page === 'dashboard' && <AdminDashboard onNavigate={navigate} />}
      {page === 'products' && <AdminProducts />}
      {page === 'orders' && <AdminOrders onViewOrder={(id) => navigate('order-detail', id)} />}
      {page === 'order-detail' && selectedOrderId && (
        <AdminOrderDetail orderId={selectedOrderId} onBack={() => navigate('orders')} />
      )}
    </AdminLayout>
  );
}
