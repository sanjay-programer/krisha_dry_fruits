import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Ananya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'The W180 grade is simply the best cashew I have ever tasted. Plump, creamy, and absolutely fresh. Krisha has become my go-to for gifting.',
    avatar: 'A',
  },
  {
    name: 'Rajesh Iyer',
    location: 'Bengaluru',
    rating: 5,
    text: 'I ordered the roasted & salted W240 for my father — he loved them. The packaging was excellent and delivery was quick. Highly recommended.',
    avatar: 'R',
  },
  {
    name: 'Priya Nair',
    location: 'Kochi',
    rating: 4,
    text: 'The honey glazed cashews are a unique treat. Sweet, crunchy, and not too heavy. Perfect with evening tea. Will reorder for sure.',
    avatar: 'P',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-cream-200/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 mb-4">
            <Star className="w-3.5 h-3.5 text-brand-600 fill-current" />
            <span className="text-xs font-semibold text-brand-700 tracking-wide">Loved by 3,700+ customers</span>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-950 mb-3">What our customers say</h2>
          <p className="text-brand-600 max-w-xl mx-auto">Real reviews from real cashew lovers across India.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card p-6 hover:shadow-md">
              <Quote className="w-8 h-8 text-brand-200 mb-4" />
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'text-brand-500 fill-current' : 'text-brand-200'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-brand-700 leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
                  <span className="text-sm font-semibold text-cream-50">{t.avatar}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-brand-900">{t.name}</div>
                  <div className="text-xs text-brand-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
