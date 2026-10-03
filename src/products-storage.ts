import { useState, useEffect } from 'react';
import type { Product } from './types';
import { PRODUCTS } from './data';

const PRODUCTS_STORAGE_KEY = 'kdf_products_catalog_v2';
const PRODUCTS_EVENT = 'kdf_products_catalog_change';

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      // Initialize with default products
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(PRODUCTS));
      return PRODUCTS;
    }
    const list: Product[] = JSON.parse(raw);
    if (Array.isArray(list) && list.length > 0) {
      return list;
    }
    return PRODUCTS;
  } catch {
    return PRODUCTS;
  }
}

export function saveStoredProducts(list: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(PRODUCTS_EVENT, { detail: list }));
  } catch (err) {
    console.error('Failed to save products to localStorage', err);
  }
}

/**
 * Merges server products into local storage without wiping out locally created or updated products.
 */
export function syncWithServerProducts(serverList: Product[]): Product[] {
  if (!Array.isArray(serverList) || serverList.length === 0) return getStoredProducts();
  const local = getStoredProducts();
  const map = new Map<string, Product>();

  // 1. Put server products
  serverList.forEach((p) => {
    const key = (p._id || p.id || `${p.grade}-${p.name}`).toLowerCase();
    map.set(key, { ...p, active: p.active !== false });
  });

  // 2. Overlay local products (so locally created/edited ones always take priority!)
  local.forEach((p) => {
    const key = (p._id || p.id || `${p.grade}-${p.name}`).toLowerCase();
    map.set(key, { ...p, active: p.active !== false });
  });

  const merged = Array.from(map.values());
  saveStoredProducts(merged);
  return merged;
}

export function addStoredProduct(productData: any): Product {
  const current = getStoredProducts();
  const grade = (productData.grade || 'W180').trim().toUpperCase();
  const id = productData.id || productData._id || `grade-${grade.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
  
  const newProduct: Product = {
    ...productData,
    _id: productData._id || id,
    id,
    grade,
    name: productData.name || `Jumbo King ${grade}`,
    tagline: productData.tagline || `Finest grade ${grade} cashews`,
    description: productData.description || `Premium quality ${grade} hand-picked cashews.`,
    longDescription: productData.longDescription || productData.description || '',
    origin: productData.origin || 'Goa Coastal Belt, India',
    gradeDescription: productData.gradeDescription || `Cashew grade ${grade} specifications`,
    image: productData.image || '/cashew_single_nut.jpg',
    gallery: Array.isArray(productData.gallery) && productData.gallery.length > 0 ? productData.gallery : ['/hero_cashew_bowl.jpg'],
    rating: productData.rating || 4.8,
    reviewCount: productData.reviewCount || 120,
    badge: productData.badge || 'Premium',
    active: productData.active !== false,
    types: productData.types || [],
  };

  const updated = [newProduct, ...current.filter((p) => p.id !== id && p._id !== newProduct._id)];
  saveStoredProducts(updated);
  return newProduct;
}

export function updateStoredProduct(id: string, updates: any): Product[] {
  const current = getStoredProducts();
  const updated = current.map((p) => {
    if (p._id === id || p.id === id) {
      return {
        ...p,
        ...updates,
        grade: (updates.grade || p.grade).trim().toUpperCase(),
        active: updates.active !== undefined ? updates.active : p.active !== false,
      };
    }
    return p;
  });
  saveStoredProducts(updated);
  return updated;
}

export function deleteStoredProduct(id: string): Product[] {
  const current = getStoredProducts();
  const updated = current.filter((p) => p._id !== id && p.id !== id);
  saveStoredProducts(updated);
  return updated;
}

export function resetStoredProducts(): Product[] {
  try {
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(PRODUCTS));
    window.dispatchEvent(new CustomEvent(PRODUCTS_EVENT, { detail: PRODUCTS }));
  } catch (err) {
    console.error('Failed to reset products', err);
  }
  return PRODUCTS;
}

export function useStoredProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(getStoredProducts);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<Product[]>;
      if (custom.detail) {
        setProducts(custom.detail);
      } else {
        setProducts(getStoredProducts());
      }
    };
    window.addEventListener(PRODUCTS_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(PRODUCTS_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return products;
}
