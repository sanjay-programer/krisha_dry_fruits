import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '@/api';
import { formatPrice } from '@/data';

const STATUSES = ['all', 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  packed: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-forest-100 text-forest-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders({ onViewOrder }: { onViewOrder: (id: string) => void }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    adminApi.orders
      .list({ status, search, page })
      .then((data) => {
        setOrders(data.orders || []);
        setTotalCount(data.totalCount || 0);
        setTotalPages(data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [status, search, page]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusChange = (s: string) => {
    setStatus(s);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-brand-950">Orders</h1>
        <p className="text-sm text-brand-500 mt-1">{totalCount} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by order ID, name, email, phone..."
            className="input-field pl-10"
          />
        </form>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="w-4 h-4 text-brand-400 shrink-0" />
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                status === s
                  ? 'bg-brand-600 text-cream-50'
                  : 'bg-white text-brand-600 border border-brand-200 hover:border-brand-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-100 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-brand-500 uppercase tracking-wide">Order ID</th>
                <th className="px-5 py-3 text-xs font-semibold text-brand-500 uppercase tracking-wide">Customer</th>
                <th className="px-5 py-3 text-xs font-semibold text-brand-500 uppercase tracking-wide hidden sm:table-cell">Items</th>
                <th className="px-5 py-3 text-xs font-semibold text-brand-500 uppercase tracking-wide">Total</th>
                <th className="px-5 py-3 text-xs font-semibold text-brand-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-brand-500 uppercase tracking-wide hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-cream-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-brand-400">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => onViewOrder(order._id)}
                    className="hover:bg-cream-50 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-brand-700">{order.orderId}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-brand-900 text-sm">{order.customer?.fullName}</div>
                      <div className="text-xs text-brand-500">{order.customer?.phone}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-brand-600 hidden sm:table-cell">
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-brand-900">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-brand-100 text-brand-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-brand-500 hidden md:table-cell">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-brand-100 bg-cream-50">
            <span className="text-xs text-brand-500">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-brand-200 hover:bg-brand-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-brand-600" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-brand-200 hover:bg-brand-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-brand-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
