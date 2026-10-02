import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Package, Truck, CheckCircle, Clock, XCircle, Save } from 'lucide-react';
import { adminApi } from '@/api';
import { formatPrice } from '@/data';

const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  packed: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-forest-100 text-forest-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_ICONS: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  packed: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const TIMELINE = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

export default function AdminOrderDetail({ orderId, onBack }: { orderId: string; onBack: () => void }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminApi.orders.get(orderId)
      .then((o) => {
        setOrder(o);
        setStatus(o.status);
        setTracking(o.trackingNumber || '');
        setNotes(o.notes || '');
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminApi.orders.update(orderId, { status, trackingNumber: tracking, notes });
      setOrder(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl">
        {[...Array(4)].map((_, i) => <div key={i} className="card h-32 animate-pulse bg-cream-200" />)}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-500">Order not found.</p>
        <button onClick={onBack} className="btn-primary mt-4">Back to Orders</button>
      </div>
    );
  }

  const timelineIdx = TIMELINE.indexOf(order.status);
  const StatusIcon = STATUS_ICONS[order.status] || Clock;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
      </div>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-brand-500 mb-1">Order Number</div>
            <div className="font-mono text-xl font-bold text-brand-900">{order.orderId}</div>
            <div className="text-xs text-brand-500 mt-1">
              Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              {' · '}
              {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium capitalize ${STATUS_COLORS[order.status]}`}>
              <StatusIcon className="w-4 h-4" />
              {order.status}
            </span>
            <div className="font-serif text-2xl font-bold text-brand-900">{formatPrice(order.total)}</div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {order.status !== 'cancelled' && (
        <div className="card p-6">
          <h2 className="font-serif text-base font-semibold text-brand-900 mb-5">Order Progress</h2>
          <div className="flex items-center">
            {TIMELINE.map((s, i) => {
              const done = i <= timelineIdx;
              const Icon = STATUS_ICONS[s] || Clock;
              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${done ? 'bg-brand-600' : 'bg-brand-100'}`}>
                      <Icon className={`w-4 h-4 ${done ? 'text-cream-50' : 'text-brand-400'}`} />
                    </div>
                    <span className={`text-[10px] font-medium mt-1.5 capitalize ${done ? 'text-brand-900' : 'text-brand-400'}`}>{s}</span>
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < timelineIdx ? 'bg-brand-600' : 'bg-brand-100'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: items + customer */}
        <div className="lg:col-span-3 space-y-6">
          {/* Order items */}
          <div className="card p-6">
            <h2 className="font-serif text-base font-semibold text-brand-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item._id || item.id} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.grade} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-brand-900">{item.grade} {item.type}</div>
                    <div className="text-xs text-brand-500">{item.quantity} · Qty {item.count}</div>
                  </div>
                  <div className="text-sm font-semibold text-brand-900 shrink-0">{formatPrice(item.price * item.count)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-brand-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-600">Subtotal</span>
                <span className="font-medium text-brand-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-600">Shipping</span>
                <span className="font-medium text-brand-900">
                  {order.shipping === 0 ? <span className="text-forest-600">Free</span> : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-brand-200">
                <span className="font-serif text-base font-semibold text-brand-900">Total</span>
                <span className="font-serif text-xl font-bold text-brand-900">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="card p-6">
            <h2 className="font-serif text-base font-semibold text-brand-900 mb-4">Customer Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-500">Name</span>
                <span className="font-medium text-brand-900">{order.customer?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-500">Email</span>
                <span className="font-medium text-brand-900">{order.customer?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-500">Phone</span>
                <span className="font-medium text-brand-900">{order.customer?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-500">Payment</span>
                <span className="font-medium text-brand-900 capitalize">{order.paymentMethod || 'cod'}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-brand-100">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
                <div className="text-sm text-brand-700 leading-relaxed">
                  <div>{order.customer?.address}</div>
                  <div>{order.customer?.city}, {order.customer?.state} — {order.customer?.pincode}</div>
                </div>
              </div>
              {order.customer?.notes && (
                <div className="mt-3 text-xs text-brand-500 bg-cream-100 rounded-lg p-3">
                  <span className="font-medium">Delivery note: </span>{order.customer.notes}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: update panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-5">
            <h2 className="font-serif text-base font-semibold text-brand-900">Update Order</h2>

            <div>
              <label className="text-xs font-medium text-brand-700 mb-1.5 block">Order Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field capitalize">
                {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-brand-700 mb-1.5 block">Tracking Number</label>
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                className="input-field"
                placeholder="e.g. DTDC1234567890"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-brand-700 mb-1.5 block">Internal Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Notes visible only to admin..."
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                saved ? 'bg-forest-600 text-cream-50' : 'bg-brand-600 text-cream-50 hover:bg-brand-700'
              }`}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>

          <div className="card p-5">
            <div className="text-xs text-brand-500 mb-1">Estimated Delivery</div>
            <div className="font-medium text-brand-900 text-sm">{order.estimatedDelivery}</div>
            {tracking && (
              <div className="mt-3 pt-3 border-t border-brand-100">
                <div className="text-xs text-brand-500 mb-1">Tracking Number</div>
                <div className="font-mono text-sm font-semibold text-brand-900">{tracking}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
