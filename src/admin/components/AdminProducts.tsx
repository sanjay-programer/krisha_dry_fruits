import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X, Check, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, PlusCircle } from 'lucide-react';
import { adminApi } from '@/api';
import { uploadToCloudinary } from '@/lib/cloudinaryUpload';
import { formatPrice } from '@/data';

const GRADES = ['W180', 'W210', 'W240', 'W320', 'W450'];
const ALL_TYPES = ['Raw', 'Roasted', 'Roasted & Salted', 'Spiced', 'Honey Glazed'];
const DEFAULT_QUANTITIES = ['250g', '500g', '1kg', '2kg', '5kg'];

function makeType(type: string) {
  return {
    type,
    enabled: false,
    description: '',
    image: '',
    prices: DEFAULT_QUANTITIES.map((q) => ({ quantity: q, price: 0 })),
  };
}

function emptyProduct() {
  return {
    grade: 'W320',
    name: '',
    tagline: '',
    description: '',
    longDescription: '',
    origin: 'Goa & Karnataka Coast, India',
    gradeDescription: '',
    image: '',
    gallery: ['', '', '', ''] as string[],
    badge: 'New',
    active: true,
    types: ALL_TYPES.map(makeType),
  };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [form, setForm] = useState<any>(emptyProduct());
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingField = useRef<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.products.list().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditProduct(null); setForm(emptyProduct()); setShowForm(true); };

  const openEdit = (p: any) => {
    setEditProduct(p);
    // Merge existing types with all possible types, mark enabled ones
    const existingTypes = p.types || [];
    const mergedTypes = ALL_TYPES.map((typeName) => {
      const existing = existingTypes.find((t: any) => t.type === typeName);
      return existing ? { ...existing, enabled: true } : makeType(typeName);
    });
    setForm({
      ...p,
      gallery: [...(p.gallery || []), '', '', '', ''].slice(0, 4),
      types: mergedTypes,
    });
    setShowForm(true);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try { const r = await adminApi.products.seed(); alert(r.message); load(); }
    catch (e: any) { alert(e.message); }
    finally { setSeeding(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await adminApi.products.delete(id);
    load();
  };

  const handleToggleActive = async (p: any) => {
    await adminApi.products.update(p._id, { active: !p.active });
    load();
  };

  const triggerUpload = (field: string) => {
    pendingField.current = field;
    if (fileRef.current) { fileRef.current.value = ''; fileRef.current.click(); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const field = pendingField.current;
    if (!file || !field) return;
    setUploadingField(field);
    try {
      const url = await uploadToCloudinary(file);
      setForm((f: any) => {
        if (field === 'image') return { ...f, image: url };
        if (field.startsWith('gallery-')) {
          const idx = parseInt(field.split('-')[1]);
          const gallery = [...f.gallery];
          gallery[idx] = url;
          return { ...f, gallery };
        }
        if (field.startsWith('type-')) {
          const typeName = field.replace('type-', '');
          return { ...f, types: f.types.map((t: any) => t.type === typeName ? { ...t, image: url } : t) };
        }
        return f;
      });
    } catch (err: any) {
      alert('Upload failed: ' + err.message + '\n\nMake sure you have created an unsigned upload preset named "krisha_unsigned" in your Cloudinary dashboard.');
    } finally {
      setUploadingField(null);
    }
  };

  const setField = (key: string, val: any) => setForm((f: any) => ({ ...f, [key]: val }));

  const toggleType = (typeName: string) =>
    setForm((f: any) => ({
      ...f,
      types: f.types.map((t: any) => t.type === typeName ? { ...t, enabled: !t.enabled } : t),
    }));

  const updateTypeField = (typeName: string, key: string, val: any) =>
    setForm((f: any) => ({ ...f, types: f.types.map((t: any) => t.type === typeName ? { ...t, [key]: val } : t) }));

  const updatePrice = (typeName: string, qty: string, price: number) =>
    setForm((f: any) => ({
      ...f,
      types: f.types.map((t: any) =>
        t.type === typeName
          ? { ...t, prices: t.prices.map((p: any) => p.quantity === qty ? { ...p, price } : p) }
          : t
      ),
    }));

  // updatePrice by index (used in the dynamic weight rows)
  const updatePriceByIdx = (typeName: string, idx: number, price: number) =>
    setForm((f: any) => ({
      ...f,
      types: f.types.map((t: any) =>
        t.type === typeName
          ? { ...t, prices: t.prices.map((p: any, i: number) => i === idx ? { ...p, price } : p) }
          : t
      ),
    }));

  const addQuantity = (typeName: string) =>
    setForm((f: any) => ({
      ...f,
      types: f.types.map((t: any) =>
        t.type === typeName
          ? { ...t, prices: [...t.prices, { quantity: '', price: 0 }] }
          : t
      ),
    }));

  const removeQuantity = (typeName: string, idx: number) =>
    setForm((f: any) => ({
      ...f,
      types: f.types.map((t: any) =>
        t.type === typeName
          ? { ...t, prices: t.prices.filter((_: any, i: number) => i !== idx) }
          : t
      ),
    }));

  const updateQuantityLabel = (typeName: string, idx: number, label: string) =>
    setForm((f: any) => ({
      ...f,
      types: f.types.map((t: any) =>
        t.type === typeName
          ? { ...t, prices: t.prices.map((p: any, i: number) => i === idx ? { ...p, quantity: label } : p) }
          : t
      ),
    }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const enabledTypes = form.types.filter((t: any) => t.enabled);
    if (enabledTypes.length === 0) { alert('Enable at least one type (Raw, Roasted, etc.)'); return; }
    if (!form.image) { alert('Main image is required'); return; }
    setSaving(true);
    try {
      // Strip out the `enabled` flag before saving, only save enabled types
      const payload = {
        ...form,
        gallery: form.gallery.filter(Boolean),
        types: enabledTypes.map(({ enabled: _, ...t }: any) => t),
      };
      if (editProduct) await adminApi.products.update(editProduct._id, payload);
      else await adminApi.products.create(payload);
      setShowForm(false);
      load();
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  // ── Form view ──────────────────────────────────────────────────────────────
  if (showForm) {
    return (
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl font-bold text-brand-950">
            {editProduct ? 'Edit Product' : 'Add Product'}
          </h1>
          <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-brand-50 transition-colors">
            <X className="w-5 h-5 text-brand-600" />
          </button>
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-serif text-base font-semibold text-brand-900">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Grade</label>
                <select value={form.grade} onChange={(e) => setField('grade', e.target.value)} className="input-field">
                  {GRADES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Badge</label>
                <input value={form.badge} onChange={(e) => setField('badge', e.target.value)} className="input-field" placeholder="Premium" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Name <span className="text-red-400">*</span></label>
                <input value={form.name} onChange={(e) => setField('name', e.target.value)} className="input-field" placeholder="Jumbo King W180" required />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Tagline <span className="text-red-400">*</span></label>
                <input value={form.tagline} onChange={(e) => setField('tagline', e.target.value)} className="input-field" placeholder="Short tagline" required />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Description <span className="text-red-400">*</span></label>
                <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} className="input-field resize-none" rows={2} required />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Long Description</label>
                <textarea value={form.longDescription} onChange={(e) => setField('longDescription', e.target.value)} className="input-field resize-none" rows={3} />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Origin</label>
                <input value={form.origin} onChange={(e) => setField('origin', e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-700 mb-1.5 block">Grade Description</label>
                <input value={form.gradeDescription} onChange={(e) => setField('gradeDescription', e.target.value)} className="input-field" />
              </div>
            </div>
          </div>

          {/* Main image */}
          <div className="card p-6">
            <h2 className="font-serif text-base font-semibold text-brand-900 mb-1">Main Image <span className="text-red-400">*</span></h2>
            <p className="text-xs text-brand-500 mb-4">This is the primary product image shown on cards and listings.</p>
            <div className="flex items-center gap-4">
              {form.image
                ? <img src={form.image} alt="main" className="w-24 h-24 rounded-xl object-cover ring-1 ring-brand-100 shrink-0" />
                : <div className="w-24 h-24 rounded-xl bg-cream-200 flex items-center justify-center shrink-0 text-brand-400 text-xs">No image</div>
              }
              <div className="flex-1 space-y-2">
                <input value={form.image} onChange={(e) => setField('image', e.target.value)} className="input-field" placeholder="Paste image URL, or upload below" />
                <button type="button" onClick={() => triggerUpload('image')} disabled={!!uploadingField} className="btn-outline text-xs py-2 px-4">
                  <Upload className="w-3.5 h-3.5" />
                  {uploadingField === 'image' ? 'Uploading...' : 'Upload from device'}
                </button>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="card p-6">
            <h2 className="font-serif text-base font-semibold text-brand-900 mb-1">Gallery</h2>
            <p className="text-xs text-brand-500 mb-4">Optional — up to 4 extra images shown in the product detail gallery.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="space-y-2">
                  {form.gallery[idx]
                    ? <img src={form.gallery[idx]} alt="" className="w-full h-20 rounded-xl object-cover ring-1 ring-brand-100" />
                    : <div className="w-full h-20 rounded-xl bg-cream-200 flex items-center justify-center text-xs text-brand-400">Empty</div>
                  }
                  <input
                    value={form.gallery[idx] || ''}
                    onChange={(e) => { const g = [...form.gallery]; g[idx] = e.target.value; setField('gallery', g); }}
                    className="input-field text-xs py-2"
                    placeholder={`Image ${idx + 1}`}
                  />
                  <button type="button" onClick={() => triggerUpload(`gallery-${idx}`)} disabled={!!uploadingField} className="btn-outline text-xs py-1.5 px-3 w-full">
                    <Upload className="w-3 h-3" />
                    {uploadingField === `gallery-${idx}` ? '...' : 'Upload'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Types & Prices */}
          <div className="card p-6">
            <h2 className="font-serif text-base font-semibold text-brand-900 mb-1">Types & Pricing</h2>
            <p className="text-xs text-brand-500 mb-4">Toggle on the types available for this product. At least one is required.</p>
            <div className="space-y-3">
              {form.types.map((t: any) => (
                <div key={t.type} className={`border rounded-xl overflow-hidden transition-colors ${t.enabled ? 'border-brand-300' : 'border-brand-100'}`}>
                  {/* Type header row */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-cream-50">
                    <button
                      type="button"
                      onClick={() => toggleType(t.type)}
                      className="shrink-0 transition-colors"
                      title={t.enabled ? 'Disable this type' : 'Enable this type'}
                    >
                      {t.enabled
                        ? <ToggleRight className="w-6 h-6 text-brand-600" />
                        : <ToggleLeft className="w-6 h-6 text-brand-300" />
                      }
                    </button>
                    <span className={`flex-1 text-sm font-semibold ${t.enabled ? 'text-brand-900' : 'text-brand-400'}`}>{t.type}</span>
                    {t.enabled && (
                      <button
                        type="button"
                        onClick={() => setExpandedType(expandedType === t.type ? null : t.type)}
                        className="p-1 rounded hover:bg-brand-100 transition-colors"
                      >
                        {expandedType === t.type ? <ChevronUp className="w-4 h-4 text-brand-500" /> : <ChevronDown className="w-4 h-4 text-brand-500" />}
                      </button>
                    )}
                  </div>

                  {/* Expanded details — only when enabled */}
                  {t.enabled && expandedType === t.type && (
                    <div className="p-4 space-y-4 border-t border-brand-100">
                      <div>
                        <label className="text-xs font-medium text-brand-700 mb-1.5 block">Description</label>
                        <textarea value={t.description} onChange={(e) => updateTypeField(t.type, 'description', e.target.value)} className="input-field resize-none" rows={2} placeholder="Describe this variety..." />
                      </div>
                      <div className="flex items-center gap-4">
                        {t.image
                          ? <img src={t.image} alt={t.type} className="w-16 h-16 rounded-lg object-cover ring-1 ring-brand-100 shrink-0" />
                          : <div className="w-16 h-16 rounded-lg bg-cream-200 flex items-center justify-center text-xs text-brand-400 shrink-0">No img</div>
                        }
                        <div className="flex-1 space-y-2">
                          <input value={t.image} onChange={(e) => updateTypeField(t.type, 'image', e.target.value)} className="input-field text-xs" placeholder="Type image URL or upload" />
                          <button type="button" onClick={() => triggerUpload(`type-${t.type}`)} disabled={!!uploadingField} className="btn-outline text-xs py-1.5 px-3">
                            <Upload className="w-3 h-3" />
                            {uploadingField === `type-${t.type}` ? 'Uploading...' : 'Upload'}
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-medium text-brand-700">Weights & Prices (₹)</label>
                          <button
                            type="button"
                            onClick={() => addQuantity(t.type)}
                            className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-800 transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5" /> Add weight
                          </button>
                        </div>
                        <div className="space-y-2">
                          {t.prices.map((p: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                value={p.quantity}
                                onChange={(e) => updateQuantityLabel(t.type, idx, e.target.value)}
                                className="input-field text-xs py-2 w-28"
                                placeholder="e.g. 500g, 1kg"
                              />
                              <span className="text-brand-400 text-xs shrink-0">₹</span>
                              <input
                                type="number"
                                value={p.price}
                                onChange={(e) => updatePriceByIdx(t.type, idx, parseInt(e.target.value) || 0)}
                                className="input-field text-xs py-2 flex-1"
                                placeholder="Price"
                                min="0"
                              />
                              <button
                                type="button"
                                onClick={() => removeQuantity(t.type, idx)}
                                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-brand-300 hover:text-red-500" />
                              </button>
                            </div>
                          ))}
                          {t.prices.length === 0 && (
                            <p className="text-xs text-brand-400 py-2">No weights added. Click "Add weight" above.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pb-8">
            <button type="submit" disabled={saving} className="btn-primary">
              <Check className="w-4 h-4" />
              {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-950">Products</h1>
          <p className="text-sm text-brand-500 mt-1">{products.length} products in catalogue</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSeed} disabled={seeding} className="btn-outline text-xs py-2 px-4">
            {seeding ? 'Seeding...' : 'Seed defaults'}
          </button>
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="card h-52 animate-pulse bg-cream-200" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => {
            const allPrices = (p.types || []).flatMap((t: any) => (t.prices || []).map((pr: any) => pr.price)).filter(Boolean);
            const minPrice = allPrices.length ? Math.min(...allPrices) : null;
            return (
              <div key={p._id} className={`card overflow-hidden ${!p.active ? 'opacity-60' : ''}`}>
                <div className="relative h-40 bg-cream-200">
                  {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover" />}
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-cream-50">{p.badge}</span>
                  </div>
                  {!p.active && (
                    <div className="absolute inset-0 bg-brand-950/30 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white bg-brand-800/80 px-3 py-1 rounded-full">Hidden</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs font-semibold text-brand-500 mb-0.5">{p.grade}</div>
                  <h3 className="font-serif text-sm font-semibold text-brand-900 mb-1">{p.name}</h3>
                  <p className="text-xs text-brand-500 mb-3 line-clamp-1">{p.tagline}</p>
                  <div className="text-xs text-brand-600 mb-3">
                    {minPrice ? `From ${formatPrice(minPrice)}` : '—'}
                    <span className="ml-2 text-brand-400">· {(p.types || []).length} types</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="flex-1 btn-outline text-xs py-1.5">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleToggleActive(p)} className="p-1.5 rounded-lg hover:bg-brand-50 transition-colors" title={p.active ? 'Hide product' : 'Show product'}>
                      {p.active ? <Eye className="w-4 h-4 text-brand-500" /> : <EyeOff className="w-4 h-4 text-brand-400" />}
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4 text-brand-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {products.length === 0 && (
            <div className="col-span-3 card p-12 text-center">
              <p className="text-brand-500 mb-4">No products yet.</p>
              <button onClick={handleSeed} className="btn-primary">Seed default products</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
