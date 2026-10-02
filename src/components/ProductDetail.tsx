import { useState, useMemo } from 'react';
import { Star, ArrowLeft, Plus, Minus, Check, ShoppingBag, Truck, ShieldCheck, ChevronRight, ArrowRight } from 'lucide-react';
import type { Product, CashewType, Quantity } from '@/types';
import { formatPrice } from '@/data';
import { useCart } from '@/cart-context';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onNavigate: (page: string) => void;
  onOpenCart: () => void;
}

const TYPE_LABELS: Record<string, { emoji: string; short: string }> = {
  'Raw':              { emoji: '○', short: 'Raw' },
  'Roasted':          { emoji: '●', short: 'Roasted' },
  'Roasted & Salted': { emoji: '◆', short: 'Salted' },
  'Spiced':           { emoji: '▲', short: 'Spiced' },
  'Honey Glazed':     { emoji: '★', short: 'Honey' },
};

export default function ProductDetail({ product, onBack, onNavigate, onOpenCart }: ProductDetailProps) {
  const { addItem } = useCart();

  const firstType = product.types[0];
  const [selectedType, setSelectedType] = useState<CashewType>(firstType?.type as CashewType);
  const [selectedQty, setSelectedQty] = useState<Quantity>(firstType?.prices[0]?.quantity as Quantity);
  const [activeImage, setActiveImage] = useState(0);
  const [count, setCount] = useState(1);
  const [added, setAdded] = useState(false);

  const currentType = useMemo(
    () => product.types.find((t) => t.type === selectedType) ?? firstType,
    [product, selectedType]
  );

  const currentPrice = useMemo(
    () => currentType?.prices.find((p) => p.quantity === selectedQty) ?? currentType?.prices[0],
    [currentType, selectedQty]
  );

  // When type changes, reset qty to first available for that type
  const handleTypeChange = (type: CashewType) => {
    setSelectedType(type);
    const t = product.types.find((t) => t.type === type);
    if (t?.prices[0]) setSelectedQty(t.prices[0].quantity as Quantity);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!currentType || !currentPrice) return;
    for (let i = 0; i < count; i++) {
      addItem(product, selectedType, selectedQty, currentPrice, currentType.image || product.image);
    }
    setAdded(true);
  };

  const gallery = [
    ...(currentType?.image ? [currentType.image] : []),
    ...product.gallery.filter(Boolean),
  ];
  if (gallery.length === 0) gallery.push(product.image);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-brand-500 mb-6">
        <button onClick={onBack} className="hover:text-brand-800 transition-colors">Shop</button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-800 font-medium">{product.name}</span>
      </div>

      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to all cashews
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-brand-100 mb-4">
            <img
              src={gallery[activeImage] || product.image}
              alt={`${product.name} - ${selectedType}`}
              className="w-full h-[440px] object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-cream-50 shadow-sm">
                {product.badge}
              </span>
            </div>
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`rounded-xl overflow-hidden ring-2 transition-all ${activeImage === i ? 'ring-brand-500' : 'ring-transparent hover:ring-brand-200'}`}
                >
                  <img src={img} alt="" className="w-full h-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-brand-500 tracking-wide">{product.grade}</span>
            {product.rating > 0 && (
              <>
                <span className="text-brand-300">·</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-brand-500 fill-current" />
                  <span className="text-sm font-medium text-brand-700">{product.rating}</span>
                  {product.reviewCount > 0 && <span className="text-sm text-brand-500">({product.reviewCount} reviews)</span>}
                </div>
              </>
            )}
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-brand-950 mb-2">{product.name}</h1>
          <p className="text-lg text-brand-600 mb-4">{product.tagline}</p>
          <p className="text-sm text-brand-700 leading-relaxed mb-6">{product.longDescription || product.description}</p>

          {/* Type selection */}
          {product.types.length > 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-brand-900">Choose a variety</label>
                <span className="text-xs text-brand-500">{product.types.length} options</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.types.map((t) => {
                  const label = TYPE_LABELS[t.type] ?? { emoji: '●', short: t.type };
                  return (
                    <button
                      key={t.type}
                      onClick={() => handleTypeChange(t.type as CashewType)}
                      className={`relative flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 transition-all ${
                        selectedType === t.type ? 'border-brand-500 bg-brand-50' : 'border-brand-200 bg-cream-50 hover:border-brand-300'
                      }`}
                    >
                      {selectedType === t.type && <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-brand-600" />}
                      <span className="text-lg text-brand-600">{label.emoji}</span>
                      <span className="text-xs font-medium text-brand-800 text-center">{label.short}</span>
                    </button>
                  );
                })}
              </div>
              {currentType?.description && (
                <p className="mt-3 text-sm text-brand-600 leading-relaxed bg-cream-100 rounded-xl p-3">
                  {currentType.description}
                </p>
              )}
            </div>
          )}

          {/* Weight / quantity selection */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-brand-900 mb-3 block">Select weight</label>
            <div className="flex flex-wrap gap-2">
              {currentType?.prices.map((p) => (
                <button
                  key={p.quantity}
                  onClick={() => { setSelectedQty(p.quantity as Quantity); setAdded(false); }}
                  className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                    selectedQty === p.quantity
                      ? 'border-brand-500 bg-brand-50 text-brand-900'
                      : 'border-brand-200 bg-cream-50 text-brand-700 hover:border-brand-300'
                  }`}
                >
                  {p.quantity}
                  <span className="block text-xs font-normal text-brand-500 mt-0.5">{formatPrice(p.price)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price & Add to cart */}
          <div className="bg-cream-100 rounded-2xl p-5 mb-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <span className="text-xs text-brand-500">Price for {selectedQty}</span>
                <div className="font-serif text-3xl font-bold text-brand-900">{currentPrice ? formatPrice(currentPrice.price * count) : '—'}</div>
                {count > 1 && <div className="text-xs text-brand-500 mt-0.5">{formatPrice(currentPrice?.price ?? 0)} × {count}</div>}
              </div>
              <div className="text-right">
                <div className="text-xs text-brand-500">Inclusive of all taxes</div>
                <div className="text-xs text-forest-600 font-medium">Free shipping over ₹2,000</div>
              </div>
            </div>

            {/* How many packets */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-brand-700">How many packets?</span>
              <div className="flex items-center gap-3 bg-white rounded-full px-2 py-1 ring-1 ring-brand-200">
                <button
                  onClick={() => setCount((c) => Math.max(1, c - 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-brand-50 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5 text-brand-700" />
                </button>
                <span className="text-sm font-bold text-brand-900 w-6 text-center">{count}</span>
                <button
                  onClick={() => setCount((c) => c + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-brand-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-700" />
                </button>
              </div>
            </div>

            {!added ? (
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-cream-50 transition-all hover:bg-brand-700 hover:shadow-lg active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
            ) : (
              <div className="space-y-2">
                <div className="w-full flex items-center justify-center gap-2 rounded-full bg-forest-600 px-6 py-3.5 text-sm font-semibold text-cream-50">
                  <Check className="w-4 h-4" />
                  Added to cart!
                </div>
                <button
                  onClick={() => onNavigate('checkout')}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-950 px-6 py-3.5 text-sm font-semibold text-cream-50 transition-all hover:bg-brand-800 active:scale-95"
                >
                  Go to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenCart}
                  className="w-full text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors py-1"
                >
                  View cart →
                </button>
              </div>
            )}
          </div>

          {/* Info badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 rounded-xl bg-cream-100 p-3">
              <Truck className="w-5 h-5 text-forest-600 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-brand-900">Fast Delivery</div>
                <div className="text-xs text-brand-500">3–5 business days</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-cream-100 p-3">
              <ShieldCheck className="w-5 h-5 text-forest-600 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-brand-900">Quality Promise</div>
                <div className="text-xs text-brand-500">100% refund guarantee</div>
              </div>
            </div>
          </div>

          {/* Product specs */}
          <div className="mt-6 pt-6 border-t border-brand-100 space-y-3">
            {product.origin && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-500">Origin</span>
                <span className="font-medium text-brand-900">{product.origin}</span>
              </div>
            )}
            {product.gradeDescription && (
              <div className="flex justify-between text-sm">
                <span className="text-brand-500">Grade Size</span>
                <span className="font-medium text-brand-900">{product.gradeDescription}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-brand-500">Available Varieties</span>
              <span className="font-medium text-brand-900">{product.types.map((t) => t.type).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
