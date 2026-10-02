import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/cart-context';
import { SignInButton, UserButton, useUser } from '@clerk/react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onOpenCart: () => void;
  onSearch: (query: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, onOpenCart, onSearch, currentPage }: HeaderProps) {
  const { totalItems } = useCart();
  const { isSignedIn } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const navLink = (label: string, page: string) => {
    const active = currentPage === page;
    return (
      <button
        onClick={() => { onNavigate(page); setMobileOpen(false); }}
        className={`text-sm font-medium transition-colors relative ${
          active
            ? 'text-brand-900 font-bold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-brand-600 after:rounded-full'
            : 'text-brand-500 hover:text-brand-900'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      <div className="bg-brand-950 text-cream-100 text-center py-2 px-4 text-xs font-medium tracking-wide">
        Free shipping on orders above ₹2,000 · Freshly packed within 48 hours of processing
      </div>

      <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-brand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group">
              <img
                src="/krisha_dry_fruits_logo.jpeg"
                alt="Krisha Dry Fruits"
                className="w-10 h-10 rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow"
              />
              <div className="text-left leading-none">
                <div className="font-serif text-lg lg:text-xl font-bold text-brand-900">Krisha</div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-brand-500 font-medium">Dry Fruits</div>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLink('Home', 'home')}
              {navLink('Shop Cashews', 'products')}
              {navLink('Our Grades', 'grades')}
              {navLink('About Us', 'about')}
              {navLink('Contact', 'contact')}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full hover:bg-brand-50 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-brand-700" />
              </button>

              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-full hover:bg-brand-50 transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-brand-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-brand-600 text-cream-50 text-[10px] font-bold flex items-center justify-center animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Clerk auth */}
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('myorders')}
                    className="hidden sm:flex items-center gap-1.5 rounded-full border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
                  >
                    My Orders
                  </button>
                  <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="hidden sm:flex items-center gap-1.5 rounded-full border border-brand-300 px-4 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-brand-50 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5 text-brand-700" /> : <Menu className="w-5 h-5 text-brand-700" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4 animate-fade-in">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search cashew grades, types..."
                  className="w-full rounded-full border border-brand-200 bg-cream-50 pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
              </form>
            </div>
          )}

          {/* Mobile nav */}
          {mobileOpen && (
            <nav className="lg:hidden flex flex-col gap-4 pb-6 pt-2 animate-fade-in">
              {navLink('Home', 'home')}
              {navLink('Shop Cashews', 'products')}
              {navLink('Our Grades', 'grades')}
              {navLink('About Us', 'about')}
              {navLink('Contact', 'contact')}
              {isSignedIn ? (
                <button onClick={() => { onNavigate('myorders'); setMobileOpen(false); }} className="text-sm font-medium text-brand-700 text-left">My Orders</button>
              ) : (
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-brand-700 text-left">Sign In</button>
                </SignInButton>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
