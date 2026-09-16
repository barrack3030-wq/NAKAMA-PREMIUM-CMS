import React, { useState } from 'react';
import { useCms } from '../CmsContext';
import { publishCmsFiles } from '../githubPublisher';
import {
  GitBranch,
  GitCommit,
  UploadCloud,
  CheckCircle2,
  FileCode,
  Download,
  Copy,
  Check,
  RotateCcw,
  FolderTree,
  Loader2
} from 'lucide-react';

export const PublishManager: React.FC = () => {
  const {
    versionHistory,
    hasUnpublishedChanges,
    publishChanges,
    generateGitHubFiles,
    resetToOriginal,
    config
  } = useCms();

  const [commitMessage, setCommitMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<string>('cms-config.json');
  const [copiedFile, setCopiedFile] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [lastPublish, setLastPublish] = useState<{ commitSha?: string; repository?: string; branch?: string } | null>(null);

  const gitFiles = generateGitHubFiles();
  const fileKeys = Object.keys(gitFiles);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (publishing) return;

    setPublishing(true);
    setPublishError('');
    setLastPublish(null);

    try {
      const result = await publishCmsFiles(
        config,
        gitFiles,
        commitMessage.trim() || undefined
      );

      publishChanges(commitMessage.trim() || undefined);
      setLastPublish({
        commitSha: result.commitSha,
        repository: result.repository,
        branch: result.branch
      });
      setCommitMessage('');
    } catch (error: any) {
      setPublishError(error?.message || 'Publish ke GitHub gagal.');
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyCurrentFile = () => {
    if (gitFiles[selectedFile]) {
      navigator.clipboard.writeText(gitFiles[selectedFile]);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    }
  };

  const handleDownloadBundle = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(gitFiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${config.siteName.toLowerCase().replace(/\s+/g, '-')}-content-bundle.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8" id="cms-publish-manager">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-700" />
            Publishing & GitHub
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">Perubahan CMS dikirim ke GitHub dalam satu atomic commit melalui CMS API.</p>
        </div>

        <button type="button" onClick={handleDownloadBundle} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-xs font-medium hover:bg-neutral-50 transition-colors cursor-pointer">
          <Download className="w-3.5 h-3.5" /> Download Content Bundle
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${hasUnpublishedChanges ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider">
              {hasUnpublishedChanges ? 'Unpublished Content Modifications' : 'No Unpublished Changes'}
            </h2>
          </div>
          <span className="text-xs text-neutral-400">{hasUnpublishedChanges ? 'Ready to publish' : 'Working tree clean'}</span>
        </div>

        <form onSubmit={handlePublish} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Contoh: Update menu, gallery, and opening hours"
            className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          />
          <button
            type="submit"
            disabled={publishing || !hasUnpublishedChanges}
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            id="btn-publish-action"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {publishing ? 'Publishing...' : 'Publish to GitHub'}
          </button>
        </form>

        {publishError && <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-xs leading-relaxed">{publishError}</div>}

        {lastPublish && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="w-4 h-4" /> Publish berhasil</div>
            <div>Repository: <span className="font-mono">{lastPublish.repository}</span></div>
            <div>Branch: <span className="font-mono">{lastPublish.branch}</span></div>
            <div>Commit: <span className="font-mono">{lastPublish.commitSha}</span></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h3 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-amber-700" /> Git-Controlled Files ({fileKeys.length})
            </h3>
          </div>
          <div className="space-y-1">
            {fileKeys.map((filePath) => (
              <button key={filePath} type="button" onClick={() => setSelectedFile(filePath)} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${selectedFile === filePath ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                <span className="truncate">{filePath}</span>
                <span className="text-[10px] text-neutral-400 font-sans">JSON</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 bg-neutral-900 rounded-2xl border border-neutral-800 p-5 shadow-xs flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3 text-neutral-400 text-xs">
            <div className="flex items-center gap-2"><FileCode className="w-4 h-4 text-amber-400" /><span className="font-mono text-neutral-200">{selectedFile}</span></div>
            <button type="button" onClick={handleCopyCurrentFile} className="inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs">
              {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedFile ? 'Copied' : 'Copy File Content'}
            </button>
          </div>
          <pre className="text-[12px] font-mono text-emerald-400/90 overflow-x-auto max-h-[380px] p-2 leading-relaxed">{gitFiles[selectedFile] || '// No file selected'}</pre>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><GitCommit className="w-4 h-4 text-amber-700" />Version & Publication Log</h2>
        <div className="divide-y divide-neutral-100">
          {versionHistory.map((commit) => (
            <div key={commit.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="flex items-center gap-2"><span className="font-mono font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{commit.id}</span><span className="font-medium text-neutral-900">{commit.message}</span></div>
                <div className="flex items-center gap-3 text-neutral-400 mt-1"><span>Author: {commit.author}</span><span>•</span><span>{commit.timestamp}</span></div>
              </div>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium self-start sm:self-auto">Published</span>
            </div>
          ))}
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-neutral-200 shadow-xl space-y-4">
            <h3 className="font-bold text-neutral-900 text-base">Reset Demo Data?</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">This restores the original demo content for <span className="font-semibold text-neutral-800">Aura Artisan Cafe</span> and discards unsaved browser modifications.</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowResetConfirm(false)} className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer">Cancel</button>
              <button type="button" onClick={() => { resetToOriginal(); setShowResetConfirm(false); }} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg cursor-pointer">Yes, Reset Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
