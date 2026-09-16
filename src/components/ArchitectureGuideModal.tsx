import React from 'react';
import {
  X,
  BookOpen,
  GitBranch,
  Terminal,
  Layers,
  Sparkles,
  FileCode,
  CheckCircle2,
  FolderTree
} from 'lucide-react';

interface ArchitectureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureGuideModal: React.FC<ArchitectureGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-700 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
                Universal CMS Architecture & Setup Guide
              </h2>
              <p className="text-xs text-neutral-500">
                One Universal Engine + Website-Specific Schema + Git-Friendly Content Storage
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: The Core Principle */}
        <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
          <span className="font-bold flex items-center gap-1.5 text-amber-900 uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            The Single Universal Engine Principle
          </span>
          <p className="leading-relaxed">
            The CMS engine is <strong>never</strong> rewritten for a cafe, travel agency, clinic, or school. Instead, every website simply declares two files:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            <div className="bg-white p-2.5 rounded-lg border border-amber-200">
              <strong className="text-amber-800 block">cms-config.json</strong>
              Tells the engine which feature flags are enabled (e.g. menu: true, blog: false).
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-amber-200">
              <strong className="text-amber-800 block">cms-schema.json</strong>
              Defines form fields, types, and labels for each collection.
            </div>
          </div>
        </div>

        {/* Section 2: Predictable Content Storage */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-amber-700" />
            Predictable File Structure
          </h3>
          <pre className="p-4 bg-neutral-900 text-neutral-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`project-root/
├── cms-config.json         # Website feature capabilities
├── cms-schema.json         # Dynamic field definitions
├── content/                # Version-controlled data (human readable)
│   ├── pages/pages.json
│   ├── menu/items.json
│   ├── gallery/items.json
│   ├── testimonials/items.json
│   ├── reservation/items.json
│   ├── faq/items.json
│   ├── settings/site.json
│   ├── seo/seo.json
│   ├── media/library.json
│   └── navigation/links.json
└── src/
    ├── cms/                # Reusable Universal CMS Engine
    └── website/            # Static Customer Website`}
          </pre>
        </div>

        {/* Section 3: Setup Instructions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-700" />
            Quick Setup & Local Run
          </h3>
          <ol className="list-decimal list-inside text-xs text-neutral-600 space-y-1.5 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <li>Clone or export your project repository.</li>
            <li>Run <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-300 font-mono text-neutral-800">npm install</code> to install dependencies.</li>
            <li>Run <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-300 font-mono text-neutral-800">npm run dev</code> to boot the development server on port 3000.</li>
            <li>Content changes in the CMS can be saved to local storage or exported as JSON bundles for git commits.</li>
          </ol>
        </div>

        {/* Section 4: GitHub Deployment */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-amber-700" />
            GitHub Deployment Workflow
          </h3>
          <div className="text-xs text-neutral-600 space-y-2 leading-relaxed">
            <p>
              Because content is stored in clean JSON files, content updates can be committed directly to GitHub with zero external database dependencies:
            </p>
            <div className="p-3 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-[11px] space-y-1">
              <p className="text-neutral-400"># After modifying content in Universal CMS or editing /content/*.json:</p>
              <p className="text-emerald-400">git add content/ cms-config.json cms-schema.json</p>
              <p className="text-emerald-400">git commit -m "Update seasonal menu and hours"</p>
              <p className="text-emerald-400">git push origin main</p>
            </div>
            <p className="text-neutral-500">
              When pushed to GitHub, automated CI/CD (such as GitHub Actions, Cloudflare Pages, or Vercel) runs <code className="font-mono text-neutral-700">npm run build</code> and serves the static production output instantly.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
