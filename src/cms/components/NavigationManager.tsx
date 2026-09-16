import React, { useState } from 'react';
import { useCms } from '../CmsContext';
import { NavigationLink, NavigationSettings } from '../types';
import {
  Compass,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ArrowUpDown
} from 'lucide-react';

export const NavigationManager: React.FC = () => {
  const { navigation, updateNavigation } = useCms();
  const [localNav, setLocalNav] = useState<NavigationSettings>({ ...navigation });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateNavigation(localNav);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleHeaderChange = (idx: number, field: keyof NavigationLink, value: any) => {
    const updated = [...localNav.header];
    updated[idx] = { ...updated[idx], [field]: value };
    setLocalNav({ ...localNav, header: updated });
  };

  const handleAddHeaderLink = () => {
    setLocalNav({
      ...localNav,
      header: [...localNav.header, { label: 'New Link', href: '#', external: false }]
    });
  };

  const handleRemoveHeaderLink = (idx: number) => {
    const updated = [...localNav.header];
    updated.splice(idx, 1);
    setLocalNav({ ...localNav, header: updated });
  };

  const handleFooterChange = (idx: number, field: keyof NavigationLink, value: any) => {
    const updated = [...localNav.footer];
    updated[idx] = { ...updated[idx], [field]: value };
    setLocalNav({ ...localNav, footer: updated });
  };

  const handleAddFooterLink = () => {
    setLocalNav({
      ...localNav,
      footer: [...localNav.footer, { label: 'Footer Link', href: '#' }]
    });
  };

  const handleRemoveFooterLink = (idx: number) => {
    const updated = [...localNav.footer];
    updated.splice(idx, 1);
    setLocalNav({ ...localNav, footer: updated });
  };

  return (
    <div className="space-y-6" id="cms-navigation">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-700" />
            Website Navigation Links
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure header menu links, jump anchors, and footer columns.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium shadow-xs transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          {isSaved ? 'Saved Navigation' : 'Save Links'}
        </button>
      </div>

      {/* Header Navigation Links */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">
              Header Main Menu Links
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Top bar navigation items visible on desktop and mobile drawer
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddHeaderLink}
            className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Header Link
          </button>
        </div>

        <div className="space-y-2.5">
          {localNav.header.map((link, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-200">
              <input
                type="text"
                value={link.label}
                onChange={(e) => handleHeaderChange(idx, 'label', e.target.value)}
                placeholder="Label"
                className="w-1/3 px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-lg"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => handleHeaderChange(idx, 'href', e.target.value)}
                placeholder="URL or anchor (e.g. #menu)"
                className="flex-1 px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-lg font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => handleRemoveHeaderLink(idx)}
                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation Links */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">
              Footer Navigation Links
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Secondary links shown in bottom columns
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddFooterLink}
            className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Footer Link
          </button>
        </div>

        <div className="space-y-2.5">
          {localNav.footer.map((link, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-200">
              <input
                type="text"
                value={link.label}
                onChange={(e) => handleFooterChange(idx, 'label', e.target.value)}
                placeholder="Label"
                className="w-1/3 px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-lg"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => handleFooterChange(idx, 'href', e.target.value)}
                placeholder="URL or anchor"
                className="flex-1 px-3 py-1.5 text-sm bg-white border border-neutral-200 rounded-lg font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => handleRemoveFooterLink(idx)}
                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
