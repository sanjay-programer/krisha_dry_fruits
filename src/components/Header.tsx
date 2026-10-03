import { ShoppingBag, Menu, X, Search, User as UserIcon, Package } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/cart-context';
import { SignInButton, UserButton, useUser } from '@clerk/react';
import { useSiteContent } from '@/site-content';
import { useCustomerOrders } from '@/orders-storage';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onOpenCart: () => void;
  onSearch: (query: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, onOpenCart, onSearch, currentPage }: HeaderProps) {
  const { totalItems } = useCart();
  const { isSignedIn } = useUser();
  const content = useSiteContent();
  const customerOrders = useCustomerOrders();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const navLink = (label: string, page: string) => {
    const active = currentPage === page;
    return (
      <button
        onClick={() => { onNavigate(page); setMobileOpen(false); }}
        className={`text-sm tracking-wide transition-all relative py-1 ${
          active
            ? 'text-brand-950 font-bold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-0.5 after:bg-brand-600 after:rounded-full'
            : 'text-brand-800/80 hover:text-brand-950 font-medium'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-brand-950 text-cream-100/90 text-center py-1.5 px-4 text-[11px] sm:text-xs font-medium tracking-wider flex items-center justify-center gap-3">
        <span>{content.announcement || 'Free pan-India shipping over ₹2,000 • Freshly hand-sorted & packed within 48h'}</span>
      </div>

      <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-brand-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Mobile Left: Hamburger Menu */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 -ml-2 rounded-xl text-brand-900 hover:bg-brand-100/60 transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6 stroke-[1.8]" />
              </button>
            </div>

            {/* Desktop Left: Logo */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={() => onNavigate('home')}
                className="group flex flex-col items-start text-left focus:outline-none"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl font-bold tracking-tight text-brand-950">Krisha</span>
                  <svg className="w-4 h-4 text-forest-600 -mt-2.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C8 6 6 10 7 14c1 4 4 6 7 6s6-3 6-7c0-4-3-8-8-11z" opacity="0.85" />
                    <path d="M10 6c-2 2-3 5-2 8" stroke="#fff" strokeWidth="1" fill="none" />
                  </svg>
                </div>
                <div className="flex items-center gap-2 -mt-1 text-[9px] uppercase tracking-[0.28em] font-semibold text-brand-600">
                  <span className="h-px w-3 bg-brand-300"></span>
                  <span>Dry Fruits</span>
                  <span className="h-px w-3 bg-brand-300"></span>
                </div>
              </button>
            </div>

            {/* Desktop Center: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLink('Home', 'home')}
              {navLink('Shop Cashews', 'products')}
              {navLink('Our Grades', 'grades')}
              {navLink('About Us', 'about')}
              {navLink('Contact', 'contact')}
            </nav>

            {/* Mobile Center: Logo */}
            <div className="lg:hidden flex-1 flex justify-center">
              <button
                onClick={() => onNavigate('home')}
                className="flex flex-col items-center focus:outline-none"
              >
                <div className="flex items-center gap-1">
                  <span className="font-serif text-2xl font-bold tracking-tight text-brand-950">Krisha</span>
                  <svg className="w-3.5 h-3.5 text-forest-600 -mt-2 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C8 6 6 10 7 14c1 4 4 6 7 6s6-3 6-7c0-4-3-8-8-11z" opacity="0.85" />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 -mt-1 text-[8.5px] uppercase tracking-[0.25em] font-semibold text-brand-600">
                  <span className="h-px w-2.5 bg-brand-300"></span>
                  <span>Dry Fruits</span>
                  <span className="h-px w-2.5 bg-brand-300"></span>
                </div>
              </button>
            </div>

            {/* Right Action Icons: Search, Orders, Cart, User */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-brand-900 hover:text-brand-600 hover:bg-brand-100/50 rounded-full transition-colors"
                aria-label="Search Cashews"
              >
                <Search className="w-5 h-5 stroke-[1.8]" />
              </button>

              {/* My Orders Quick Icon Button (Desktop + Mobile) */}
              <button
                onClick={() => onNavigate('myorders')}
                className={`relative p-2 rounded-full transition-colors ${
                  currentPage === 'myorders'
                    ? 'bg-brand-200/70 text-brand-950'
                    : 'text-brand-900 hover:text-brand-600 hover:bg-brand-100/50'
                }`}
                aria-label="My Orders"
                title="View My Orders"
              >
                <Package className="w-5 h-5 stroke-[1.8]" />
                {customerOrders.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold bg-amber-600 text-white flex items-center justify-center shadow-sm">
                    {customerOrders.length}
                  </span>
                )}
              </button>

              {/* Cart Button with Count Badge */}
              <button
                onClick={onOpenCart}
                className="relative p-2 text-brand-900 hover:text-brand-600 hover:bg-brand-100/50 rounded-full transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                <span className={`absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                  totalItems > 0 ? 'bg-brand-600 text-cream-50 scale-100 shadow-sm' : 'bg-brand-200 text-brand-800 scale-90'
                }`}>
                  {totalItems}
                </span>
              </button>

              {/* User Account / Clerk Auth */}
              {isSignedIn ? (
                <div className="flex items-center pl-1">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-7 h-7 sm:w-8 sm:h-8 ring-1 ring-brand-300/80',
                      },
                    }}
                  />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button
                    className="p-2 text-brand-900 hover:text-brand-600 hover:bg-brand-100/50 rounded-full transition-colors"
                    aria-label="Account Login"
                  >
                    <UserIcon className="w-5 h-5 stroke-[1.8]" />
                  </button>
                </SignInButton>
              )}
            </div>
          </div>

          {/* Expandable Search Input Bar */}
          {searchOpen && (
            <div className="py-3 border-t border-brand-200/40 animate-fade-in">
              <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search cashew grades (e.g. W180, Roasted, Honey Glazed)..."
                  className="w-full rounded-full border border-brand-300 bg-white/90 pl-11 pr-24 py-2.5 text-sm text-brand-950 placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 shadow-sm"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-700 text-cream-50 text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Luxury Mobile Slide-out Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-brand-950/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-cream-50 h-full shadow-2xl flex flex-col z-10 animate-slide-in-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-brand-200/60 bg-cream-100/50">
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-brand-950">Krisha</span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-brand-600">Dry Fruits</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-full text-brand-700 hover:bg-brand-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Nav Links */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-1">
              {[
                { label: 'Home', page: 'home' },
                { label: 'Shop Cashews', page: 'products' },
                { label: 'Our Grades Guide', page: 'grades' },
                { label: 'About Us', page: 'about' },
                { label: 'Contact Support', page: 'contact' },
              ].map(({ label, page }) => (
                <button
                  key={page}
                  onClick={() => { onNavigate(page); setMobileOpen(false); }}
                  className={`w-full text-left py-3 px-3 rounded-xl text-base transition-colors ${
                    currentPage === page
                      ? 'bg-brand-100 font-bold text-brand-900'
                      : 'text-brand-800 hover:bg-brand-100/60 font-medium'
                  }`}
                >
                  {label}
                </button>
              ))}

              <div className="pt-6 mt-6 border-t border-brand-200/60 space-y-3">
                <button
                  onClick={() => { onNavigate('myorders'); setMobileOpen(false); }}
                  className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-brand-800 hover:bg-brand-100/70 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-600" />
                    <span>Track My Orders</span>
                  </span>
                  {customerOrders.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      {customerOrders.length}
                    </span>
                  )}
                </button>

                {!isSignedIn && (
                  <SignInButton mode="modal">
                    <button className="btn-primary w-full py-2.5 text-sm">
                      Sign In / Register
                    </button>
                  </SignInButton>
                )}

                <div className="px-3 pt-4 text-xs text-brand-600/80 leading-relaxed">
                  <p className="font-medium text-brand-900">Krisha Dry Fruits</p>
                  <p>Hand-picked premium cashews directly sourced from Goa & Karnataka coast.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
