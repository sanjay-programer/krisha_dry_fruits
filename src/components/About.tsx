import { Leaf, Award, Heart, Users } from 'lucide-react';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-cream-200 to-brand-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 mb-6">
            <Leaf className="w-3.5 h-3.5 text-brand-600" />
            <span className="text-xs font-semibold text-brand-700 tracking-wide">Our Story</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-brand-950 mb-6">
            From coast to <span className="text-brand-600">kitchen</span>
          </h1>
          <p className="text-lg text-brand-700 leading-relaxed">
            Krisha Dry Fruits was born from a simple belief: that the finest cashews deserve to be shared with the world. What began as a family-run farm in Goa has grown into one of India's most trusted premium cashew brands.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://images.pexels.com/photos/11135641/pexels-photo-11135641.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Dry fruits market display"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-brand-950 mb-4">Three generations of craft</h2>
            <p className="text-brand-700 leading-relaxed mb-4">
              Our story starts in the 1970s, when our grandfather began cultivating cashew trees along the sun-drenched coast of Goa. He believed in patience — letting nature take its course, harvesting at the right moment, and processing by hand.
            </p>
            <p className="text-brand-700 leading-relaxed mb-4">
              Today, we honour that legacy. We work directly with farmers across Goa and Karnataka, ensuring fair prices and sustainable practices. Every batch is hand-sorted, quality-checked, and packed within 48 hours of processing.
            </p>
            <p className="text-brand-700 leading-relaxed">
              From our family to yours — we promise only the finest.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream-200/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-brand-950 mb-3">What we stand for</h2>
            <p className="text-brand-600">The values that guide every cashew we sell.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: 'Sustainability', desc: 'We work with nature, not against it. Eco-friendly farming and minimal-waste packaging.' },
              { icon: Award, title: 'Quality First', desc: 'Every batch is hand-sorted and quality-checked. We never compromise on standards.' },
              { icon: Heart, title: 'Fair Trade', desc: 'Direct relationships with farmers ensure fair prices and support local communities.' },
              { icon: Users, title: 'Customer Care', desc: 'From order to delivery, we treat every customer like family. 100% satisfaction guaranteed.' },
            ].map((v) => (
              <div key={v.title} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-serif text-base font-semibold text-brand-900 mb-2">{v.title}</h3>
                <p className="text-sm text-brand-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { num: '50+', label: 'Years of farming' },
            { num: '3,700+', label: 'Happy customers' },
            { num: '5', label: 'Premium grades' },
            { num: '48h', label: 'Fresh packing' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-serif text-4xl lg:text-5xl font-bold text-brand-600 mb-1">{s.num}</div>
              <div className="text-sm text-brand-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
