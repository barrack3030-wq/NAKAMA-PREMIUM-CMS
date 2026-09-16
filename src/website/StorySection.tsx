import React from 'react';
import { useCms } from '../cms/CmsContext';
import { Leaf, Award, HeartHandshake, ShieldCheck } from 'lucide-react';

export const StorySection: React.FC = () => {
  const { siteSettings } = useCms();

  return (
    <section id="story" className="py-20 lg:py-28 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Photography Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-xl border border-neutral-200 aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?q=80&w=1000&auto=format&fit=crop"
                alt="Roasting batch in cast iron drum"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Small floating badge */}
            <div className="absolute -bottom-6 -right-6 z-20 bg-neutral-900 text-white p-5 rounded-2xl shadow-xl hidden sm:block border border-neutral-800 max-w-xs">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                Batch Roasting
              </span>
              <p className="text-xs text-neutral-300">
                12kg max per roast curve to ensure even heat transfer and caramelized bean sugars.
              </p>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <span>Our Craft & Philosophy</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight leading-tight">
              Rooted in transparency. Dedicated to exceptional coffee terroir.
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {siteSettings.story}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-neutral-900 text-sm">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  Farm-Direct Sourcing
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  We buy directly from farmer cooperatives at transparent prices without speculative middlemen.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-neutral-900 text-sm">
                  <HeartHandshake className="w-4 h-4 text-amber-700" />
                  Sustainable Stewardship
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Every coffee cherry comes from shade-grown agroforestry preserves that enrich native soil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
