import React, { useState } from 'react';
import { CollectionDefinition, FieldDefinition } from '../types';
import { MediaLibrary } from './MediaLibrary';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Link,
  Mail,
  Phone,
  DollarSign,
  Palette,
  Search,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';

interface FormEngineProps {
  collectionKey: string;
  collection: CollectionDefinition;
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  allCollections?: Record<string, any[]>;
}

export const FormEngine: React.FC<FormEngineProps> = ({
  collectionKey,
  collection,
  initialData = {},
  onSave,
  onCancel,
  allCollections = {}
}) => {
  const [formData, setFormData] = useState<any>(() => {
    // Populate with initialData or default values from schema
    const defaultData: any = { ...initialData };
    collection.fields.forEach(field => {
      if (defaultData[field.name] === undefined) {
        if (field.defaultValue !== undefined) {
          defaultData[field.name] = field.defaultValue;
        } else if (field.type === 'toggle' || field.type === 'checkbox') {
          defaultData[field.name] = false;
        } else if (field.type === 'repeater' || field.type === 'gallery') {
          defaultData[field.name] = [];
        } else if (field.type === 'number' || field.type === 'price') {
          defaultData[field.name] = field.min || 0;
        } else if (field.type === 'seo') {
          defaultData[field.name] = {
            metaTitle: '',
            metaDescription: '',
            slug: '',
            canonicalUrl: '',
            ogImage: '',
            noIndex: false
          };
        } else {
          defaultData[field.name] = '';
        }
      }
    });
    return defaultData;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mediaPickerField, setMediaPickerField] = useState<string | null>(null);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const handleRepeaterAdd = (fieldName: string) => {
    const currentList = Array.isArray(formData[fieldName]) ? formData[fieldName] : [];
    handleFieldChange(fieldName, [...currentList, '']);
  };

  const handleRepeaterChange = (fieldName: string, index: number, value: string) => {
    const currentList = [...(formData[fieldName] || [])];
    currentList[index] = value;
    handleFieldChange(fieldName, currentList);
  };

  const handleRepeaterRemove = (fieldName: string, index: number) => {
    const currentList = [...(formData[fieldName] || [])];
    currentList.splice(index, 1);
    handleFieldChange(fieldName, currentList);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    collection.fields.forEach(field => {
      if (field.required) {
        const val = formData[field.name];
        if (val === undefined || val === null || val === '') {
          newErrors[field.name] = `${field.label} is required`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  // Render individual field input based on schema field type
  const renderFieldInput = (field: FieldDefinition) => {
    const value = formData[field.name];

    switch (field.type) {
      case 'text':
      default:
        return (
          <input
            type="text"
            id={`field-${field.name}`}
            value={value ?? ''}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={`w-full px-3.5 py-2.5 bg-white border ${
              errors[field.name] ? 'border-rose-500 ring-1 ring-rose-500' : 'border-neutral-200'
            } rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600`}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={`field-${field.name}`}
            rows={4}
            value={value ?? ''}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 resize-y"
          />
        );

      case 'rich-text':
      case 'markdown':
        return (
          <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
            <div className="flex items-center gap-1 p-2 bg-neutral-50 border-b border-neutral-200 text-xs text-neutral-600">
              <span className="font-medium px-2 py-0.5 rounded bg-neutral-200/60 text-neutral-700">Rich Markdown Editor</span>
              <span className="text-neutral-400 ml-auto">Supports **bold**, *italics*, lists, links</span>
            </div>
            <textarea
              id={`field-${field.name}`}
              rows={6}
              value={value ?? ''}
              placeholder={field.placeholder || 'Write formatted content in markdown or standard text...'}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full p-3.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-hidden font-mono resize-y"
            />
          </div>
        );

      case 'price':
        return (
          <div className="relative">
            <DollarSign className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              step="0.01"
              id={`field-${field.name}`}
              value={value ?? ''}
              placeholder={field.placeholder || '0.00'}
              onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || 0)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            id={`field-${field.name}`}
            value={value ?? 0}
            min={field.min}
            max={field.max}
            onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value, 10) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          />
        );

      case 'email':
        return (
          <div className="relative">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              id={`field-${field.name}`}
              value={value ?? ''}
              placeholder="name@example.com"
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
        );

      case 'phone':
        return (
          <div className="relative">
            <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              id={`field-${field.name}`}
              value={value ?? ''}
              placeholder="+1 (555) 000-0000"
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
        );

      case 'url':
        return (
          <div className="relative">
            <Link className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              id={`field-${field.name}`}
              value={value ?? ''}
              placeholder="https://..."
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
        );

      case 'date':
        return (
          <div className="relative">
            <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              id={`field-${field.name}`}
              value={value ?? ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
        );

      case 'time':
        return (
          <div className="relative">
            <Clock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="time"
              id={`field-${field.name}`}
              value={value ?? ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>
        );

      case 'select':
        return (
          <select
            id={`field-${field.name}`}
            value={value ?? ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          >
            <option value="">Select an option...</option>
            {field.options?.map((opt: any) => {
              const label = typeof opt === 'string' ? opt : opt.label;
              const val = typeof opt === 'string' ? opt : opt.value;
              return (
                <option key={val} value={val}>
                  {label}
                </option>
              );
            })}
          </select>
        );

      case 'toggle':
      case 'checkbox':
        return (
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              id={`field-${field.name}`}
              checked={Boolean(value)}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-700"></div>
            <span className="ml-3 text-sm font-medium text-neutral-700">
              {value ? 'Active / Enabled' : 'Inactive / Disabled'}
            </span>
          </label>
        );

      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              id={`field-${field.name}`}
              value={value || '#000000'}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={value || ''}
              placeholder="#hexcode"
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className="w-32 px-3 py-2 border border-neutral-200 rounded-lg text-sm font-mono text-neutral-800"
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={value ?? ''}
                placeholder="Image URL or choose from library..."
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
              />
              <button
                type="button"
                onClick={() => setMediaPickerField(field.name)}
                className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                Library
              </button>
            </div>

            {value && (
              <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 group">
                <img
                  src={value}
                  alt="Field preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => handleFieldChange(field.name, '')}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        );

      case 'repeater':
        const list: string[] = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {list.map((itemVal, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={itemVal}
                  placeholder={`Item ${idx + 1}...`}
                  onChange={(e) => handleRepeaterChange(field.name, idx, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
                />
                <button
                  type="button"
                  onClick={() => handleRepeaterRemove(field.name, idx)}
                  className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleRepeaterAdd(field.name)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-neutral-300 hover:border-neutral-400 text-neutral-600 hover:text-neutral-900 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add item
            </button>
          </div>
        );

      case 'seo':
        const seoData = value || {};
        return (
          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-amber-700" />
              SEO & Social Search Metadata
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Meta Title</label>
                <input
                  type="text"
                  value={seoData.metaTitle || ''}
                  placeholder="Custom page title for search engines"
                  onChange={(e) =>
                    handleFieldChange(field.name, { ...seoData, metaTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={seoData.metaDescription || ''}
                  placeholder="Concise 150-160 character description..."
                  onChange={(e) =>
                    handleFieldChange(field.name, { ...seoData, metaDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden" id="cms-form-engine">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/70 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-700" />
            {(initialData as any)?.id ? `Edit ${collection.singularLabel || 'Item'}` : `Create New ${collection.singularLabel || 'Item'}`}
          </h2>
          <p className="text-xs text-neutral-500">
            Form dynamically adapted from <code className="text-amber-800 font-mono">cms-schema.json</code>
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200/60"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {collection.fields.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`field-${field.name}`}
                className="block text-xs font-semibold text-neutral-800 uppercase tracking-wide"
              >
                {field.label}
                {field.required && <span className="text-rose-500 ml-1">*</span>}
              </label>
              <span className="text-[11px] text-neutral-400 font-mono lowercase">
                type: {field.type}
              </span>
            </div>

            {renderFieldInput(field)}

            {field.helpText && (
              <p className="text-xs text-neutral-400">{field.helpText}</p>
            )}

            {errors[field.name] && (
              <p className="text-xs text-rose-600 font-medium">{errors[field.name]}</p>
            )}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            Discard
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            id="btn-save-form"
          >
            <CheckCircle2 className="w-4 h-4" />
            Save to Collection
          </button>
        </div>
      </form>

      {/* Media Picker Modal if open */}
      {mediaPickerField && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-neutral-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h3 className="font-semibold text-neutral-900 text-base">Select Image from Media Assets</h3>
              <button
                type="button"
                onClick={() => setMediaPickerField(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <MediaLibrary
              isModal={true}
              onSelect={(url) => {
                handleFieldChange(mediaPickerField, url);
                setMediaPickerField(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
