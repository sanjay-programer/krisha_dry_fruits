import { useState } from 'react';
import {
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
  Layers,
  MapPin,
  Phone,
  Share2,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertTriangle,
  Eye,
  ShieldCheck,
  Leaf,
  Award,
  Truck,
  Heart,
  Clock,
  Check,
} from 'lucide-react';
import {
  useSiteContent,
  saveSiteContent,
  resetSiteContent,
  type SiteContent,
  type LocationBanner,
  type FeatureItem,
  DEFAULT_SITE_CONTENT,
} from '@/site-content';
import ImageUploadWidget from './ImageUploadWidget';

const ICON_OPTIONS: Array<{ label: string; value: FeatureItem['iconName']; icon: any }> = [
  { label: 'Leaf (Natural/Organic)', value: 'Leaf', icon: Leaf },
  { label: 'Award (Quality/Premium)', value: 'Award', icon: Award },
  { label: 'Truck (Fast Delivery)', value: 'Truck', icon: Truck },
  { label: 'ShieldCheck (Trust/Safety)', value: 'ShieldCheck', icon: ShieldCheck },
  { label: 'Heart (Customer Love)', value: 'Heart', icon: Heart },
  { label: 'Clock (Freshly Packed)', value: 'Clock', icon: Clock },
  { label: 'Check (Certified)', value: 'Check', icon: Check },
];

