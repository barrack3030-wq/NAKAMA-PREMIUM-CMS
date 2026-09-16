import React, { useState, useRef } from 'react';
import { useCms } from '../CmsContext';
import { MediaItem } from '../types';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  ExternalLink,
  Tag,
  Eye,
  X,
  Filter
} from 'lucide-react';

interface MediaLibraryProps {
  onSelect?: (url: string) => void;
  isModal?: boolean;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ onSelect, isModal = false }) => {
  const { media, addMediaItem, updateMediaItem, deleteMediaItem } = useCms();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract all unique tags
  const allTags = Array.from(
    new Set(media.flatMap(item => item.tags || []))
  );

  const filteredMedia = media.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.altText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag =
      selectedTag === 'all' || (item.tags && item.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const handleCopyUrl = (url: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const processUploadedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newItem: MediaItem = {
        id: `media-${Date.now()}`,
        name: file.name,
        url: dataUrl,
        type: file.type || 'image/jpeg',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        dimensions: 'Uploaded Asset',
        altText: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        tags: ['uploaded'],
        createdAt: new Date().toISOString().split('T')[0]
      };
      addMediaItem(newItem);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(processUploadedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(processUploadedFile);
    }
  };

  return (
    <div className={`space-y-6 ${isModal ? 'p-1' : ''}`} id="cms-media-library">
      {/* Header & Upload Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-700" />
            Media Assets Library
          </h2>
          <p className="text-sm text-neutral-500">
            {media.length} visual assets indexed. Drag & drop or click to upload new files.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            id="btn-upload-media"
          >
            <Upload className="w-4 h-4" />
            Upload Assets
          </button>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-amber-600 bg-amber-50/50'
            : 'border-neutral-200 bg-neutral-50/70 hover:border-neutral-300 hover:bg-neutral-100/50'
        }`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-neutral-800">
            Drop your images here, or <span className="text-amber-700 underline underline-offset-2">browse files</span>
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Supports PNG, JPG, WebP, SVG up to 10MB each. Human-readable local assets.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by filename or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
            <span className="text-xs text-neutral-400 flex items-center gap-1 px-1">
              <Filter className="w-3.5 h-3.5" />
              Tag:
            </span>
            <button
              type="button"
              onClick={() => setSelectedTag('all')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedTag === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                  selectedTag === tag
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-neutral-200">
          <ImageIcon className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-neutral-700">No media assets found</p>
          <p className="text-xs text-neutral-400 mt-1">Try adjusting your search or upload a new photo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (onSelect) {
                  onSelect(item.url);
                } else {
                  setActiveMedia(item);
                }
              }}
              className="group relative bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-4/3 w-full bg-neutral-100 overflow-hidden relative">
                <img
                  src={item.url}
                  alt={item.altText || item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    title="Copy URL"
                    onClick={(e) => handleCopyUrl(item.url, item.id, e)}
                    className="p-1.5 bg-white/90 rounded-md text-neutral-800 hover:bg-white shadow-xs"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    title="View Details"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMedia(item);
                    }}
                    className="p-1.5 bg-white/90 rounded-md text-neutral-800 hover:bg-white shadow-xs"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <p className="text-xs font-medium text-neutral-800 truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
                  <span>{item.size}</span>
                  {item.tags && item.tags.length > 0 && (
                    <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-[10px] text-neutral-600">
                      {item.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Detail Modal */}
      {activeMedia && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <h3 className="font-semibold text-neutral-900 text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-700" />
                Asset Metadata & Details
              </h3>
              <button
                type="button"
                onClick={() => setActiveMedia(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 max-h-64 flex items-center justify-center">
                <img
                  src={activeMedia.url}
                  alt={activeMedia.altText}
                  className="max-h-64 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                <div>
                  <span className="text-neutral-400 block">File Name</span>
                  <span className="font-medium text-neutral-800 break-all">{activeMedia.name}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Size / Format</span>
                  <span className="font-medium text-neutral-800">{activeMedia.size} • {activeMedia.type}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Dimensions</span>
                  <span className="font-medium text-neutral-800">{activeMedia.dimensions || 'Dynamic'}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Date Added</span>
                  <span className="font-medium text-neutral-800">{activeMedia.createdAt}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={activeMedia.altText}
                  onChange={(e) => {
                    const newAlt = e.target.value;
                    setActiveMedia({ ...activeMedia, altText: newAlt });
                    updateMediaItem(activeMedia.id, { altText: newAlt });
                  }}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
                  placeholder="Describe image for screen readers and search engines..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(activeMedia.url, activeMedia.id)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 rounded-lg text-xs font-medium transition-colors"
                >
                  {copiedId === activeMedia.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied URL
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Asset URL
                    </>
                  )}
                </button>

                {onSelect && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(activeMedia.url);
                      setActiveMedia(null);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Select for Field
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete asset "${activeMedia.name}"?`)) {
                      deleteMediaItem(activeMedia.id);
                      setActiveMedia(null);
                    }
                  }}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium border border-rose-200 transition-colors"
                  title="Delete media"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
