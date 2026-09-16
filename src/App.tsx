/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CmsProvider, useCms } from './cms/CmsContext';
import { UniversalCMS } from './cms/UniversalCMS';
import { WebsiteView } from './website/WebsiteView';
import { ArchitectureGuideModal } from './components/ArchitectureGuideModal';
import { AuthGate } from './auth/AuthGate';
import {
  Globe,
  Sliders,
  Columns,
  BookOpen
} from 'lucide-react';

type ViewMode = 'website' | 'cms' | 'split';

const AppContent: React.FC = () => {
  const { config } = useCms();
  const [viewMode, setViewMode] = useState<ViewMode>('website');
  const [showDocsModal, setShowDocsModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-neutral-100 font-sans">
      <div className="bg-neutral-950 border-b border-neutral-800 px-3 sm:px-6 py-2 flex items-center justify-between z-50 text-xs shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white tracking-tight hidden sm:inline">
              Universal CMS & Static Site
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-neutral-400 pl-3 border-l border-neutral-800">
            <span>Config:</span>
            <span className="font-mono text-amber-400 font-medium">
              {config.siteType}
            </span>
          </div>
        </div>

        <div className="flex items-center bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
          <button
            type="button"
            onClick={() => setViewMode('website')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer ${viewMode === 'website' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Live Website</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('cms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer ${viewMode === 'cms' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Universal CMS</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer ${viewMode === 'split' ? 'bg-amber-700 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split Screen</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDocsModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors text-xs font-medium cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Docs & Deployment</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'website' && (
          <div className="flex-1 overflow-y-auto">
            <WebsiteView
              onOpenCms={() => setViewMode('cms')}
              onOpenCmsReservations={() => setViewMode('cms')}
            />
          </div>
        )}

        {viewMode === 'cms' && (
          <div className="flex-1 overflow-y-auto">
            <UniversalCMS
              onSwitchToWebsite={() => setViewMode('website')}
              onToggleSplitView={() => setViewMode('split')}
              isSplitView={false}
            />
          </div>
        )}

        {viewMode === 'split' && (
          <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-neutral-800 overflow-hidden">
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
              <div className="bg-neutral-900 text-neutral-400 px-4 py-2 text-xs flex items-center justify-between border-b border-neutral-800 shrink-0">
                <span className="flex items-center gap-2 font-medium text-white">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Live Website (Instant Real-time Sync)
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Changes in CMS reflect here immediately
                </span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <WebsiteView
                  onOpenCms={() => setViewMode('cms')}
                  onOpenCmsReservations={() => setViewMode('cms')}
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-100">
              <div className="bg-neutral-900 text-neutral-400 px-4 py-2 text-xs flex items-center justify-between border-b border-neutral-800 shrink-0">
                <span className="flex items-center gap-2 font-medium text-white">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  Universal CMS Engine
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode('cms')}
                  className="text-amber-400 hover:text-amber-300 text-[11px] font-medium"
                >
                  Full CMS View
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <UniversalCMS
                  onSwitchToWebsite={() => setViewMode('website')}
                  onToggleSplitView={() => setViewMode('website')}
                  isSplitView={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <ArchitectureGuideModal
        isOpen={showDocsModal}
        onClose={() => setShowDocsModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthGate>
      <CmsProvider>
        <AppContent />
      </CmsProvider>
    </AuthGate>
  );
}
