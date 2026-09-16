import React, { useState } from 'react';
import { useCms } from '../CmsContext';
import { SiteSettings } from '../types';
import {
  Sliders,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Megaphone
} from 'lucide-react';

export const WebsiteSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useCms();
  const [localSettings, setLocalSettings] = useState<SiteSettings>({ ...siteSettings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleHourChange = (index: number, field: 'days' | 'time', value: string) => {
    const updated = [...localSettings.hours];
    updated[index] = { ...updated[index], [field]: value };
    setLocalSettings({ ...localSettings, hours: updated });
  };

  const handleAddHourRow = () => {
    setLocalSettings({
      ...localSettings,
      hours: [...localSettings.hours, { days: 'Saturday', time: '8:00 AM – 4:00 PM' }]
    });
  };

  const handleRemoveHourRow = (index: number) => {
    const updated = [...localSettings.hours];
    updated.splice(index, 1);
    setLocalSettings({ ...localSettings, hours: updated });
  };

  return (
    <div className="space-y-6" id="cms-settings">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-700" />
            Website Brand & Identity Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure contact info, business hours, brand story narrative, and live announcement bars.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium shadow-xs transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          {isSaved ? 'Saved Settings' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Narrative */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">
            Brand Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Website / Business Name
              </label>
              <input
                type="text"
                value={localSettings.siteName}
                onChange={(e) => setLocalSettings({ ...localSettings, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Founded Year
              </label>
              <input
                type="number"
                value={localSettings.foundedYear}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    foundedYear: parseInt(e.target.value, 10) || 2024
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Primary Brand Tagline
            </label>
            <input
              type="text"
              value={localSettings.tagline}
              onChange={(e) => setLocalSettings({ ...localSettings, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Brand Story / Mission Statement
            </label>
            <textarea
              rows={4}
              value={localSettings.story}
              onChange={(e) => setLocalSettings({ ...localSettings, story: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">
            Contact & Physical Location
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                Phone Number
              </label>
              <input
                type="text"
                value={localSettings.contact.phone}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    contact: { ...localSettings.contact, phone: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                Email Address
              </label>
              <input
                type="email"
                value={localSettings.contact.email}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    contact: { ...localSettings.contact, email: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                Street Address
              </label>
              <input
                type="text"
                value={localSettings.contact.address}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    contact: { ...localSettings.contact, address: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                City, State, Zip
              </label>
              <input
                type="text"
                value={localSettings.contact.city}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    contact: { ...localSettings.contact, city: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-neutral-400" />
              Operating Hours
            </h2>
            <button
              type="button"
              onClick={handleAddHourRow}
              className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-medium cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Schedule Row
            </button>
          </div>

          <div className="space-y-2">
            {localSettings.hours.map((row, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={row.days}
                  onChange={(e) => handleHourChange(idx, 'days', e.target.value)}
                  placeholder="Days (e.g. Monday – Friday)"
                  className="w-1/2 px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg"
                />
                <input
                  type="text"
                  value={row.time}
                  onChange={(e) => handleHourChange(idx, 'time', e.target.value)}
                  placeholder="Hours (e.g. 7:00 AM – 6:00 PM)"
                  className="flex-1 px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHourRow(idx)}
                  className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-amber-700" />
                Announcement Header Banner
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Promote seasonal roasts, events, or notices across the top of the website.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.announcement?.enabled ?? false}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    announcement: {
                      enabled: e.target.checked,
                      text: localSettings.announcement?.text || ''
                    }
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-700"></div>
            </label>
          </div>

          {localSettings.announcement?.enabled && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Banner Message Text
              </label>
              <input
                type="text"
                value={localSettings.announcement?.text || ''}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    announcement: {
                      enabled: true,
                      text: e.target.value
                    }
                  })
                }
                placeholder="e.g. Seasonal single origin lot now pouring..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg"
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
