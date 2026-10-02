import { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useUser, SignInButton } from '@clerk/react';
import { adminApi } from '@/api';
import { formatPrice } from '@/data';

interface MyOrdersProps {
  onBack: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  pending:   { label: 'Pending',   icon: Clock,        color: 'text-yellow-600 bg-yellow-50' },
  confirmed: { label: 'Confirmed', icon: Package,      color: 'text-blue-600 bg-blue-50' },
  packed:    { label: 'Packed',    icon: Package,      color: 'text-indigo-600 bg-indigo-50' },
  shipped:   { label: 'Shipped',   icon: Truck,        color: 'text-purple-600 bg-purple-50' },
  delivered: { label: 'Delivered', icon: CheckCircle,  color: 'text-green-600 bg-green-50' },
  cancelled: { label: 'Cancelled', icon: XCircle,      color: 'text-red-600 bg-red-50' },
};

export default function MyOrders({ onBack }: MyOrdersProps) {
  const { isSignedIn, user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;
    setLoading(true);
    adminApi.orders.list({ search: email })
      .then((res) => setOrders(res.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isSignedIn, user]);

  if (!isSignedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Package className="w-12 h-12 text-brand-300 mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold text-brand-900 mb-2">Sign in to view your orders</h1>
        <p className="text-brand-600 mb-6">Track all your Krisha Dry Fruits orders in one place.</p>
        <SignInButton mode="modal">
          <button className="btn-primary">Sign In</button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="font-serif text-3xl font-bold text-brand-950 mb-8">My Orders</h1>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-brand-100 rounded w-1/3 mb-3" />
              <div className="h-3 bg-brand-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-brand-200 mx-auto mb-4" />
          <p className="text-brand-600 font-medium">No orders yet.</p>
          <p className="text-brand-400 text-sm mt-1">Your orders will appear here once you place one.</p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            const isOpen = expanded === order._id;
            return (
              <div key={order._id} className="card overflow-hidden">
                <button
                  className="w-full text-left p-5 flex items-center gap-4 hover:bg-cream-50 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                >
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-brand-900">Order #{order.orderId}</div>
                    <div className="text-xs text-brand-500 mt-0.5">{order.placedAt} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-sm font-bold text-brand-900 shrink-0">{formatPrice(order.total)}</div>
                  <span className="text-brand-400 text-xs">{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-brand-100 px-5 pb-5 pt-4 space-y-4">
                    {/* Items */}
                    <div className="space-y-3">
                      {order.items?.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <img src={item.image} alt={item.grade} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-brand-900">{item.grade} {item.type}</div>
                            <div className="text-xs text-brand-500">{item.quantity} × {item.count}</div>
                          </div>
                          <div className="text-sm font-semibold text-brand-900">{formatPrice(item.price * item.count)}</div>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-brand-100 pt-3 space-y-1 text-sm">
                      <div className="flex justify-between text-brand-600">
                        <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-brand-600">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(order.shipping)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-brand-900 pt-1 border-t border-brand-100">
                        <span>Total</span><span>{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Delivery address */}
                    <div className="text-xs text-brand-500 bg-cream-100 rounded-lg p-3">
                      <span className="font-medium text-brand-700">Deliver to: </span>
                      {order.customer?.address}, {order.customer?.city}, {order.customer?.state} – {order.customer?.pincode}
                    </div>

                    {/* Tracking */}
                    {order.trackingNumber && (
                      <div className="text-xs text-brand-600 font-medium">
                        Tracking: <span className="font-bold">{order.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
