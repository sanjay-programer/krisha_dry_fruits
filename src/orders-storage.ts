import { useState, useEffect } from 'react';
import type { OrderDetails } from './types';

const ORDERS_KEY = 'kdf_customer_orders_v1';
const ORDERS_EVENT = 'kdf_customer_orders_change';

export function getCustomerOrders(): OrderDetails[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveCustomerOrder(order: OrderDetails): void {
  try {
    const existing = getCustomerOrders();
    const enrichedOrder: any = {
      ...order,
      status: (order as any).status || 'pending',
      createdAt: (order as any).createdAt || order.placedAt || new Date().toISOString(),
    };
    // Prepend new order, deduplicate by orderId
    const filtered = existing.filter((o) => o.orderId !== order.orderId);
    const updated = [enrichedOrder, ...filtered];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(ORDERS_EVENT, { detail: updated }));
  } catch (err) {
    console.error('Failed to save order locally', err);
  }
}

export function updateCustomerOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
  notes?: string
): void {
  try {
    const existing = getCustomerOrders();
    const updated = existing.map((o: any) => {
      if (o.orderId === orderId || o._id === orderId || o.id === orderId) {
        return {
          ...o,
          status,
          ...(trackingNumber !== undefined ? { trackingNumber } : {}),
          ...(notes !== undefined ? { notes } : {}),
        };
      }
      return o;
    });
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(ORDERS_EVENT, { detail: updated }));
  } catch (err) {
    console.error('Failed to update order status locally', err);
  }
}

export function deleteCustomerOrder(orderId: string): void {
  try {
    const existing = getCustomerOrders();
    const updated = existing.filter((o: any) => o.orderId !== orderId && o._id !== orderId && o.id !== orderId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(ORDERS_EVENT, { detail: updated }));
  } catch (err) {
    console.error('Failed to delete order locally', err);
  }
}

export function useCustomerOrders(): OrderDetails[] {
  const [orders, setOrders] = useState<OrderDetails[]>(getCustomerOrders);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<OrderDetails[]>;
      if (customEvent.detail) {
        setOrders(customEvent.detail);
      } else {
        setOrders(getCustomerOrders());
      }
    };
    window.addEventListener(ORDERS_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(ORDERS_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return orders;
}
