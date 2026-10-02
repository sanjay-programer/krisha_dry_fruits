import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-brand-950 text-cream-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
                <span className="font-serif text-lg font-bold text-cream-50">K</span>
              </div>
              <div className="leading-none">
                <div className="font-serif text-lg font-bold text-cream-50">Krisha</div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-brand-300 font-medium">Dry Fruits</div>
              </div>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed mb-4">
              Premium cashews sourced from the finest farms along India's western coast. Hand-sorted, freshly packed, and delivered to your door.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-brand-800 hover:bg-brand-700 flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-brand-800 hover:bg-brand-700 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-brand-800 hover:bg-brand-700 flex items-center justify-center transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-serif text-base font-semibold text-cream-50 mb-4">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => onNavigate('products')} className="text-cream-300 hover:text-cream-50 transition-colors">All Cashews</button></li>
              <li><button onClick={() => onNavigate('grades')} className="text-cream-300 hover:text-cream-50 transition-colors">Grade Guide</button></li>
              <li><button onClick={() => onNavigate('products')} className="text-cream-300 hover:text-cream-50 transition-colors">Raw Cashews</button></li>
              <li><button onClick={() => onNavigate('products')} className="text-cream-300 hover:text-cream-50 transition-colors">Roasted & Salted</button></li>
              <li><button onClick={() => onNavigate('products')} className="text-cream-300 hover:text-cream-50 transition-colors">Gift Boxes</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-serif text-base font-semibold text-cream-50 mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => onNavigate('about')} className="text-cream-300 hover:text-cream-50 transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate('contact')} className="text-cream-300 hover:text-cream-50 transition-colors">Contact</button></li>
              <li><a href="#" className="text-cream-300 hover:text-cream-50 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="text-cream-300 hover:text-cream-50 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-cream-300 hover:text-cream-50 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-base font-semibold text-cream-50 mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-cream-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-400" />
                <span>123 Plantation Road, Margao, Goa 403601, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-brand-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-brand-400" />
                <span>care@krishadryfruits.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream-400">© 2026 Krisha Dry Fruits. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-cream-400">
            <Leaf className="w-3.5 h-3.5 text-forest-400" />
            <span>Sustainably sourced · Naturally premium</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
