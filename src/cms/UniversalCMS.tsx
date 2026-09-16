import React, { useState } from 'react';
import { useCms } from './CmsContext';
import { CollectionDefinition } from './types';
import { Dashboard } from './components/Dashboard';
import { CollectionManager } from './components/CollectionManager';
import { MediaLibrary } from './components/MediaLibrary';
import { SeoManager } from './components/SeoManager';
import { WebsiteSettings } from './components/WebsiteSettings';
import { NavigationManager } from './components/NavigationManager';
import { PublishManager } from './components/PublishManager';
import { PresetSwitcher } from './components/PresetSwitcher';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Globe,
  Sliders,
  Compass,
  GitBranch,
  Layers,
  Menu as MenuIcon,
  X,
  Eye,
  Coffee,
  Calendar,
  MessageSquare,
  FileText,
  HelpCircle,
  Briefcase,
  MapPin,
  Activity,
  UserCheck,
  ChevronRight,
  Sparkles,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';

interface UniversalCmsProps {
  onSwitchToWebsite?: () => void;
  onToggleSplitView?: () => void;
  isSplitView?: boolean;
}

export const UniversalCMS: React.FC<UniversalCmsProps> = ({
  onSwitchToWebsite,
  onToggleSplitView,
  isSplitView = false
}) => {
  const {
    config,
    schema,
    hasUnpublishedChanges,
    publishChanges,
    collections
  } = useCms();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [publishToast, setPublishToast] = useState<boolean>(false);

  // Filter collections based on config.features
  const enabledCollections = (Object.entries(schema.collections) as [string, CollectionDefinition][]).filter(
    ([key]) => config.features[key] !== false
  );

  const getNavIcon = (iconName: string, key: string) => {
    switch (iconName) {
      case 'coffee':
        return <Coffee className="w-4 h-4" />;
      case 'calendar':
      case 'clock':
        return <Calendar className="w-4 h-4" />;
      case 'message-square':
        return <MessageSquare className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'help-circle':
        return <HelpCircle className="w-4 h-4" />;
      case 'map-pin':
        return <MapPin className="w-4 h-4" />;
      case 'briefcase':
        return <Briefcase className="w-4 h-4" />;
      case 'user-check':
        return <UserCheck className="w-4 h-4" />;
      case 'activity':
        return <Activity className="w-4 h-4" />;
      case 'file-text':
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleQuickPublish = () => {
    publishChanges();
    setPublishToast(true);
    setTimeout(() => setPublishToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans" id="universal-cms-root">
      {/* CMS Top Navigation Bar */}
      <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg md:hidden"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              U
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-neutral-900">
                  UniversalCMS
                </span>
                <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-mono font-medium border border-neutral-200">
                  {config.siteType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasUnpublishedChanges && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Unpublished edits
            </span>
          )}

          <button
            type="button"
            onClick={handleQuickPublish}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              hasUnpublishedChanges
                ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
            id="btn-top-publish"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Publish
          </button>

          {onToggleSplitView && (
            <button
              type="button"
              onClick={onToggleSplitView}
              className={`hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                isSplitView
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              Split View
            </button>
          )}

          {onSwitchToWebsite && (
            <button
              type="button"
              onClick={onSwitchToWebsite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs cursor-pointer"
              id="btn-view-live-site"
            >
              <Eye className="w-3.5 h-3.5" />
              View Site
            </button>
          )}
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-white border-r border-neutral-200 flex flex-col justify-between transition-all duration-200 z-20 ${
            mobileMenuOpen
              ? 'fixed inset-y-0 left-0 top-[57px] shadow-xl'
              : 'hidden md:flex'
          }`}
        >
          <div className="p-4 space-y-6 overflow-y-auto">
            {/* Core Universal Navigation */}
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-2">
                Core CMS
              </p>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-neutral-500" />
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('media'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'media'
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-neutral-500" />
                  Media Library
                </button>
              </nav>
            </div>

            {/* Dynamic Content Collections (Only enabled features!) */}
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Collections ({enabledCollections.length})
                </p>
                <span className="text-[10px] text-neutral-400 font-mono">Dynamic</span>
              </div>
              <nav className="space-y-1">
                {enabledCollections.map(([key, colDef]) => {
                  const itemCount = (collections[key] || []).length;
                  const isActive = activeTab === `collection-${key}`;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setActiveTab(`collection-${key}`); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-amber-50 text-amber-900 font-semibold'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-amber-700' : 'text-neutral-500'}>
                          {getNavIcon(colDef.icon, key)}
                        </span>
                        <span>{colDef.label}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded font-mono">
                        {itemCount}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Universal Website Administration */}
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-2">
                Website Engine
              </p>
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab('seo'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'seo'
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <Globe className="w-4 h-4 text-neutral-500" />
                  SEO & Social Cards
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-neutral-500" />
                  Website Settings
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('navigation'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'navigation'
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <Compass className="w-4 h-4 text-neutral-500" />
                  Navigation
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('publish'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'publish'
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <GitBranch className="w-4 h-4 text-neutral-500" />
                  Publish & GitHub
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('presets'); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'presets'
                      ? 'bg-amber-50 text-amber-900 font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <Layers className="w-4 h-4 text-neutral-500" />
                  Adaptive Schemas
                </button>
              </nav>
            </div>
          </div>

          {/* Footer note inside sidebar */}
          <div className="p-3 border-t border-neutral-200 bg-neutral-50/70 text-[11px] text-neutral-500">
            <span className="font-semibold text-neutral-800 block">Single Universal Engine</span>
            <span>Zero hard-coded site types. Driven by JSON schema.</span>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigate={(view) => {
                if (view === 'website-view') {
                  if (onSwitchToWebsite) onSwitchToWebsite();
                } else {
                  setActiveTab(view);
                }
              }}
            />
          )}

          {activeTab === 'media' && <MediaLibrary />}
          {activeTab === 'seo' && <SeoManager />}
          {activeTab === 'settings' && <WebsiteSettings />}
          {activeTab === 'navigation' && <NavigationManager />}
          {activeTab === 'publish' && <PublishManager />}
          {activeTab === 'presets' && <PresetSwitcher />}

          {activeTab.startsWith('collection-') && (
            <CollectionManager collectionKey={activeTab.replace('collection-', '')} />
          )}
        </main>
      </div>

      {/* Publish Notification Toast */}
      {publishToast && (
        <div className="fixed bottom-5 right-5 bg-neutral-900 text-white text-xs px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Content successfully published to live website!</span>
        </div>
      )}
    </div>
  );
};
