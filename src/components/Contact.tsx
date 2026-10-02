import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-brand-950 mb-3">Get in Touch</h1>
        <p className="text-brand-600 max-w-lg mx-auto">
          Questions about our cashews, your order, or anything else? We would love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-4">
          {[
            { icon: MapPin, title: 'Visit Us', lines: ['123 Plantation Road', 'Margao, Goa 403601'] },
            { icon: Phone, title: 'Call Us', lines: ['+91 98765 43210', 'Mon–Sat, 9am–6pm IST'] },
            { icon: Mail, title: 'Email Us', lines: ['care@krishadryfruits.in', 'We reply within 24 hours'] },
          ].map((c) => (
            <div key={c.title} className="card p-5">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center mb-3">
                <c.icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-serif text-base font-semibold text-brand-900 mb-1">{c.title}</h3>
              {c.lines.map((l) => (
                <p key={l} className="text-sm text-brand-600">{l}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-serif text-xl font-semibold text-brand-900 mb-5">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-brand-700 mb-1.5 block">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-700 mb-1.5 block">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Message</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field resize-none"
                  rows={5}
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all active:scale-95 ${
                  sent ? 'bg-forest-600 text-cream-50' : 'bg-brand-600 text-cream-50 hover:bg-brand-700 hover:shadow-lg'
                }`}
              >
                {sent ? (
                  <>
                    <Check className="w-4 h-4" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
