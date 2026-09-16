import React, { useState } from 'react';
import { useCms } from '../CmsContext';
import { CollectionDefinition } from '../types';
import { FormEngine } from './FormEngine';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  CheckCircle,
  Clock,
  Coffee,
  Calendar,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  HelpCircle,
  Filter,
  Eye,
  ChevronRight
} from 'lucide-react';

interface CollectionManagerProps {
  collectionKey: string;
}

export const CollectionManager: React.FC<CollectionManagerProps> = ({ collectionKey }) => {
  const {
    schema,
    collections,
    addCollectionItem,
    updateCollectionItem,
    deleteCollectionItem
  } = useCms();

  const collection: CollectionDefinition | undefined = schema.collections[collectionKey];
  const items = collections[collectionKey] || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!collection) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-neutral-200">
        <p className="text-neutral-500 text-sm">
          Collection <code className="font-mono text-amber-700">{collectionKey}</code> not defined in schema.
        </p>
      </div>
    );
  }

  // Check if this collection has a category or status field for quick filtering
  const categoryField = collection.fields.find(f => f.name === 'category' || f.name === 'status');
  const categoryOptions = categoryField?.options || [];

  // Filter items
  const filteredItems = items.filter(item => {
    const identifierVal = String(item[collection.identifierField] || '').toLowerCase();
    const matchesSearch = identifierVal.includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory !== 'all' && categoryField) {
      const itemCategory = item[categoryField.name];
      if (itemCategory !== filterCategory) return false;
    }

    return true;
  });

  const handleSaveItem = (itemData: any) => {
    if (editingItem && editingItem.id) {
      updateCollectionItem(collectionKey, editingItem.id, itemData);
    } else {
      addCollectionItem(collectionKey, itemData);
    }
    setEditingItem(null);
    setIsCreatingNew(false);
  };

  const handleDuplicateItem = (item: any) => {
    const clone = {
      ...item,
      id: `${collectionKey.slice(0, 3)}-${Date.now()}`,
      [collection.identifierField]: `${item[collection.identifierField]} (Copy)`
    };
    addCollectionItem(collectionKey, clone);
  };

  const handleDelete = (id: string) => {
    deleteCollectionItem(collectionKey, id);
    setDeleteConfirmId(null);
  };

  // Render form editor if creating or editing
  if (isCreatingNew || editingItem) {
    return (
      <FormEngine
        collectionKey={collectionKey}
        collection={collection}
        initialData={editingItem || {}}
        onSave={handleSaveItem}
        onCancel={() => {
          setEditingItem(null);
          setIsCreatingNew(false);
        }}
        allCollections={collections}
      />
    );
  }

  return (
    <div className="space-y-6" id={`cms-collection-${collectionKey}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              {collection.label}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
              {items.length} {items.length === 1 ? collection.singularLabel || 'Item' : collection.label}
            </span>
          </div>
          {collection.description && (
            <p className="text-xs text-neutral-500 mt-1">{collection.description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setIsCreatingNew(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium shadow-xs transition-colors cursor-pointer"
          id={`btn-new-${collectionKey}`}
        >
          <Plus className="w-4 h-4" />
          New {collection.singularLabel || 'Item'}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-neutral-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${collection.label.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-800 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
          />
        </div>

        {categoryOptions.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              {categoryOptions.map((opt: any) => {
                const val = typeof opt === 'string' ? opt : opt.value;
                const lbl = typeof opt === 'string' ? opt : opt.label;
                return (
                  <option key={val} value={val}>
                    {lbl}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* Items List / Table */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-6">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
            <Search className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-neutral-800">
            No entries found in {collection.label}
          </p>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'No items match your active search filter.'
              : 'Add your first entry using the button above.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('all');
              setIsCreatingNew(true);
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create First {collection.singularLabel || 'Item'}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-200 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Item</th>
                  {collection.fields.map(f => {
                    if (
                      f.name === collection.identifierField ||
                      f.type === 'textarea' ||
                      f.type === 'rich-text' ||
                      f.type === 'repeater' ||
                      f.type === 'seo'
                    ) {
                      return null;
                    }
                    return (
                      <th key={f.name} className="py-3 px-4">
                        {f.label}
                      </th>
                    );
                  })}
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredItems.map((item) => {
                  const title = item[collection.identifierField] || 'Untitled Item';
                  const itemImage = item.image || item.url || item.photo || item.avatar;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-50/60 transition-colors group"
                    >
                      {/* Primary item column with image and identifier */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {itemImage && (
                            <img
                              src={itemImage}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <div>
                            <span className="font-medium text-neutral-900 block group-hover:text-amber-700 transition-colors">
                              {title}
                            </span>
                            {item.description && (
                              <span className="text-xs text-neutral-400 line-clamp-1 max-w-xs">
                                {item.description}
                              </span>
                            )}
                            {item.quote && (
                              <span className="text-xs text-neutral-400 italic line-clamp-1 max-w-xs">
                                "{item.quote}"
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Dynamic secondary columns based on schema fields */}
                      {collection.fields.map(f => {
                        if (
                          f.name === collection.identifierField ||
                          f.type === 'textarea' ||
                          f.type === 'rich-text' ||
                          f.type === 'repeater' ||
                          f.type === 'seo'
                        ) {
                          return null;
                        }

                        const val = item[f.name];

                        return (
                          <td key={f.name} className="py-3 px-4 text-xs text-neutral-700 whitespace-nowrap">
                            {f.type === 'price' ? (
                              <span className="font-semibold text-neutral-900">
                                ${Number(val || 0).toFixed(2)}
                              </span>
                            ) : f.type === 'toggle' || f.type === 'checkbox' ? (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                  val
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-neutral-100 text-neutral-500'
                                }`}
                              >
                                {val ? 'Yes' : 'No'}
                              </span>
                            ) : f.name === 'status' ? (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                  val === 'Confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : val === 'Pending'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-neutral-100 text-neutral-600'
                                }`}
                              >
                                {val || 'None'}
                              </span>
                            ) : (
                              <span className="truncate max-w-[180px] block">{String(val ?? '—')}</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingItem(item)}
                            title="Edit"
                            className="p-1.5 text-neutral-500 hover:text-amber-800 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateItem(item)}
                            title="Duplicate"
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(item.id)}
                            title="Delete"
                            className="p-1.5 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-neutral-200 shadow-xl space-y-4">
            <h3 className="font-semibold text-neutral-900 text-base">Delete Item?</h3>
            <p className="text-xs text-neutral-500">
              Are you sure you want to remove this item from the collection? This action cannot be undone once published.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
