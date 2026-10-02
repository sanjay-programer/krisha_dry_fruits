import type { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onView: (product: Product) => void;
  title?: string;
  subtitle?: string;
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-56 bg-cream-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-cream-200 rounded w-1/3" />
        <div className="h-5 bg-cream-200 rounded w-2/3" />
        <div className="h-3 bg-cream-200 rounded w-full" />
        <div className="h-3 bg-cream-200 rounded w-4/5" />
        <div className="flex justify-between items-end pt-2">
          <div className="h-6 bg-cream-200 rounded w-1/4" />
          <div className="h-4 bg-cream-200 rounded w-1/5" />
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, onView, title, subtitle, loading }: ProductGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {title && (
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-950 mb-3">{title}</h2>
          {subtitle && <p className="text-brand-600 max-w-xl mx-auto">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          : products.length === 0
            ? (
              <div className="col-span-3 text-center py-16 text-brand-400">
                No products available yet.
              </div>
            )
            : products.map((p) => (
              <ProductCard key={(p as any)._id || p.id} product={p} onView={onView} />
            ))
        }
      </div>
    </section>
  );
}
