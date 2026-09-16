import React from 'react';
import { useCms } from '../cms/CmsContext';
import {
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
  Flame,
  Award
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { siteSettings, collections } = useCms();
  const menuItems = collections['menu'] || [];
  const featuredItem = menuItems.find((i: any) => i.isFeatured) || menuItems[0];

  return (
    <section id="home" className="relative bg-neutral-900 text-white overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Subtle warm ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-orange-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-amber-300 text-xs font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>In-House Micro Roasting • Portland, OR</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Crafted with intention. <br />
              <span className="italic font-normal text-amber-400">Roasted with precision.</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-xl font-normal leading-relaxed">
              {siteSettings.tagline}. We forge direct relationships with generational coffee farmers across Ethiopia, Colombia, and Guatemala to pour uncompromising cups every morning.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold tracking-wide transition-colors shadow-lg shadow-amber-900/20"
              >
                Explore Seasonal Menu
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#reserve"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-xl text-sm font-semibold tracking-wide border border-neutral-700 transition-colors"
              >
                Reserve a Table
              </a>
            </div>

            {/* Ethos Badges */}
            <div className="pt-8 border-t border-neutral-800 grid grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-white block">Direct Trade</span>
                <span className="text-neutral-400 text-[11px]">2.4x Fair Trade wages</span>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-white block">Vintage Probat</span>
                <span className="text-neutral-400 text-[11px]">Small-batch slow roast</span>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-white block">Seasonal Kitchen</span>
                <span className="text-neutral-400 text-[11px]">Organic Pacific Northwest</span>
              </div>
            </div>
          </div>

          {/* Right Visual / Featured Roast Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-800/80">
              <div className="aspect-4/3 overflow-hidden relative">
                <img
                  src={
                    featuredItem?.image ||
                    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000&auto=format&fit=crop'
                  }
                  alt={featuredItem?.name || 'Aura Coffee'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                <span className="absolute top-4 left-4 bg-amber-700/90 backdrop-blur-xs text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                  Today's Featured Pour
                </span>
              </div>

              {featuredItem && (
                <div className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white">
                        {featuredItem.name}
                      </h3>
                      <span className="text-xs text-amber-400 font-medium">
                        {featuredItem.category}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-white">
                      ${Number(featuredItem.price).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {featuredItem.description}
                  </p>

                  {featuredItem.dietary && featuredItem.dietary.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {featuredItem.dietary.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded-md border border-neutral-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
