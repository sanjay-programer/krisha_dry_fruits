import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { AdminPage } from '../AdminApp';

interface AdminLayoutProps {
  page: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  children: ReactNode;
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
];

export default function AdminLayout({ page, onNavigate, onLogout, children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-brand-950 text-cream-100 w-64">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-800">
        <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
          <span className="font-serif text-base font-bold text-cream-50">K</span>
        </div>
        <div>
          <div className="font-serif text-base font-bold text-cream-50">Krisha Admin</div>
          <div className="text-[9px] tracking-[0.2em] uppercase text-brand-400">Management Panel</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = page === id || (page === 'order-detail' && id === 'orders');
          return (
            <button
              key={id}
              onClick={() => { onNavigate(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-600 text-cream-50'
                  : 'text-brand-300 hover:bg-brand-800 hover:text-cream-100'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-brand-400 hover:bg-brand-800 hover:text-cream-100 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-cream-100">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-brand-950/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-cream-50/95 backdrop-blur-md border-b border-brand-100 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-brand-50 transition-colors"
          >
            <Menu className="w-5 h-5 text-brand-700" />
          </button>
          <div className="font-serif text-base font-semibold text-brand-900 capitalize">
            {page === 'order-detail' ? 'Order Detail' : page}
          </div>
          <div className="text-xs text-brand-500 hidden sm:block">Krisha Dry Fruits · Admin</div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
