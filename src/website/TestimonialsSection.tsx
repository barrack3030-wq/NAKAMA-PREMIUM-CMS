import React from 'react';
import { useCms } from '../cms/CmsContext';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { collections } = useCms();
  const testimonials = collections['testimonials'] || [];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-neutral-900 text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
            Guest Praise & Reviews
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Words from Coffee Lovers
          </h2>
          <p className="text-sm text-neutral-400">
            What neighborhood regulars, visiting travelers, and culinary critics have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item: any) => (
            <div
              key={item.id}
              className="bg-neutral-800/80 rounded-2xl border border-neutral-700/80 p-6 flex flex-col justify-between space-y-6 hover:border-neutral-600 transition-colors"
            >
              <div className="space-y-4">
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating || 5 }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-neutral-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-neutral-700/60">
                {item.avatar && (
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-600"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.author}</h4>
                  <span className="text-xs text-amber-400/90">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
