import { Star, Quote, CheckCircle2 } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Ananya Sharma',
    location: 'Mumbai, Maharashtra',
    gradeBought: 'W180 Jumbo King',
    rating: 5,
    text: 'The W180 grade is simply the finest cashew I have ever tasted. Plump, naturally sweet, and exceptionally fresh. Krisha has become my default brand for festival gifting and family snacks.',
    avatar: 'A',
  },
  {
    name: 'Rajesh Iyer',
    location: 'Bengaluru, Karnataka',
    gradeBought: 'W240 Roasted & Salted',
    rating: 5,
    text: 'I ordered the roasted & salted W240 for my parents — they were amazed by the uniform crunch and clean flavor. The eco packaging is top-tier and delivery reached within 3 days.',
    avatar: 'R',
  },
  {
    name: 'Priya Nair',
    location: 'Kochi, Kerala',
    gradeBought: 'W210 Honey Glazed',
    rating: 5,
    text: 'The honey glazed cashews are an exquisite indulgence. Delicate sweetness without being syrupy, retaining the deep cashew crunch. An absolute masterpiece with evening coffee.',
    avatar: 'P',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-cream-100/50 via-cream-200/40 to-cream-100/80 py-14 sm:py-20 border-t border-brand-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-md px-3.5 py-1 mb-3.5 border border-brand-200/70 shadow-sm">
            <Star className="w-3 h-3 text-gold-500 fill-current" />
            <span className="text-[11px] font-bold text-brand-900 tracking-wide">
              Trusted by 3,700+ Gourmet Connoisseurs
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-950 tracking-tight mb-2.5">
            Loved for Freshness & Craft
          </h2>
          <p className="text-xs sm:text-sm text-brand-700/80 leading-relaxed font-normal">
            Real feedback from cashew enthusiasts, home chefs, and connoisseurs across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="card card-hover p-6 sm:p-7 bg-white/90 border border-brand-200/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < t.rating ? 'text-gold-500 fill-current' : 'text-brand-200'}`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-brand-300/60" />
                </div>

                <p className="text-xs sm:text-sm text-brand-900/90 leading-relaxed mb-6 font-normal">
                  "{t.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-brand-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-800 text-cream-50 flex items-center justify-center font-serif text-sm font-bold shadow-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-950 flex items-center gap-1">
                      <span>{t.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                    </div>
                    <div className="text-[11px] text-brand-500">{t.location}</div>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded-md">
                  {t.gradeBought}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
