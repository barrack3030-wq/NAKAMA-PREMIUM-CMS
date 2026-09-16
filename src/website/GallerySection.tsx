import React, { useState } from 'react';
import { useCms } from '../cms/CmsContext';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { collections } = useCms();
  const galleryItems = collections['gallery'] || [];

  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<any | null>(null);

  const categories = ['All', 'Interior', 'Roasting', 'Latte Art', 'Kitchen', 'Community'];

  const filteredItems = galleryItems.filter((item: any) => {
    if (activeFilter === 'All') return true;
    return item.category === activeFilter;
  });

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Atmosphere & Ritual
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Life at the Roastery
          </h2>
          <p className="text-sm text-neutral-600">
            Sunlit timber tables, artisan ceramics, and the slow tempo of morning extraction.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeFilter === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {filteredItems.map((item: any) => (
            <div
              key={item.id}
              onClick={() => setLightboxImage(item)}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-neutral-100 cursor-pointer shadow-xs hover:shadow-lg transition-all"
            >
              <img
                src={item.url}
                alt={item.altText || item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
                  {item.category}
                </span>
                <p className="text-sm font-medium leading-tight mt-0.5">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800"
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/50 rounded-full z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.altText || lightboxImage.title}
              className="w-full max-h-[80vh] object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-white text-xs">
              <div>
                <span className="font-semibold block">{lightboxImage.title}</span>
                <span className="text-neutral-400 text-[11px]">{lightboxImage.category}</span>
              </div>
              <span className="text-neutral-500 text-[11px] font-mono">Managed by Universal CMS</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
