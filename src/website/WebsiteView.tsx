import React from 'react';
import { useCms } from '../cms/CmsContext';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { StorySection } from './StorySection';
import { MenuSection } from './MenuSection';
import { GallerySection } from './GallerySection';
import { TestimonialsSection } from './TestimonialsSection';
import { ReservationSection } from './ReservationSection';
import { FaqSection } from './FaqSection';
import { Footer } from './Footer';

interface WebsiteViewProps {
  onOpenCms?: () => void;
  onOpenCmsReservations?: () => void;
}

export const WebsiteView: React.FC<WebsiteViewProps> = ({
  onOpenCms,
  onOpenCmsReservations
}) => {
  const { config } = useCms();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-amber-200 selection:text-amber-900" id="public-website-view">
      <Navbar onOpenCms={onOpenCms} />

      <main className="flex-1">
        <HeroSection />
        <StorySection />

        {/* Dynamic sections rendered only if enabled in cms-config.json */}
        {config.features.menu && <MenuSection />}
        {config.features.gallery && <GallerySection />}
        {config.features.testimonials && <TestimonialsSection />}
        {config.features.reservation && (
          <ReservationSection onOpenCmsReservations={onOpenCmsReservations} />
        )}
        {config.features.faq && <FaqSection />}
      </main>

      <Footer onOpenCms={onOpenCms} />
    </div>
  );
};
