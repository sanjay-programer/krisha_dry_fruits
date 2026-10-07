import { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, ArrowLeft, AlertCircle, LogOut, KeyRound, Sparkles } from 'lucide-react';
import { useUser, useClerk, SignInButton } from '@clerk/react';
import { isAdminAuthorized, addAdminEmail } from '@/admin-auth';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import AdminContent from './components/AdminContent';
import AdminProducts from './components/AdminProducts';
import AdminOrders from './components/AdminOrders';
import AdminOrderDetail from './components/AdminOrderDetail';
import AdminAdmins from './components/AdminAdmins';

export type AdminPage = 'dashboard' | 'content' | 'products' | 'orders' | 'order-detail' | 'admins';

const ADMIN_SECRET = import.meta.env.VITE_ADMIN_PASSKEY || import.meta.env.VITE_ADMIN_SECRET || '';

export default function AdminApp() {
  const { isSignedIn, user, isLoaded } = useUser();
  const clerk = useClerk();

  const [passkeyAuthed, setPasskeyAuthed] = useState(() => sessionStorage.getItem('admin_passkey_auth') === 'true');
  const [password, setPassword] = useState('');
  const [passkeyError, setPasskeyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPasskeyFallback, setShowPasskeyFallback] = useState(false);
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isGoogleAdmin = Boolean(isSignedIn && userEmail && isAdminAuthorized(userEmail));
  const isAuthed = isGoogleAdmin || passkeyAuthed;

  const handlePasskeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const entered = password.trim();
    if (!entered) {
      setPasskeyError('Please enter the security passkey.');
      return;
    }

    // 1. Direct match if frontend env var is provided
    if (ADMIN_SECRET && entered === ADMIN_SECRET) {
      sessionStorage.setItem('admin_passkey_auth', 'true');
      sessionStorage.setItem('admin_passkey_value', entered);
      if (userEmail) {
        addAdminEmail(userEmail);
      }
      setPasskeyAuthed(true);
      return;
    }

    // 2. Live verification against the Netlify Function backend
    setIsVerifying(true);
    setPasskeyError('');
    try {
      const endpoint =
        (import.meta.env.DEV ? 'http://localhost:8888/.netlify/functions' : '/api') +
        '/admin-products?action=verify';
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${entered}` },
      });
      if (res.ok) {
        sessionStorage.setItem('admin_passkey_auth', 'true');
        sessionStorage.setItem('admin_passkey_value', entered);
        if (userEmail) {
          addAdminEmail(userEmail);
        }
        setPasskeyAuthed(true);
      } else {
        setPasskeyError('Incorrect secret key. Please check your credentials.');
      }
    } catch {
      setPasskeyError('Authentication failed. Please verify your connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('admin_passkey_auth');
    sessionStorage.removeItem('admin_passkey_value');
    setPasskeyAuthed(false);
    if (isSignedIn) {
      await clerk.signOut();
    }
  };

  // Case 1: Signed in with a Google account that is NOT whitelisted
  if (isLoaded && isSignedIn && !isGoogleAdmin && !passkeyAuthed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-950 via-[#180d07] to-brand-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-red-100 text-center animate-scale-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h1 className="font-serif text-2xl font-bold text-brand-950 mb-2">
            Access Restricted
          </h1>
          <p className="text-xs text-brand-600 mb-6 leading-relaxed">
            You are signed in as <span className="font-bold text-brand-900">{userEmail}</span>, but this account does not have administrator privileges for Krisha Dry Fruits.
          </p>

          <div className="p-4 rounded-2xl bg-cream-50 border border-brand-200 text-xs text-brand-700 text-left space-y-2 mb-6">
            <div className="font-bold text-brand-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              <span>Security Policy:</span>
            </div>
            <p>
              Only authorized administrator Google Accounts can access this executive management panel.
            </p>
          </div>

          {/* Quick Unlock via Passkey */}
          <div className="mb-6 p-4 rounded-2xl bg-brand-50/80 border border-brand-200 text-left space-y-3">
            <p className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-brand-700" />
              <span>Are you the store administrator?</span>
            </p>
            <p className="text-[11px] text-brand-600 leading-snug">
              Enter the master passkey to unlock access and authorize this Google account.
            </p>
            <form onSubmit={handlePasskeyLogin} className="space-y-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter security passkey..."
                className="input-field text-xs py-2 bg-white"
              />
              {passkeyError && <p className="text-[11px] text-red-600 font-medium">{passkeyError}</p>}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full btn-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isVerifying ? 'Verifying...' : 'Unlock & Authorize This Account'}
              </button>
            </form>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => clerk.signOut()}
              className="w-full btn-secondary py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch Google Account</span>
            </button>

            <a
              href="/"
              className="w-full text-center py-2 text-xs font-medium text-brand-600 hover:text-brand-900 block"
            >
              Return to Public Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Not authenticated (neither Google authorized nor passkey)
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-950 via-[#180d07] to-brand-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-forest-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 animate-scale-in">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-brand-800 to-brand-600 text-cream-50 flex items-center justify-center shadow-lg shadow-brand-950/20">
              <span className="font-serif text-2xl font-bold">K</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-brand-950 tracking-tight">
              Krisha Dry Fruits
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-500 mt-1">
              Executive Management Panel
            </p>
          </div>

          {/* Primary Authentication: Google Sign-in */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-xs text-brand-600 mb-4 leading-relaxed">
                Sign in with your authorized Google account to manage products, customer orders, and storefront content.
              </p>

              <SignInButton mode="modal">
                <button className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white border-2 border-brand-200 hover:border-brand-500 text-brand-950 text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 group">
                  {/* Google 'G' Logo SVG */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign In with Google</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-brand-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>
            </div>

            {/* Fallback Passkey Accordion */}
            <div className="pt-4 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setShowPasskeyFallback(!showPasskeyFallback)}
                className="text-xs text-brand-500 hover:text-brand-900 transition-colors flex items-center justify-center gap-1.5 w-full"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{showPasskeyFallback ? 'Hide Security Passkey Form' : 'Emergency Security Passkey Access'}</span>
              </button>

              {showPasskeyFallback && (
                <form onSubmit={handlePasskeyLogin} className="space-y-3 mt-3 animate-fade-in">
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPasskeyError(''); }}
                      className="w-full rounded-xl border border-brand-200 bg-cream-50/60 pl-10 pr-4 py-2.5 text-xs text-brand-950 placeholder-brand-400 focus:outline-none focus:border-brand-600 focus:bg-white"
                      placeholder="Enter emergency passkey"
                    />
                    <Lock className="w-3.5 h-3.5 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  {passkeyError && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                      {passkeyError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full btn-secondary py-2 text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    <span>{isVerifying ? 'Verifying Passkey...' : 'Authenticate Passkey'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-brand-100 flex items-center justify-between text-xs text-brand-500">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 hover:text-brand-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </a>
            <span className="flex items-center gap-1 text-[11px] text-forest-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OAuth 2.0 Encrypted</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Authenticated Admin
  const navigate = (p: AdminPage, orderId?: string) => {
    setPage(p);
    if (orderId) setSelectedOrderId(orderId);
  };

  return (
    <AdminLayout
      page={page}
      onNavigate={(p) => navigate(p as AdminPage)}
      onLogout={handleLogout}
      userEmail={userEmail || (passkeyAuthed ? 'Root Passkey Session' : null)}
    >
      {page === 'dashboard' && <AdminDashboard onNavigate={navigate} />}
      {page === 'content' && <AdminContent />}
      {page === 'products' && <AdminProducts />}
      {page === 'orders' && <AdminOrders onViewOrder={(id) => navigate('order-detail', id)} />}
      {page === 'order-detail' && selectedOrderId && (
        <AdminOrderDetail orderId={selectedOrderId} onBack={() => navigate('orders')} />
      )}
      {page === 'admins' && <AdminAdmins />}
    </AdminLayout>
  );
}