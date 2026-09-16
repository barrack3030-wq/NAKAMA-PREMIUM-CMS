import React from 'react';
import { useCms } from '../cms/CmsContext';
import {
  Coffee,
  Clock,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Sliders
} from 'lucide-react';

interface FooterProps {
  onOpenCms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCms }) => {
  const { siteSettings, navigation, seoSettings } = useCms();

  return (
    <footer id="contact" className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-700 text-amber-50 flex items-center justify-center font-serif font-bold text-lg">
                A
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-tight">
                {siteSettings.siteName}
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              {siteSettings.tagline}. Single-origin micro roastery and seasonal kitchen in Portland, Oregon.
            </p>

            <div className="flex items-center gap-3 pt-2 text-neutral-400">
              {siteSettings.socials.instagram && (
                <a
                  href={siteSettings.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socials.twitter && (
                <a
                  href={siteSettings.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {siteSettings.socials.facebook && (
                <a
                  href={siteSettings.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Operating Hours (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Roastery Hours
            </h4>

            <div className="space-y-2 text-xs">
              {siteSettings.hours.map((h, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-neutral-900 pb-1.5">
                  <span className="text-neutral-400">{h.days}</span>
                  <span className="text-neutral-200 font-medium">{h.time}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-neutral-500">
              * Espresso bar opens 30 min before full kitchen service.
            </div>
          </div>

          {/* Col 3: Contact & Links (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              Location & Inquiries
            </h4>

            <div className="space-y-2 text-xs text-neutral-400">
              <p className="text-neutral-200 font-medium">
                {siteSettings.contact.address}
                <br />
                {siteSettings.contact.city}
              </p>
              <p className="flex items-center gap-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <a href={`tel:${siteSettings.contact.phone}`} className="hover:text-white transition-colors">
                  {siteSettings.contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <a href={`mailto:${siteSettings.contact.email}`} className="hover:text-white transition-colors">
                  {siteSettings.contact.email}
                </a>
              </p>
            </div>

            {/* Navigation Quicklinks */}
            <div className="pt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs border-t border-neutral-900">
              {navigation.footer.map((link, idx) => (
                <a key={idx} href={link.href} className="hover:text-neutral-200 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} {siteSettings.siteName}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
              Powered by <strong className="text-neutral-200 font-medium">Universal CMS Engine</strong>
            </span>

            {onOpenCms && (
              <button
                type="button"
                onClick={onOpenCms}
                className="text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
