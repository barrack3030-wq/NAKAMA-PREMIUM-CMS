import React, { useState } from 'react';
import { useCms } from '../CmsContext';
import { SeoSettings } from '../types';
import {
  Globe,
  Search,
  Share2,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  Smartphone,
  Monitor
} from 'lucide-react';

export const SeoManager: React.FC = () => {
  const { seoSettings, updateSeoSettings, siteSettings } = useCms();
  const [localSeo, setLocalSeo] = useState<SeoSettings>({ ...seoSettings });
  const [activePreview, setActivePreview] = useState<'google' | 'social' | 'schema'>('google');
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeoSettings(localSeo);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Generate Schema.org JSON-LD dynamically
  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: siteSettings.siteName,
    description: localSeo.description,
    url: localSeo.canonicalUrl,
    image: localSeo.ogImage,
    telephone: siteSettings.contact.phone,
    email: siteSettings.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteSettings.contact.address,
      addressLocality: siteSettings.contact.city,
      addressCountry: 'US'
    },
    openingHoursSpecification: siteSettings.hours.map(h => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.time.split('–')[0]?.trim() || '07:00',
      closes: h.time.split('–')[1]?.trim() || '18:00'
    }))
  };

  const copySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(schemaJsonLd, null, 2));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6" id="cms-seo-manager">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-700" />
            SEO & Social Metadata Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Optimize search engine rankings, OpenGraph share preview cards, and structured JSON-LD data.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium shadow-xs transition-colors cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Saved!
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Save SEO Settings
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">
            Site-Wide Meta Tags
          </h2>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Global Meta Title
            </label>
            <input
              type="text"
              value={localSeo.title}
              onChange={(e) => setLocalSeo({ ...localSeo, title: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>Optimal length: 50-60 characters</span>
              <span className={localSeo.title.length > 60 ? 'text-amber-600 font-medium' : ''}>
                {localSeo.title.length}/60
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={localSeo.description}
              onChange={(e) => setLocalSeo({ ...localSeo, description: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>Optimal length: 140-160 characters</span>
              <span className={localSeo.description.length > 160 ? 'text-amber-600 font-medium' : ''}>
                {localSeo.description.length}/160
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Canonical URL
              </label>
              <input
                type="url"
                value={localSeo.canonicalUrl}
                onChange={(e) => setLocalSeo({ ...localSeo, canonicalUrl: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Robots Indexing
              </label>
              <select
                value={localSeo.robots}
                onChange={(e) => setLocalSeo({ ...localSeo, robots: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg"
              >
                <option value="index, follow">index, follow (Standard)</option>
                <option value="noindex, follow">noindex, follow (Staging)</option>
                <option value="noindex, nofollow">noindex, nofollow (Private)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Open Graph Share Image (1200 x 630px recommended)
            </label>
            <input
              type="text"
              value={localSeo.ogImage}
              onChange={(e) => setLocalSeo({ ...localSeo, ogImage: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Twitter/X Handle
              </label>
              <input
                type="text"
                value={localSeo.twitterHandle}
                onChange={(e) => setLocalSeo({ ...localSeo, twitterHandle: e.target.value })}
                placeholder="@handle"
                className="w-full px-3.5 py-2 text-sm bg-white border border-neutral-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Brand Theme Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localSeo.themeColor}
                  onChange={(e) => setLocalSeo({ ...localSeo, themeColor: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-neutral-200 p-0.5 cursor-pointer"
                />
                <input
                  type="text"
                  value={localSeo.themeColor}
                  onChange={(e) => setLocalSeo({ ...localSeo, themeColor: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Visualizer Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
            {/* Preview Mode Selector */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActivePreview('google')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                    activePreview === 'google' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-500'
                  }`}
                >
                  Google SERP
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview('social')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                    activePreview === 'social' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-500'
                  }`}
                >
                  Social Card
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview('schema')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                    activePreview === 'schema' ? 'bg-white shadow-xs text-neutral-900' : 'text-neutral-500'
                  }`}
                >
                  JSON-LD
                </button>
              </div>

              {activePreview === 'google' && (
                <div className="flex items-center gap-1 text-neutral-400">
                  <button
                    type="button"
                    onClick={() => setDevicePreview('desktop')}
                    className={`p-1 rounded ${devicePreview === 'desktop' ? 'text-amber-700 bg-amber-50' : 'hover:text-neutral-700'}`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDevicePreview('mobile')}
                    className={`p-1 rounded ${devicePreview === 'mobile' ? 'text-amber-700 bg-amber-50' : 'hover:text-neutral-700'}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Google SERP Preview */}
            {activePreview === 'google' && (
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-[11px] text-neutral-400 block mb-2 font-mono">
                  Google Search Result Preview
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 truncate">
                    <span className="w-4 h-4 rounded-full bg-amber-800 text-white text-[9px] flex items-center justify-center font-bold">
                      A
                    </span>
                    <span className="truncate">{localSeo.canonicalUrl}</span>
                  </div>
                  <h3 className="text-base text-blue-800 hover:underline font-medium cursor-pointer leading-snug">
                    {localSeo.title || 'Untitled Page'}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {localSeo.description || 'No meta description configured for this document.'}
                  </p>
                </div>
              </div>
            )}

            {/* Social Share Card Preview */}
            {activePreview === 'social' && (
              <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white shadow-xs">
                <div className="aspect-16/9 bg-neutral-100 overflow-hidden">
                  <img
                    src={localSeo.ogImage}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3 bg-neutral-50 border-t border-neutral-200">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    {new URL(localSeo.canonicalUrl || 'https://example.com').hostname}
                  </span>
                  <p className="text-xs font-semibold text-neutral-900 truncate mt-0.5">
                    {localSeo.title}
                  </p>
                  <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                    {localSeo.description}
                  </p>
                </div>
              </div>
            )}

            {/* Schema JSON-LD Preview */}
            {activePreview === 'schema' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Structured Rich Snippets</span>
                  <button
                    type="button"
                    onClick={copySchema}
                    className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-medium"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? 'Copied' : 'Copy JSON-LD'}
                  </button>
                </div>
                <pre className="p-3 bg-neutral-900 text-neutral-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-64">
                  {JSON.stringify(schemaJsonLd, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
