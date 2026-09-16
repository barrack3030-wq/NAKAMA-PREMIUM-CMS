import React, { useState } from 'react';
import { useCms } from '../cms/CmsContext';
import {
  Coffee,
  Menu as MenuIcon,
  X,
  Clock,
  MapPin,
  Sparkles,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  onOpenCms?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCms }) => {
  const { siteSettings, navigation } = useCms();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 text-white">
      {/* Optional Announcement Banner */}
      {siteSettings.announcement?.enabled && siteSettings.announcement.text && (
        <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-amber-50 text-xs py-2 px-4 text-center font-medium tracking-wide border-b border-amber-600/40">
          <span>{siteSettings.announcement.text}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-700 text-amber-50 flex items-center justify-center font-serif font-bold text-xl shadow-md group-hover:bg-amber-600 transition-colors">
            A
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-white block group-hover:text-amber-200 transition-colors">
              {siteSettings.siteName.split('&')[0].trim()}
            </span>
            <span className="text-[10px] text-amber-200/80 tracking-widest uppercase block font-mono">
              Micro Roastery & Kitchen
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          {navigation.header.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="hover:text-amber-400 transition-colors tracking-wide text-xs uppercase"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {onOpenCms && (
            <button
              type="button"
              onClick={onOpenCms}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              title="Open Universal CMS Dashboard"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              CMS Admin
            </button>
          )}

          <a
            href="#reserve"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-medium uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            Reserve Table
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="md:hidden p-2 text-neutral-400 hover:text-white"
          aria-label="Toggle Menu"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-neutral-800 px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navigation.header.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="text-neutral-300 hover:text-amber-400 text-sm font-medium uppercase tracking-wider py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
            <a
              href="#reserve"
              onClick={() => setMobileNavOpen(false)}
              className="w-full text-center py-2.5 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-xs font-medium uppercase tracking-wider"
            >
              Reserve Table
            </a>

            {onOpenCms && (
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  onOpenCms();
                }}
                className="w-full text-center py-2 bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Open Universal CMS Admin
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
