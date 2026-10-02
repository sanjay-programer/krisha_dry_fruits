import { Star, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/data';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
}

export default function ProductCard({ product, onView }: ProductCardProps) {
  const minPrice = Math.min(...product.types.flatMap((t) => t.prices.map((p) => p.price)));

  return (
    <div
      onClick={() => onView(product)}
      className="card overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-cream-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-cream-50 shadow-sm">
            {product.badge}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 text-brand-500 fill-current" />
          <span className="text-xs font-semibold text-brand-900">{product.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-brand-500 tracking-wide">{product.grade}</span>
          <span className="text-brand-300">·</span>
          <span className="text-xs text-brand-500">{product.types.length} varieties</span>
        </div>
        <h3 className="font-serif text-lg font-semibold text-brand-900 mb-1">{product.name}</h3>
        <p className="text-sm text-brand-600 leading-relaxed mb-3 line-clamp-2">{product.tagline}</p>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-brand-500">From</span>
            <div className="font-serif text-xl font-bold text-brand-900">{formatPrice(minPrice)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:text-brand-800 transition-colors">
            View
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
