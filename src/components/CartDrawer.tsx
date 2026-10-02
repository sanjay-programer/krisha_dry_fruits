import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/cart-context';
import { formatPrice } from '@/data';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeItem, updateCount, subtotal, totalItems } = useCart();

  const shipping = subtotal >= 2000 ? 0 : 80;
  const total = subtotal + shipping;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-brand-950/40 backdrop-blur-sm z-50 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-cream-50 shadow-2xl z-50 transition-transform duration-300 ease-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-700" />
            <h2 className="font-serif text-lg font-semibold text-brand-900">
              Your Cart {totalItems > 0 && <span className="text-brand-500">({totalItems})</span>}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-brand-50 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-brand-700" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-brand-300" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-brand-900 mb-1">Your cart is empty</h3>
              <p className="text-sm text-brand-500 mb-6">Add some premium cashews to get started.</p>
              <button onClick={onClose} className="btn-primary">
                Browse Cashews
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-white rounded-xl p-3 ring-1 ring-brand-100">
                  <img
                    src={item.image}
                    alt={`${item.grade} ${item.type}`}
                    className="w-20 h-20 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-brand-900">{item.grade} Cashews</h4>
                        <p className="text-xs text-brand-500">{item.type} · {item.quantity}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 text-brand-400 hover:text-red-500" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5 bg-cream-100 rounded-full p-1">
                        <button
                          onClick={() => updateCount(item.id, item.count - 1)}
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-brand-50 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3 text-brand-700" />
                        </button>
                        <span className="text-sm font-semibold text-brand-900 w-6 text-center">{item.count}</span>
                        <button
                          onClick={() => updateCount(item.id, item.count + 1)}
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center hover:bg-brand-50 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3 text-brand-700" />
                        </button>
                      </div>
                      <span className="font-serif text-sm font-bold text-brand-900">
                        {formatPrice(item.price * item.count)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-100 p-5 bg-cream-100">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-brand-600">Subtotal</span>
                <span className="font-medium text-brand-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-600">Shipping</span>
                <span className="font-medium text-brand-900">
                  {shipping === 0 ? <span className="text-forest-600">Free</span> : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-brand-500">
                  Add {formatPrice(2000 - subtotal)} more for free shipping
                </p>
              )}
              <div className="flex justify-between pt-2 border-t border-brand-200">
                <span className="font-serif text-base font-semibold text-brand-900">Total</span>
                <span className="font-serif text-xl font-bold text-brand-900">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={onCheckout}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-cream-50 transition-all hover:bg-brand-700 hover:shadow-lg active:scale-95"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
