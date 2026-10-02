import { useState, useEffect, useCallback } from 'react';
import { CartProvider } from '@/cart-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import ProductGrid from '@/components/ProductGrid';
import ProductDetail from '@/components/ProductDetail';
import CartDrawer from '@/components/CartDrawer';
import CheckoutPage from '@/components/CheckoutPage';
import OrderConfirmation from '@/components/OrderConfirmation';
import GradesGuide from '@/components/GradesGuide';
import About from '@/components/About';
import Contact from '@/components/Contact';
import MyOrders from '@/components/MyOrders';
import { api } from '@/api';
import type { Product, OrderDetails } from '@/types';

type Page = 'home' | 'products' | 'grades' | 'about' | 'contact' | 'product' | 'checkout' | 'confirmation' | 'myorders';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    api.products.list()
      .then((data) => setProducts((data as Product[]) || []))
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, []);

  const navigate = useCallback((p: string) => {
    setPage(p as Page);
    window.history.pushState({ page: p }, '', p === 'home' ? '/' : `/${p}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const viewProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setPage('product');
    window.history.pushState({ page: 'product', productId: (product as any)._id || product.id }, '', `/product`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const p = (e.state?.page as Page) || 'home';
      setPage(p);
      if (p !== 'product') setSelectedProduct(null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const viewProductById = useCallback((id: string) => {
    const product = products.find((p) => p.id === id || p._id === id);
    if (product) viewProduct(product);
  }, [viewProduct, products]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage('products');
  }, []);

  const handlePlaceOrder = useCallback(async (o: OrderDetails) => {
    try {
      await api.orders.create(o);
    } catch (err) {
      console.error('Failed to save order:', err);
    }
    setOrder(o);
    setPage('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Close cart on page change
  useEffect(() => {
    setCartOpen(false);
  }, [page]);

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header
          onNavigate={navigate}
          onOpenCart={() => setCartOpen(true)}
          onSearch={handleSearch}
          currentPage={page}
        />

        <main className="flex-1">
          {page === 'home' && (
            <>
              <Hero onShopNow={() => navigate('products')} onLearnMore={() => navigate('grades')} />
              <Features />
              <ProductGrid
                products={products}
                onView={viewProduct}
                loading={productsLoading}
                title="Our Premium Cashew Collection"
                subtitle="Five grades, five varieties, countless ways to enjoy. Every cashew hand-sorted and freshly packed."
              />
              <Testimonials />
            </>
          )}

          {page === 'products' && (
            <div className="pt-8">
              {searchQuery && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                  <p className="text-sm text-brand-600">
                    Showing results for "{searchQuery}" — {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                  </p>
                </div>
              )}
              <ProductGrid
                products={filteredProducts}
                onView={viewProduct}
                loading={productsLoading}
                title="Shop Premium Cashews"
                subtitle="Browse our complete range of grades and varieties. Select any product to choose your type and quantity."
              />
            </div>
          )}

          {page === 'product' && selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onBack={() => navigate('products')}
              onNavigate={navigate}
              onOpenCart={() => setCartOpen(true)}
            />
          )}

          {page === 'grades' && (
            <GradesGuide onShop={() => navigate('products')} onViewProduct={viewProductById} products={products} />
          )}

          {page === 'about' && <About />}

          {page === 'contact' && <Contact />}

          {page === 'myorders' && <MyOrders onBack={() => navigate('home')} />}

          {page === 'checkout' && (
            <CheckoutPage
              onBack={() => {
                setCartOpen(true);
                navigate('products');
              }}
              onPlaceOrder={handlePlaceOrder}
            />
          )}

          {page === 'confirmation' && order && (
            <OrderConfirmation
              order={order}
              onContinueShopping={() => navigate('home')}
            />
          )}
        </main>

        <Footer onNavigate={navigate} />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            navigate('checkout');
          }}
        />
      </div>
    </CartProvider>
  );
}

export default App;