export default function AdminContent() {
  const currentContent = useSiteContent();
  const [content, setContent] = useState<SiteContent>(currentContent);
  const [activeTab, setActiveTab] = useState<'hero' | 'features' | 'locations' | 'contact' | 'social'>('hero');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = () => {
    saveSiteContent(content);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    const defaults = resetSiteContent();
    setContent(defaults);
    setShowResetConfirm(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const updateHero = (field: keyof SiteContent['hero'], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const updateContact = (field: keyof SiteContent['contact'], value: string) => {
    setContent((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const updateSocial = (field: keyof SiteContent['social'], value: string) => {
    setContent((prev) => ({
      ...prev,
      social: { ...prev.social, [field]: value },
    }));
  };

  const updateFeature = (index: number, field: keyof FeatureItem, value: any) => {
    setContent((prev) => {
      const nextFeatures = [...prev.features];
      nextFeatures[index] = { ...nextFeatures[index], [field]: value };
      return { ...prev, features: nextFeatures };
    });
  };

  const addLocationCard = () => {
    const newCard: LocationBanner = {
      id: `loc-${Date.now()}`,
      tag: 'Fresh Coastal Harvest',
      locationKey: 'Goa',
      title: 'New Sourcing Region Cashews',
      subtitle: 'Artisanal harvesting and sun-drying in regional orchards',
      image: '/hero_cashew_bowl.jpg',
      linkText: 'Explore Grade',
    };
    setContent((prev) => ({
      ...prev,
      locationBanners: [...prev.locationBanners, newCard],
    }));
  };

  const updateLocationCard = (index: number, field: keyof LocationBanner, value: string) => {
    setContent((prev) => {
      const nextLocations = [...prev.locationBanners];
      nextLocations[index] = { ...nextLocations[index], [field]: value };
      return { ...prev, locationBanners: nextLocations };
    });
  };

  const removeLocationCard = (index: number) => {
    if (content.locationBanners.length <= 1) {
      alert('You need at least one location banner card.');
      return;
    }
    setContent((prev) => ({
      ...prev,
      locationBanners: prev.locationBanners.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-brand-200/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-100 text-brand-700">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
              Storefront CMS & Content
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-brand-600 mt-1 max-w-2xl">
            Edit text, headings, badges, trust features, location cards, and contact information. All changes reflect instantly on the public website.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Reset Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-all shadow-sm"
            title="Reset all content back to original design"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-cream-50 text-xs sm:text-sm font-semibold transition-all shadow-md shadow-brand-950/20 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Success Notification Bar */}
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-sm font-medium animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Storefront content updated successfully! Public website is immediately refreshed.</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-brand-200/80">
        {[
          { id: 'hero', label: 'Hero & Storefront', icon: Sparkles },
          { id: 'features', label: '4 Trust Features', icon: Layers },
          { id: 'locations', label: 'Location Cashew Banners', icon: MapPin },
          { id: 'contact', label: 'Contact & Business Info', icon: Phone },
          { id: 'social', label: 'Footer & Social Handles', icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-brand-800 text-cream-50 shadow-sm'
                  : 'text-brand-700 hover:bg-brand-100/70 hover:text-brand-950'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO & STOREFRONT */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-brand-200/60 space-y-5">
            <h2 className="font-serif text-lg font-bold text-brand-950 border-b border-brand-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Hero Copywriting & Headings</span>
            </h2>

            {/* Top Announcement Bar */}
            <div>
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                Top Announcement Bar (Banner at Very Top of Store)
              </label>
              <input
                type="text"
                value={content.announcement}
                onChange={(e) => setContent((prev) => ({ ...prev, announcement: e.target.value }))}
                className="input-field"
                placeholder="e.g. Free pan-India shipping over ₹2,000 • Freshly packed within 48h"
              />
            </div>

            {/* Pill Badge */}
            <div>
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                Floating Pill Badge Text
              </label>
              <input
                type="text"
                value={content.hero.badge}
                onChange={(e) => updateHero('badge', e.target.value)}
                className="input-field"
                placeholder="e.g. India's Premium Cashew Brand"
              />
            </div>

            {/* Headline Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-900 block mb-1.5">
                  Headline Line 1
                </label>
                <input
                  type="text"
                  value={content.hero.titleLine1}
                  onChange={(e) => updateHero('titleLine1', e.target.value)}
                  className="input-field"
                  placeholder="Cashews,"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand-900 block mb-1.5">
                  Headline Line 2
                </label>
                <input
                  type="text"
                  value={content.hero.titleLine2}
                  onChange={(e) => updateHero('titleLine2', e.target.value)}
                  className="input-field"
                  placeholder="crafted to"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand-900 block mb-1.5">
                  Headline Highlight (Italic)
                </label>
                <input
                  type="text"
                  value={content.hero.titleHighlight}
                  onChange={(e) => updateHero('titleHighlight', e.target.value)}
                  className="input-field"
                  placeholder="perfection."
                />
              </div>
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                Sub-heading Description
              </label>
              <textarea
                rows={3}
                value={content.hero.subtitle}
                onChange={(e) => updateHero('subtitle', e.target.value)}
                className="input-field resize-none"
                placeholder="From the sun-drenched coast of Goa to your home..."
              />
            </div>

            {/* Button text & Hero Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-brand-900 block mb-1.5">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={content.hero.buttonText}
                  onChange={(e) => updateHero('buttonText', e.target.value)}
                  className="input-field"
                  placeholder="Shop Now"
                />
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-brand-100">
                <ImageUploadWidget
                  label="Storefront Hero Image"
                  value={content.hero.image}
                  onChange={(url) => updateHero('image', url)}
                  aspectRatio="landscape"
                  helpText="Select an image from your computer to upload directly to Cloudinary for the hero background."
                />
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="bg-cream-50 rounded-3xl p-6 shadow-luxury border border-brand-200/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-500 mb-3">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Hero Preview</span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-brand-200 bg-white aspect-[4/3] shadow-sm mb-4">
                <img
                  src={content.hero.image || '/hero_cashew_bowl.jpg'}
                  alt="Preview"
                  className="w-full h-full object-cover object-right"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/hero_cashew_bowl.jpg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cream-100/90 via-cream-100/60 to-transparent p-4 flex flex-col justify-center">
                  <span className="inline-block text-[9px] font-bold text-brand-800 bg-white/80 px-2 py-0.5 rounded-full w-max mb-1 border border-brand-200">
                    {content.hero.badge}
                  </span>
                  <div className="font-serif text-lg font-bold text-brand-950 leading-tight">
                    {content.hero.titleLine1} <br />
                    {content.hero.titleLine2} <br />
                    <span className="italic font-normal text-brand-700">{content.hero.titleHighlight}</span>
                  </div>
                  <p className="text-[10px] text-brand-800/90 mt-1 line-clamp-2">
                    {content.hero.subtitle}
                  </p>
                  <span className="mt-2 text-[9px] font-bold text-white bg-brand-700 px-3 py-1 rounded-full w-max shadow-sm">
                    {content.hero.buttonText} →
                  </span>
                </div>
              </div>
              <p className="text-xs text-brand-500 italic">
                * Note: Changes are instantly applied to the live storefront when you click Save.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="mt-6 w-full btn-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Hero Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: 4 TRUST FEATURES */}
      {activeTab === 'features' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-brand-200/60 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-100 gap-2">
            <div>
              <h2 className="font-serif text-lg font-bold text-brand-950">
                Four Trust Badges (Below Hero Section)
              </h2>
              <p className="text-xs text-brand-600">
                These 4 pillars build confidence right below the main hero image (e.g. 100% Natural, Premium Quality).
              </p>
            </div>
            <button
              onClick={() => {
                setContent((prev) => ({ ...prev, features: DEFAULT_SITE_CONTENT.features }));
              }}
              className="text-xs font-semibold text-brand-600 hover:text-brand-900 underline"
            >
              Reset 4 Features to Original
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.features.map((item, idx) => {
              return (
                <div
                  key={item.id || idx}
                  className="rounded-2xl border border-brand-200 bg-cream-50/50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-700">Badge #{idx + 1}</span>
                    <span className="text-[10px] text-brand-400">Position {idx + 1} of 4</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-900 block mb-1">
                      Choose Icon
                    </label>
                    <select
                      value={item.iconName}
                      onChange={(e) => updateFeature(idx, 'iconName', e.target.value)}
                      className="w-full text-xs rounded-xl border border-brand-200 bg-white px-2.5 py-2 text-brand-900 focus:outline-none focus:border-brand-600"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-900 block mb-1">
                      Top Title (Bold)
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                      className="input-field text-xs py-2"
                      placeholder="e.g. 100%"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-900 block mb-1">
                      Bottom Subtitle
                    </label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) => updateFeature(idx, 'subtitle', e.target.value)}
                      className="input-field text-xs py-2"
                      placeholder="e.g. Natural"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4 border-t border-brand-100">
            <button onClick={handleSave} className="btn-primary py-2.5 px-6 text-xs font-semibold flex items-center gap-2">
              <Save className="w-3.5 h-3.5" />
              <span>Save Trust Badges</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: LOCATION CASHEW BANNERS */}
      {activeTab === 'locations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-brand-200/60 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-100 gap-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-brand-950">
                Location-wise Cashew Cards & Sourcing Banners
              </h2>
              <p className="text-xs text-brand-600">
                These cards appear right below the grades selector. Customers can scroll horizontally to explore cashews from different coastal regions (Goa, Karnataka Malnad, Konkan, etc.).
              </p>
            </div>
            <button
              onClick={addLocationCard}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Location Card</span>
            </button>
          </div>

          <div className="space-y-4">
            {content.locationBanners.map((card, idx) => (
              <div
                key={card.id || idx}
                className="rounded-2xl border border-brand-200 p-5 bg-cream-50/60 space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-700 text-cream-50 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-brand-950">
                      Card #{idx + 1}: {card.title || 'Untitled Location'}
                    </span>
                  </div>

                  <button
                    onClick={() => removeLocationCard(idx)}
                    className="p-1.5 rounded-lg text-brand-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove this card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-900 block mb-1">
                      Origin Display Tag (Upper small text)
                    </label>
                    <input
                      type="text"
                      value={card.tag}
                      onChange={(e) => updateLocationCard(idx, 'tag', e.target.value)}
                      className="input-field text-xs py-2"
                      placeholder="e.g. 100% Sourced in Goa & Karnataka"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-900 block mb-1">
                      Target Product Origin Filter
                    </label>
                    <input
                      type="text"
                      value={card.locationKey || ''}
                      onChange={(e) => updateLocationCard(idx, 'locationKey', e.target.value)}
                      className="input-field text-xs py-2"
                      placeholder="e.g. Goa, Karnataka"
                    />
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-brand-500">
                      <span>Presets:</span>
                      {['Goa', 'Karnataka', 'Goa & Karnataka', 'All'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => updateLocationCard(idx, 'locationKey', preset)}
                          className="px-1.5 py-0.5 rounded bg-brand-100 hover:bg-brand-200 text-brand-800 font-medium"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-900 block mb-1">
                      Main Banner Title
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateLocationCard(idx, 'title', e.target.value)}
                      className="input-field text-xs py-2"
                      placeholder="e.g. Margao & Panaji Coastal Groves"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-900 block mb-1">
                      Subtitle / Regional Harvest Note
                    </label>
                    <input
                      type="text"
                      value={card.subtitle}
                      onChange={(e) => updateLocationCard(idx, 'subtitle', e.target.value)}
                      className="input-field text-xs py-2"
                      placeholder="e.g. Sun-dried along the Konkan coast"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-900 block mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={card.linkText}
                      onChange={(e) => updateLocationCard(idx, 'linkText', e.target.value)}
                      className="input-field text-xs py-2"
                      placeholder="e.g. Explore Goa Cashews"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-brand-200/50">
                  <ImageUploadWidget
                    label="Banner Background Photo"
                    value={card.image}
                    onChange={(url) => updateLocationCard(idx, 'image', url)}
                    aspectRatio="wide"
                    helpText="Upload an image representing this harvest region directly from your computer."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-brand-100">
            <button onClick={handleSave} className="btn-primary py-2.5 px-6 text-xs font-semibold flex items-center gap-2">
              <Save className="w-3.5 h-3.5" />
              <span>Save Location Cards</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CONTACT & BUSINESS INFO */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-brand-200/60 space-y-6">
          <div className="pb-3 border-b border-brand-100">
            <h2 className="font-serif text-lg font-bold text-brand-950">
              Customer Contact & Legal Information
            </h2>
            <p className="text-xs text-brand-600">
              This information automatically populates across the website footer, contact support page, and order confirmations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                Customer Care Helpline Phone
              </label>
              <input
                type="text"
                value={content.contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                className="input-field"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                Official Support Email
              </label>
              <input
                type="email"
                value={content.contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
                className="input-field"
                placeholder="care@krishadryfruits.in"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                Factory & Orchard Physical Address
              </label>
              <textarea
                rows={2}
                value={content.contact.address}
                onChange={(e) => updateContact('address', e.target.value)}
                className="input-field resize-none"
                placeholder="123 Plantation Road, Margao, Goa 403601, India"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                Operating / Business Hours
              </label>
              <input
                type="text"
                value={content.contact.hours}
                onChange={(e) => updateContact('hours', e.target.value)}
                className="input-field"
                placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                FSSAI License Number
              </label>
              <input
                type="text"
                value={content.contact.fssaiNumber}
                onChange={(e) => updateContact('fssaiNumber', e.target.value)}
                className="input-field font-mono"
                placeholder="10020021000123"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                FSSAI Certificate Description Text
              </label>
              <input
                type="text"
                value={content.contact.fssaiText}
                onChange={(e) => updateContact('fssaiText', e.target.value)}
                className="input-field"
                placeholder="FSSAI Certified Unit • Govt. Registered Premium Agri-Produce Facility"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-brand-100">
            <button onClick={handleSave} className="btn-primary py-2.5 px-6 text-xs font-semibold flex items-center gap-2">
              <Save className="w-3.5 h-3.5" />
              <span>Save Contact Info</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: FOOTER & SOCIAL HANDLES */}
      {activeTab === 'social' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-brand-200/60 space-y-6">
          <div className="pb-3 border-b border-brand-100">
            <h2 className="font-serif text-lg font-bold text-brand-950">
              Footer Bio & Official Social Media Links
            </h2>
            <p className="text-xs text-brand-600">
              Connect your brand's official profiles and edit the footer bio shown at the bottom of every page.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-900 block mb-1.5">
              Brand Bio (Footer Left Column)
            </label>
            <textarea
              rows={3}
              value={content.footerBio}
              onChange={(e) => setContent((prev) => ({ ...prev, footerBio: e.target.value }))}
              className="input-field resize-none"
              placeholder="Connoisseur cashews directly sourced from certified multi-generation family farms..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={content.social.instagram}
                onChange={(e) => updateSocial('instagram', e.target.value)}
                className="input-field"
                placeholder="https://instagram.com/krishadryfruits"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                Facebook URL
              </label>
              <input
                type="url"
                value={content.social.facebook}
                onChange={(e) => updateSocial('facebook', e.target.value)}
                className="input-field"
                placeholder="https://facebook.com/krishadryfruits"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={content.social.twitter}
                onChange={(e) => updateSocial('twitter', e.target.value)}
                className="input-field"
                placeholder="https://twitter.com/krishadryfruits"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-brand-900 block mb-1.5">
                WhatsApp Chat Link
              </label>
              <input
                type="url"
                value={content.social.whatsapp}
                onChange={(e) => updateSocial('whatsapp', e.target.value)}
                className="input-field"
                placeholder="https://wa.me/919876543210"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-brand-100">
            <button onClick={handleSave} className="btn-primary py-2.5 px-6 text-xs font-semibold flex items-center gap-2">
              <Save className="w-3.5 h-3.5" />
              <span>Save Footer & Social</span>
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-brand-950">
                Reset Storefront to Original UI?
              </h3>
              <p className="text-xs sm:text-sm text-brand-600 mt-2 leading-relaxed">
                If you made edits that disrupted the layout or styling, this action will instantly restore all hero headlines, trust badges, location cards, and descriptions back to the pristine default state.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-brand-200 text-xs font-semibold text-brand-800 hover:bg-brand-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-950/20"
              >
                Yes, Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
