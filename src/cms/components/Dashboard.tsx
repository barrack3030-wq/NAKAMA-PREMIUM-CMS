import React from 'react';
import { useCms } from '../CmsContext';
import {
  Coffee,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  FileText,
  HelpCircle,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  Plus,
  GitBranch,
  ShieldCheck,
  Globe,
  Sliders
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const {
    config,
    schema,
    collections,
    media,
    siteSettings,
    versionHistory,
    hasUnpublishedChanges
  } = useCms();

  const enabledCollectionKeys = Object.keys(schema.collections).filter(
    key => config.features[key] !== false
  );

  // Helper to get icon for collection
  const getCollectionIcon = (key: string) => {
    switch (key) {
      case 'menu':
        return <Coffee className="w-5 h-5 text-amber-700" />;
      case 'gallery':
        return <ImageIcon className="w-5 h-5 text-sky-700" />;
      case 'testimonials':
        return <MessageSquare className="w-5 h-5 text-emerald-700" />;
      case 'reservation':
      case 'bookings':
        return <Calendar className="w-5 h-5 text-indigo-700" />;
      case 'faq':
        return <HelpCircle className="w-5 h-5 text-purple-700" />;
      case 'pages':
      default:
        return <FileText className="w-5 h-5 text-neutral-700" />;
    }
  };

  const reservations = collections['reservation'] || [];
  const pendingReservations = reservations.filter((r: any) => r.status === 'Pending');

  return (
    <div className="space-y-8" id="cms-dashboard">
      {/* Top Banner / Site Status */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-900 capitalize">
              {config.siteType} Architecture
            </span>
            <span className="text-xs text-neutral-400 font-mono">v{config.version || '1.0.0'}</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            {siteSettings.siteName}
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-xl">
            {siteSettings.tagline || 'Universal schema-driven CMS engine managing static production site.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('publish')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <GitBranch className="w-3.5 h-3.5" />
            Git & Deploy
          </button>
          <button
            type="button"
            onClick={() => onNavigate('website-view')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-neutral-200 text-neutral-700 text-xs font-medium hover:bg-neutral-50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            Preview Live
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Dynamic Collection Metric Cards (Only for enabled features!) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-800 tracking-wide uppercase">
            Active Content Collections ({enabledCollectionKeys.length})
          </h2>
          <span className="text-xs text-neutral-400">
            Dynamically adapted from <code className="text-amber-800 font-mono">cms-config.json</code>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enabledCollectionKeys.map(key => {
            const collectionDef = schema.collections[key];
            const count = (collections[key] || []).length;

            return (
              <div
                key={key}
                onClick={() => onNavigate(`collection-${key}`)}
                className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-amber-600/60 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                    {getCollectionIcon(key)}
                  </div>
                  <span className="text-xs text-neutral-400 group-hover:text-amber-700 font-medium flex items-center gap-0.5">
                    Manage
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-2xl font-bold text-neutral-900">{count}</span>
                  <h3 className="text-sm font-semibold text-neutral-800 mt-0.5">
                    {collectionDef.label}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                    {collectionDef.description || `Manage ${collectionDef.label.toLowerCase()}`}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Universal Media Asset Card */}
          <div
            onClick={() => onNavigate('media')}
            className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-amber-600/60 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                <ImageIcon className="w-5 h-5 text-amber-700" />
              </div>
              <span className="text-xs text-neutral-400 group-hover:text-amber-700 font-medium flex items-center gap-0.5">
                Manage
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="mt-4">
              <span className="text-2xl font-bold text-neutral-900">{media.length}</span>
              <h3 className="text-sm font-semibold text-neutral-800 mt-0.5">Media Assets</h3>
              <p className="text-xs text-neutral-400 mt-1">High-res images & photography</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Pending Action items & Engine Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries / Reservations Card (If reservation enabled) */}
        {config.features.reservation && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-700" />
                Latest Guest Reservations
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('collection-reservation')}
                className="text-xs text-amber-700 hover:text-amber-800 font-medium"
              >
                View all ({reservations.length})
              </button>
            </div>

            {reservations.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">No reservations logged yet.</p>
            ) : (
              <div className="space-y-2.5">
                {reservations.slice(0, 3).map((res: any) => (
                  <div
                    key={res.id}
                    className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-neutral-900 block">{res.guestName}</span>
                      <span className="text-neutral-500">
                        {res.guests} Guests • {res.date} at {res.time} • {res.seatingArea}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        res.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Universal Engine Specs & Git Sync */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Universal CMS Architecture Health
            </h3>
            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              Synchronized
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
              <span className="text-neutral-500">Schema Adaptation</span>
              <span className="font-mono font-medium text-neutral-800">
                {config.siteType.toUpperCase()} ({enabledCollectionKeys.length} collections enabled)
              </span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
              <span className="text-neutral-500">Storage Backend</span>
              <span className="font-mono font-medium text-neutral-800">
                JSON Static Files (/content/*)
              </span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
              <span className="text-neutral-500">GitHub Compatibility</span>
              <span className="font-medium text-emerald-700 flex items-center gap-1">
                ✓ 100% Git-Ready (Zero DB dependency)
              </span>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
              <span className="text-neutral-500">Unsaved Changes</span>
              <span className={`font-medium ${hasUnpublishedChanges ? 'text-amber-700' : 'text-neutral-500'}`}>
                {hasUnpublishedChanges ? 'Modifications pending publication' : 'All synced'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
