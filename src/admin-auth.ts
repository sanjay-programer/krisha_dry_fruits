import { useState, useEffect } from 'react';

export const PERMANENT_ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string) || '';

const ADMIN_STORAGE_KEY = 'kdf_admin_whitelist_v1';
const ADMIN_EVENT = 'kdf_admin_whitelist_change';

export function getAdminWhitelist(): string[] {
  if (typeof window === 'undefined') return PERMANENT_ADMIN_EMAIL ? [PERMANENT_ADMIN_EMAIL.toLowerCase()] : [];
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) {
      return PERMANENT_ADMIN_EMAIL ? [PERMANENT_ADMIN_EMAIL.toLowerCase()] : [];
    }
    const list: string[] = JSON.parse(raw);
    const normalized = list.map((e) => e.trim().toLowerCase()).filter(Boolean);
    if (PERMANENT_ADMIN_EMAIL && !normalized.includes(PERMANENT_ADMIN_EMAIL.toLowerCase())) {
      normalized.unshift(PERMANENT_ADMIN_EMAIL.toLowerCase());
    }
    return Array.from(new Set(normalized));
  } catch {
    return PERMANENT_ADMIN_EMAIL ? [PERMANENT_ADMIN_EMAIL.toLowerCase()] : [];
  }
}

export function isPermanentAdmin(email?: string | null): boolean {
  if (!email || !PERMANENT_ADMIN_EMAIL) return false;
  return email.trim().toLowerCase() === PERMANENT_ADMIN_EMAIL.toLowerCase();
}

export function isAdminAuthorized(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  const list = getAdminWhitelist();
  // If no whitelist is defined yet, allow the administrator
  if (list.length === 0) return true;
  return list.includes(cleanEmail);
}

export function addAdminEmail(email: string): { success: boolean; message: string } {
  const clean = email.trim().toLowerCase();
  if (!clean || !clean.includes('@') || !clean.includes('.')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  const current = getAdminWhitelist();
  if (current.includes(clean)) {
    return { success: false, message: 'This email is already an authorized administrator.' };
  }
  const updated = [...current, clean];
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(ADMIN_EVENT, { detail: updated }));
  return { success: true, message: `Admin privileges granted to ${clean}.` };
}

export function removeAdminEmail(email: string): { success: boolean; message: string } {
  const clean = email.trim().toLowerCase();
  const current = getAdminWhitelist();
  const updated = current.filter((e) => e !== clean);
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(ADMIN_EVENT, { detail: updated }));
  return { success: true, message: `Admin privileges revoked for ${clean}.` };
}

export function useAdminWhitelist() {
  const [emails, setEmails] = useState<string[]>(getAdminWhitelist);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<string[]>;
      if (custom.detail) {
        setEmails(custom.detail);
      } else {
        setEmails(getAdminWhitelist());
      }
    };
    window.addEventListener(ADMIN_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(ADMIN_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return {
    emails,
    addAdmin: addAdminEmail,
    removeAdmin: removeAdminEmail,
    permanentAdmin: PERMANENT_ADMIN_EMAIL,
  };
}
