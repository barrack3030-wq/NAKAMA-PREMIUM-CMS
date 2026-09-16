import React, { useState } from 'react';
import { useCms } from '../cms/CmsContext';
import { Coffee, Star, Sparkles } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const { collections } = useCms();
  const menuItems = collections['menu'] || [];

  const categories = [
    'All',
    'Specialty Coffee',
    'Artisan Teas & Tonics',
    'Savory Kitchen',
    'Bakes & Pastries'
  ];

  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = menuItems.filter((item: any) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="menu" className="py-20 lg:py-28 bg-neutral-50 text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-800 bg-amber-100/60 px-3 py-1 rounded-full border border-amber-200">
            Seasonal Selections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Micro Roastery & Kitchen Menu
          </h2>
          <p className="text-sm text-neutral-600">
            Crafted daily with unhurried care. All pour-overs brewed on V60 or Kalita Wave with precision water chemistry.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200">
            <p className="text-neutral-500 text-sm">No items currently available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {item.image && (
                    <div className="aspect-16/10 bg-neutral-100 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      {item.isFeatured && (
                        <span className="absolute top-3 right-3 bg-amber-700 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-neutral-900 group-hover:text-amber-800 transition-colors">
                          {item.name}
                        </h3>
                        <span className="text-[11px] text-amber-700 font-medium tracking-wide uppercase">
                          {item.category}
                        </span>
                      </div>
                      <span className="font-bold text-base text-neutral-900 shrink-0">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {item.dietary && item.dietary.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-100">
                      {item.dietary.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-neutral-50 text-neutral-600 px-2 py-0.5 rounded border border-neutral-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
