import { useEffect, useState } from 'react';
import { ShoppingBag, Package, Truck, CheckCircle, IndianRupee, TrendingUp, Clock } from 'lucide-react';
import { adminApi } from '@/api';
import { formatPrice } from '@/data';
import type { AdminPage } from '../AdminApp';

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  packed: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-forest-100 text-forest-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard({ onNavigate }: { onNavigate: (p: AdminPage, id?: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.orders.stats(), adminApi.orders.list({ page: 1 })])
      .then(([s, o]) => {
        setStats(s);
        setRecentOrders(o.orders?.slice(0, 8) || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-brand-100 text-brand-700' },
        { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: 'bg-amber-100 text-amber-700' },
        { label: 'Shipped', value: stats.shippedOrders, icon: Truck, color: 'bg-indigo-100 text-indigo-700' },
        { label: 'Delivered', value: stats.deliveredOrders, icon: CheckCircle, color: 'bg-forest-100 text-forest-700' },
        { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: IndianRupee, color: 'bg-brand-100 text-brand-700', wide: true },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-brand-950">Dashboard</h1>
        <p className="text-sm text-brand-500 mt-1">Welcome back. Here's what's happening with Krisha Dry Fruits.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 h-24 animate-pulse bg-cream-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className={`card p-5 ${s.wide ? 'col-span-2 lg:col-span-4' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-brand-500 mb-1">{s.label}</p>
                  <p className="font-serif text-2xl font-bold text-brand-950">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-100">
          <h2 className="font-serif text-base font-semibold text-brand-900">Recent Orders</h2>
          <button
            onClick={() => onNavigate('orders')}
            className="text-xs font-medium text-brand-600 hover:text-brand-800 transition-colors"
          >
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-100 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-brand-500 uppercase tracking-wide">Order ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-brand-500 uppercase tracking-wide">Customer</th>
                <th className="px-6 py-3 text-xs font-semibold text-brand-500 uppercase tracking-wide hidden sm:table-cell">Total</th>
                <th className="px-6 py-3 text-xs font-semibold text-brand-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-brand-500 uppercase tracking-wide hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {recentOrders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => onNavigate('order-detail', order._id)}
                  className="hover:bg-cream-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-3.5 font-mono text-xs font-semibold text-brand-700">{order.orderId}</td>
                  <td className="px-6 py-3.5">
                    <div className="font-medium text-brand-900">{order.customer?.fullName}</div>
                    <div className="text-xs text-brand-500">{order.customer?.city}</div>
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-brand-900 hidden sm:table-cell">{formatPrice(order.total)}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-brand-100 text-brand-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-brand-500 hidden md:table-cell">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-brand-400">No orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
