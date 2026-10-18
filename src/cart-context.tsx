import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CartItem, Product, CashewType, Quantity, VariantPrice } from './types';
import { useUser } from './auth';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, type: CashewType, quantity: Quantity, price: VariantPrice, image: string) => void;
  removeItem: (id: string) => void;
  updateCount: (id: string, count: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = 'krisha_cart_items_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, user, isLoaded } = useUser();
  const [items, setItems] = useState<CartItem[]>([]);

  // Synchronize cart with authentication state
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // User is a guest: do not store or retain guest products in local storage
      setItems([]);
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch {
        // ignore
      }
      return;
    }

    // Signed in user: retrieve user-specific cart from localStorage
    const userStorageKey = user?.id ? `krisha_cart_items_${user.id}` : CART_STORAGE_KEY;
    try {
      const saved = localStorage.getItem(userStorageKey);
      let currentItems: CartItem[] = [];
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) currentItems = parsed;
      }

      // Check for any pending cart item queued by a guest prior to signing in
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          const rawPending = window.sessionStorage.getItem('kdf_pending_cart_item');
          if (rawPending) {
            const pending = JSON.parse(rawPending);
            if (pending?.product && pending?.type && pending?.quantity && pending?.price) {
              const id = `${pending.product.id}-${pending.type}-${pending.quantity}`;
              const countToAdd = Math.max(1, Number(pending.count) || 1);
              const existingIdx = currentItems.findIndex((it) => it.id === id);
              if (existingIdx !== -1) {
                currentItems[existingIdx] = {
                  ...currentItems[existingIdx],
                  count: currentItems[existingIdx].count + countToAdd,
                };
              } else {
                currentItems.push({
                  id,
                  productId: pending.product.id,
                  grade: pending.product.grade,
                  type: pending.type,
                  quantity: pending.quantity,
                  price: pending.price.price,
                  image: pending.image || pending.product.image,
                  count: countToAdd,
                });
              }
              // Save updated cart immediately to localStorage
              localStorage.setItem(userStorageKey, JSON.stringify(currentItems));
              window.sessionStorage.removeItem('kdf_pending_cart_item');
            }
          }
        }
      } catch (err) {
        console.warn('Failed to ingest pending guest cart item:', err);
      }

      setItems(currentItems);
    } catch {
      setItems([]);
    }
  }, [isSignedIn, user?.id, isLoaded]);

  // Save cart items to local storage ONLY for signed-in users
  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      // Never save guest cart items to localStorage
      return;
    }
    const userStorageKey = user?.id ? `krisha_cart_items_${user.id}` : CART_STORAGE_KEY;
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, isSignedIn, user?.id, isLoaded]);

  const addItem = useCallback(
    (product: Product, type: CashewType, quantity: Quantity, price: VariantPrice, image: string) => {
      // Guests are NOT permitted to add items until they log in
      if (!isSignedIn) {
        return;
      }

      const id = `${product.id}-${type}-${quantity}`;
      setItems((prev) => {
        const existing = prev.find((item) => item.id === id);
        if (existing) {
          return prev.map((item) =>
            item.id === id ? { ...item, count: item.count + 1 } : item
          );
        }
        return [
          ...prev,
          {
            id,
            productId: product.id,
            grade: product.grade,
            type,
            quantity,
            price: price.price,
            image,
            count: 1,
          },
        ];
      });
    },
    [isSignedIn]
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateCount = useCallback((id: string, count: number) => {
    if (count <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, count } : item))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.count, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.count, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateCount, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
