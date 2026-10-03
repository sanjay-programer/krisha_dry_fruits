import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { useSiteContent } from '@/site-content';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const content = useSiteContent();
  const { contact, social, footerBio } = content;

  return (
    <footer className="bg-brand-950 text-cream-200 border-t border-brand-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-cream-50">Krisha</span>
                <svg className="w-4 h-4 text-forest-400 -mt-2 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8 6 6 10 7 14c1 4 4 6 7 6s6-3 6-7c0-4-3-8-8-11z" opacity="0.85" />
                </svg>
              </div>
              <div className="flex items-center gap-2 -mt-1 text-[9px] uppercase tracking-[0.28em] font-semibold text-brand-300">
                <span className="h-px w-3 bg-brand-600"></span>
                <span>Dry Fruits</span>
                <span className="h-px w-3 bg-brand-600"></span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-cream-300/80 leading-relaxed font-normal">
              {footerBio}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-1">
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-brand-900 hover:bg-brand-800 text-cream-300 hover:text-cream-50 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-brand-900 hover:bg-brand-800 text-cream-300 hover:text-cream-50 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-brand-900 hover:bg-brand-800 text-cream-300 hover:text-cream-50 flex items-center justify-center transition-colors"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {social.whatsapp && (
                <a
                  href={social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-brand-900 hover:bg-brand-800 text-cream-300 hover:text-cream-50 flex items-center justify-center transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-cream-50 uppercase tracking-wider mb-4">
              Catalogue
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('products')} className="text-cream-300/80 hover:text-cream-50 transition-colors">
                  All Cashew Grades
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('grades')} className="text-cream-300/80 hover:text-cream-50 transition-colors">
                  Understanding Cashew Sizes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="text-cream-300/80 hover:text-cream-50 transition-colors">
                  Jumbo King W180
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="text-cream-300/80 hover:text-cream-50 transition-colors">
                  Roasted & Salted Cashews
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="text-cream-300/80 hover:text-cream-50 transition-colors">
                  Honey Glazed Gourmet Cashews
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Orders */}
          <div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-cream-50 uppercase tracking-wider mb-4">
              Customer Support
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => onNavigate('myorders')} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5">
                  <span>📦 Track My Orders</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-cream-300/80 hover:text-cream-50 transition-colors">
                  Our Coastal Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-cream-300/80 hover:text-cream-50 transition-colors">
                  Customer Care & Support
                </button>
              </li>
              <li>
                <span className="text-cream-400/80">Hours: {contact.hours}</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-cream-50 uppercase tracking-wider mb-4">
              Direct Contact
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-cream-300/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-400" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-brand-400" />
                <a href={`tel:${contact.phone}`} className="hover:text-cream-50 transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-brand-400" />
                <a href={`mailto:${contact.email}`} className="hover:text-cream-50 transition-colors">
                  {contact.email}
                </a>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-xl bg-brand-900/60 border border-brand-800 text-[11px] text-cream-300">
              <div className="font-semibold text-cream-100 flex items-center gap-1.5 mb-0.5">
                <Leaf className="w-3.5 h-3.5 text-forest-400" />
                <span>FSSAI Lic: {contact.fssaiNumber}</span>
              </div>
              <p>{contact.fssaiText}</p>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-6 border-t border-brand-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-400/80">
          <p>© {new Date().getFullYear()} Krisha Dry Fruits. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Goa & Karnataka Harvest</span>
            <span>•</span>
            <span>Pan-India Air Dispatch</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
