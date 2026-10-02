import { ArrowRight, ShieldCheck, Truck, Award } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onLearnMore: () => void;
}

export default function Hero({ onShopNow, onLearnMore }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream-100 via-cream-200 to-brand-50">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 mb-6">
              <Award className="w-3.5 h-3.5 text-brand-600" />
              <span className="text-xs font-semibold text-brand-700 tracking-wide">India's Premium Cashew Brand</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-950 leading-[1.1] mb-6">
              Cashews, crafted to <span className="text-brand-600">perfection</span>.
            </h1>
            <p className="text-base lg:text-lg text-brand-700 leading-relaxed mb-8 max-w-lg">
              From the sun-drenched coast of Goa to your home — hand-sorted, freshly packed, and available in five premium grades. Taste the difference that quality makes.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="btn-primary group">
                Shop Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={onLearnMore} className="btn-outline">
                Explore Grades
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-brand-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-forest-600" />
                <span className="text-xs font-medium text-brand-700">FSSAI Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-forest-600" />
                <span className="text-xs font-medium text-brand-700">Pan-India Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-forest-600" />
                <span className="text-xs font-medium text-brand-700">100% Natural</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-brand-200">
              <img
                src="https://images.pexels.com/photos/9615877/pexels-photo-9615877.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Premium cashew nuts in a decorative silver bowl"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 to-transparent" />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-4 lg:-left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 max-w-[240px]">
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                <span className="font-serif text-xl font-bold text-brand-600">5</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-brand-900">Premium Grades</div>
                <div className="text-xs text-brand-500">From W180 to W450</div>
              </div>
            </div>
            {/* Floating rating card */}
            <div className="absolute -top-4 -right-4 lg:-right-8 bg-white rounded-2xl shadow-xl p-4">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-brand-500 fill-current" viewBox="0 0 20 20">
                    <path d="M10 1l2.928 5.934 6.553.953-4.74 4.622 1.119 6.526L10 16.96l-5.86 3.075 1.12-6.526L.52 7.887l6.552-.953z" />
                  </svg>
                ))}
              </div>
              <div className="text-xs font-medium text-brand-700">4.8 · 3,700+ reviews</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
