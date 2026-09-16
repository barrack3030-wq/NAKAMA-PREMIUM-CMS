import React, { useState } from 'react';
import { useCms } from '../CmsContext';
import { PRESETS } from '../presets';
import {
  Layers,
  Sparkles,
  Check,
  CheckCircle2,
  SlidersHorizontal,
  Code,
  AlertCircle
} from 'lucide-react';

export const PresetSwitcher: React.FC = () => {
  const { config, updateConfig, loadPreset, activePresetId } = useCms();
  const [showConfigEditor, setShowConfigEditor] = useState(false);

  const handleToggleFeature = (featureKey: string, currentValue: boolean) => {
    updateConfig({
      ...config,
      features: {
        ...config.features,
        [featureKey]: !currentValue
      }
    });
  };

  return (
    <div className="space-y-6" id="cms-preset-switcher">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-700" />
          Adaptive Universal CMS Architecture
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Notice how the single reusable CMS engine automatically reconfigures its navigation, forms, and dashboard sections based purely on the schema.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(PRESETS).map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => loadPreset(preset.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-50/50 border-amber-600 ring-2 ring-amber-600/20 shadow-sm'
                  : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                    {preset.badge}
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-amber-800">
                      <Check className="w-3.5 h-3.5" />
                      Active
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-neutral-900">{preset.name}</h3>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Collections: {Object.keys(preset.schema.collections).length}</span>
                <span className="font-mono text-neutral-600">siteType: "{preset.config.siteType}"</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Feature Toggles in active cms-config.json */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-700" />
              Live Feature Flags for "{config.siteName}"
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Toggle features on or off in <code className="text-amber-800 font-mono">cms-config.json</code> to see the CMS menu and dashboard dynamically adapt.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {Object.entries(config.features).map(([featKey, isEnabled]) => (
            <div
              key={featKey}
              onClick={() => handleToggleFeature(featKey, Boolean(isEnabled))}
              className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                isEnabled
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                  : 'bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              <span className="capitalize">{featKey}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${isEnabled ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'}`}>
                {isEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
