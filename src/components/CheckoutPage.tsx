import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Check, Truck, MapPin, Locate, ChevronRight, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCart } from '@/cart-context';
import { useUser } from '@clerk/react';
import { formatPrice, generateOrderId, getEstimatedDelivery } from '@/data';
import type { CustomerInfo, OrderDetails } from '@/types';

// Fix leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface CheckoutPageProps {
  onBack: () => void;
  onPlaceOrder: (order: OrderDetails) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';

// Component to fly map to new coords
function MapFlyTo({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 16, { duration: 1.2 });
  }, [coords, map]);
  return null;
}

// Component to handle map click
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onMapClick(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

async function reverseGeocode(lat: number, lng: number): Promise<Partial<CustomerInfo>> {
  if (MAPS_KEY) {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}`);
    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return {};
    const comps: any[] = result.address_components || [];
    const get = (type: string) => comps.find((c: any) => c.types.includes(type))?.long_name || '';
    const streetNum = get('street_number');
    const route = get('route');
    const sublocality = get('sublocality_level_1') || get('sublocality');
    const city = get('locality') || get('administrative_area_level_2');
    const stateRaw = get('administrative_area_level_1');
    const pincode = get('postal_code');
    const address = [streetNum, route, sublocality].filter(Boolean).join(', ') || result.formatted_address;
    const state = INDIAN_STATES.find((s) => s.toLowerCase() === stateRaw.toLowerCase()) || stateRaw;
    return { address, city, state, pincode };
  } else {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    const data = await res.json();
    const addr = data.address || {};
    const address = [addr.house_number, addr.road, addr.suburb].filter(Boolean).join(', ');
    const city = addr.city || addr.town || addr.village || '';
    const stateRaw = addr.state || '';
    const pincode = addr.postcode || '';
    const state = INDIAN_STATES.find((s) => s.toLowerCase() === stateRaw.toLowerCase()) || stateRaw;
    return { address, city, state, pincode };
  }
}

export default function CheckoutPage({ onBack, onPlaceOrder }: CheckoutPageProps) {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useUser();

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [placing, setPlacing] = useState(false);

  // Map state — default center: India
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Address search state
  const [addressSearch, setAddressSearch] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shipping = subtotal >= 2000 ? 0 : 80;
  const total = subtotal + shipping;

  // Autofill from Clerk on mount
  useEffect(() => {
    if (!user) return;
    setCustomer((prev) => ({
      ...prev,
      fullName: prev.fullName || user.fullName || '',
      email: prev.email || user.primaryEmailAddress?.emailAddress || '',
      phone: prev.phone || user.primaryPhoneNumber?.phoneNumber?.replace(/\D/g, '').slice(-10) || '',
    }));
  }, [user]);

  const update = (field: keyof CustomerInfo, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const applyGeoResult = useCallback((result: Partial<CustomerInfo>, coords: [number, number]) => {
    setCustomer((prev) => ({ ...prev, ...result }));
    setMarkerPos(coords);
    setFlyTo(coords);
  }, []);

  // Nominatim search suggestions (works without API key)
  const handleAddressSearch = (val: string) => {
    setAddressSearch(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!val.trim()) { setSuggestions([]); return; }
    searchTimeout.current = setTimeout(async () => {
      try {
        if (MAPS_KEY) {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(val)}&components=country:in&key=${MAPS_KEY}`
          );
          const data = await res.json();
          setSuggestions((data.predictions || []).map((p: any) => ({
            id: p.place_id,
            label: p.description,
            main: p.structured_formatting?.main_text,
            secondary: p.structured_formatting?.secondary_text,
            isGoogle: true,
          })));
        } else {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&countrycodes=in&format=json&addressdetails=1&limit=5`
          );
          const data = await res.json();
          setSuggestions(data.map((item: any) => ({
            id: item.place_id,
            label: item.display_name,
            main: item.display_name.split(',')[0],
            secondary: item.display_name.split(',').slice(1).join(',').trim(),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            address: item.address,
          })));
        }
      } catch { setSuggestions([]); }
    }, 400);
  };

  const selectSuggestion = async (s: any) => {
    setSuggestions([]);
    setAddressSearch('');
    if (s.isGoogle) {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${s.id}&fields=address_components,formatted_address,geometry&key=${MAPS_KEY}`
        );
        const data = await res.json();
        const comps: any[] = data.result?.address_components || [];
        const get = (type: string) => comps.find((c: any) => c.types.includes(type))?.long_name || '';
        const streetNum = get('street_number');
        const route = get('route');
        const sublocality = get('sublocality_level_1') || get('sublocality');
        const city = get('locality') || get('administrative_area_level_2');
        const stateRaw = get('administrative_area_level_1');
        const pincode = get('postal_code');
        const address = [streetNum, route, sublocality].filter(Boolean).join(', ') || data.result?.formatted_address || s.label;
        const state = INDIAN_STATES.find((st) => st.toLowerCase() === stateRaw.toLowerCase()) || stateRaw;
        const loc = data.result?.geometry?.location;
        const coords: [number, number] = loc ? [loc.lat, loc.lng] : [20.5937, 78.9629];
        applyGeoResult({ address, city, state, pincode }, coords);
      } catch { update('address', s.label); }
    } else {
      // Nominatim result — already has lat/lng
      const addr = s.address || {};
      const address = [addr.house_number, addr.road, addr.suburb].filter(Boolean).join(', ') || s.main;
      const city = addr.city || addr.town || addr.village || '';
      const stateRaw = addr.state || '';
      const pincode = addr.postcode || '';
      const state = INDIAN_STATES.find((st) => st.toLowerCase() === stateRaw.toLowerCase()) || stateRaw;
      applyGeoResult({ address, city, state, pincode }, [s.lat, s.lng]);
    }
  };

  // Map click → reverse geocode
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    try {
      const result = await reverseGeocode(lat, lng);
      setCustomer((prev) => ({ ...prev, ...result }));
    } catch { /* ignore */ }
  }, []);

  // Auto-detect via geolocation
  const detectLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported by your browser.'); return; }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const result = await reverseGeocode(coords.latitude, coords.longitude);
          applyGeoResult(result, [coords.latitude, coords.longitude]);
        } catch { alert('Could not fetch address. Please fill manually.'); }
        finally { setDetectingLocation(false); }
      },
      () => { alert('Location access denied. Please fill address manually.'); setDetectingLocation(false); }
    );
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof CustomerInfo, string>> = {};
    if (!customer.fullName.trim()) e.fullName = 'Required';
    if (!customer.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) e.email = 'Invalid email';
    if (!customer.phone.trim()) e.phone = 'Required';
    else if (!/^[0-9]{10}$/.test(customer.phone.replace(/\s/g, ''))) e.phone = 'Enter 10 digits';
    if (!customer.address.trim()) e.address = 'Required';
    if (!customer.city.trim()) e.city = 'Required';
    if (!customer.state.trim()) e.state = 'Required';
    if (!customer.pincode.trim()) e.pincode = 'Required';
    else if (!/^[0-9]{6}$/.test(customer.pincode)) e.pincode = 'Enter 6 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setPlacing(true);
    const order: OrderDetails = {
      orderId: generateOrderId(),
      items: [...items],
      subtotal,
      shipping,
      total,
      customer,
      paymentMethod: 'cod',
      placedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      estimatedDelivery: getEstimatedDelivery(),
    };
    clearCart();
    onPlaceOrder(order);
    setPlacing(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-brand-900 mb-2">Your cart is empty</h1>
        <p className="text-brand-600 mb-6">Add some cashews before checking out.</p>
        <button onClick={onBack} className="btn-primary">Browse Cashews</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to cart
      </button>

      <div className="flex items-center gap-2 mb-8 text-sm">
        <span className="text-brand-500">Cart</span>
        <ChevronRight className="w-4 h-4 text-brand-300" />
        <span className="font-semibold text-brand-900">Checkout</span>
        <ChevronRight className="w-4 h-4 text-brand-300" />
        <span className="text-brand-400">Confirmation</span>
      </div>

      <h1 className="font-serif text-3xl font-bold text-brand-950 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">

          {/* Delivery info */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Truck className="w-5 h-5 text-brand-600" />
              <h2 className="font-serif text-lg font-semibold text-brand-900">Delivery Information</h2>
              {user && <span className="ml-auto text-xs text-forest-600 font-medium">✓ Auto-filled from your account</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Full Name</label>
                <input value={customer.fullName} onChange={(e) => update('fullName', e.target.value)} className="input-field" placeholder="John Doe" />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Email</label>
                <input type="email" value={customer.email} onChange={(e) => update('email', e.target.value)} className="input-field" placeholder="john@example.com" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Phone</label>
                <input type="tel" value={customer.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" placeholder="9876543210" />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" />
                <h2 className="font-serif text-lg font-semibold text-brand-900">Delivery Address</h2>
              </div>
              <button
                type="button"
                onClick={detectLocation}
                disabled={detectingLocation}
                className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-800 border border-brand-200 rounded-full px-3 py-1.5 transition-colors hover:bg-brand-50"
              >
                <Locate className="w-3.5 h-3.5" />
                {detectingLocation ? 'Detecting...' : 'Auto-detect'}
              </button>
            </div>

            {/* Map */}
            <div className="mb-4 rounded-xl overflow-hidden border border-brand-100" style={{ height: 260 }}>
              <MapContainer
                center={markerPos || [20.5937, 78.9629]}
                zoom={markerPos ? 16 : 5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <MapClickHandler onMapClick={handleMapClick} />
                <MapFlyTo coords={flyTo} />
                {markerPos && <Marker position={markerPos} />}
              </MapContainer>
            </div>
            <p className="text-xs text-brand-400 mb-4">Click anywhere on the map to pin your location, or search below.</p>

            {/* Address search */}
            <div className="relative mb-4">
              <label className="text-xs font-medium text-brand-700 mb-1.5 block">Search your address</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input
                  value={addressSearch}
                  onChange={(e) => handleAddressSearch(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Type your address to search..."
                />
              </div>
              {suggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg ring-1 ring-brand-100 overflow-hidden">
                  {suggestions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => selectSuggestion(s)}
                      className="w-full text-left px-4 py-3 text-sm text-brand-800 hover:bg-cream-100 transition-colors border-b border-brand-50 last:border-0"
                    >
                      <span className="font-medium">{s.main}</span>
                      <span className="text-brand-500 text-xs block truncate">{s.secondary}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Street Address</label>
                <input value={customer.address} onChange={(e) => update('address', e.target.value)} className="input-field" placeholder="House no, Street, Area" />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">City</label>
                <input value={customer.city} onChange={(e) => update('city', e.target.value)} className="input-field" placeholder="Mumbai" />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">State</label>
                <select value={customer.state} onChange={(e) => update('state', e.target.value)} className="input-field">
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">PIN Code</label>
                <input value={customer.pincode} onChange={(e) => update('pincode', e.target.value)} className="input-field" placeholder="400001" maxLength={6} />
                {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Delivery Notes (optional)</label>
                <textarea value={customer.notes} onChange={(e) => update('notes', e.target.value)} className="input-field resize-none" rows={2} placeholder="Any special instructions..." />
              </div>
            </div>
          </div>

          {/* Payment — COD only */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-brand-600" />
              <h2 className="font-serif text-lg font-semibold text-brand-900">Payment Method</h2>
            </div>
            <div className="flex items-center gap-3 rounded-xl border-2 border-brand-500 bg-brand-50 p-4">
              <div className="w-5 h-5 rounded-full border-2 border-brand-600 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />
              </div>
              <div>
                <div className="text-sm font-semibold text-brand-900">Cash on Delivery</div>
                <div className="text-xs text-brand-500">Pay when you receive your order</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif text-lg font-semibold text-brand-900 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative shrink-0">
                    <img src={item.image} alt={item.grade} className="w-14 h-14 rounded-lg object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-600 text-cream-50 text-[10px] font-bold flex items-center justify-center">
                      {item.count}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-brand-900">{item.grade} {item.type}</div>
                    <div className="text-xs text-brand-500">{item.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold text-brand-900">{formatPrice(item.price * item.count)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-brand-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-600">Subtotal</span>
                <span className="font-medium text-brand-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-600">Shipping</span>
                <span className="font-medium text-brand-900">
                  {shipping === 0 ? <span className="text-forest-600">Free</span> : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-brand-200">
                <span className="font-serif text-base font-semibold text-brand-900">Total</span>
                <span className="font-serif text-xl font-bold text-brand-900">{formatPrice(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={placing}
              className="w-full mt-5 flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-cream-50 transition-all hover:bg-brand-700 hover:shadow-lg active:scale-95 disabled:opacity-60"
            >
              <Check className="w-4 h-4" />
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
