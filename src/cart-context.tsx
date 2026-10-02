import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem, Product, CashewType, Quantity, VariantPrice } from './types';

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (product: Product, type: CashewType, quantity: Quantity, price: VariantPrice, image: string) => {
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
    []
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
