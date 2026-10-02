import { Truck, ShieldCheck, Leaf, Package } from 'lucide-react';

const FEATURES = [
  {
    icon: Leaf,
    title: 'Naturally Sourced',
    description: 'Direct from certified farms along the Goa & Karnataka coast. No preservatives, ever.',
  },
  {
    icon: Package,
    title: 'Freshly Packed',
    description: 'Every order is packed within 48 hours of processing to lock in peak freshness.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders above ₹2,000. Delivered across India in 3–5 days.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Promise',
    description: 'FSSAI certified and quality-checked. Not satisfied? 100% refund, no questions asked.',
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="card p-6 hover:shadow-md hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
              <f.icon className="w-6 h-6 text-brand-600" />
            </div>
            <h3 className="font-serif text-base font-semibold text-brand-900 mb-2">{f.title}</h3>
            <p className="text-sm text-brand-600 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
