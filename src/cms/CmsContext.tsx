import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CmsConfig,
  CmsSchema,
  MediaItem,
  SeoSettings,
  SiteSettings,
  NavigationSettings,
  VersionCommit
} from './types';
import { PRESETS } from './presets';

// Default files imported statically
import defaultConfig from '../../cms-config.json';
import defaultSchema from '../../cms-schema.json';
import defaultMenu from '../../content/menu/items.json';
import defaultGallery from '../../content/gallery/items.json';
import defaultTestimonials from '../../content/testimonials/items.json';
import defaultReservation from '../../content/reservation/items.json';
import defaultFaq from '../../content/faq/items.json';
import defaultPages from '../../content/pages/pages.json';
import defaultSettings from '../../content/settings/site.json';
import defaultSeo from '../../content/seo/seo.json';
import defaultMedia from '../../content/media/library.json';
import defaultNav from '../../content/navigation/links.json';

interface CmsContextType {
  config: CmsConfig;
  schema: CmsSchema;
  collections: Record<string, any[]>;
  media: MediaItem[];
  siteSettings: SiteSettings;
  seoSettings: SeoSettings;
  navigation: NavigationSettings;
  versionHistory: VersionCommit[];
  hasUnpublishedChanges: boolean;
  activePresetId: string;
  updateConfig: (newConfig: CmsConfig) => void;
  updateSchema: (newSchema: CmsSchema) => void;
  getCollection: (name: string) => any[];
  addCollectionItem: (collectionName: string, item: any) => void;
  updateCollectionItem: (collectionName: string, id: string, updatedFields: any) => void;
  deleteCollectionItem: (collectionName: string, id: string) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
  updateSeoSettings: (seo: SeoSettings) => void;
  updateNavigation: (nav: NavigationSettings) => void;
  addMediaItem: (item: MediaItem) => void;
  updateMediaItem: (id: string, updated: Partial<MediaItem>) => void;
  deleteMediaItem: (id: string) => void;
  publishChanges: (commitMessage?: string) => void;
  loadPreset: (presetId: string) => void;
  resetToOriginal: () => void;
  generateGitHubFiles: () => Record<string, string>;
}

const CmsContext = createContext<CmsContextType | null>(null);

const STORAGE_KEYS = {
  CONFIG: 'universal_cms_config',
  SCHEMA: 'universal_cms_schema',
  COLLECTIONS: 'universal_cms_collections',
  MEDIA: 'universal_cms_media',
  SETTINGS: 'universal_cms_settings',
  SEO: 'universal_cms_seo',
  NAV: 'universal_cms_nav',
  HISTORY: 'universal_cms_history',
  DIRTY: 'universal_cms_dirty',
  PRESET: 'universal_cms_active_preset'
};

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePresetId, setActivePresetId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PRESET) || 'cafe';
  });

  const [config, setConfig] = useState<CmsConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultConfig as unknown as CmsConfig;
  });

  const [schema, setSchema] = useState<CmsSchema>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCHEMA);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultSchema as unknown as CmsSchema;
  });

  const [collections, setCollections] = useState<Record<string, any[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      menu: defaultMenu,
      gallery: defaultGallery,
      testimonials: defaultTestimonials,
      reservation: defaultReservation,
      faq: defaultFaq,
      pages: defaultPages
    };
  });

  const [media, setMedia] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultMedia as unknown as MediaItem[];
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultSettings as unknown as SiteSettings;
  });

  const [seoSettings, setSeoSettings] = useState<SeoSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SEO);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultSeo as unknown as SeoSettings;
  });

  const [navigation, setNavigation] = useState<NavigationSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NAV);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultNav as unknown as NavigationSettings;
  });

  const [versionHistory, setVersionHistory] = useState<VersionCommit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'commit-8a9d1',
        timestamp: '2026-09-15 14:32:00',
        author: 'Content Editor (Universal CMS)',
        message: 'Initial production build with verified adaptive schemas',
        changesCount: 6,
        summary: ['Published seasonal menu', 'Updated hours', 'Added gallery assets']
      }
    ];
  });

  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.DIRTY) === 'true';
  });

  const markDirty = () => {
    setHasUnpublishedChanges(true);
    localStorage.setItem(STORAGE_KEYS.DIRTY, 'true');
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEMA, JSON.stringify(schema));
  }, [schema]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEO, JSON.stringify(seoSettings));
  }, [seoSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NAV, JSON.stringify(navigation));
  }, [navigation]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(versionHistory));
  }, [versionHistory]);

  const updateConfig = (newConfig: CmsConfig) => {
    setConfig(newConfig);
    markDirty();
  };

  const updateSchema = (newSchema: CmsSchema) => {
    setSchema(newSchema);
    markDirty();
  };

  const getCollection = (name: string): any[] => {
    return collections[name] || [];
  };

  const addCollectionItem = (collectionName: string, item: any) => {
    const newItem = {
      id: item.id || `${collectionName.slice(0, 3)}-${Date.now()}`,
      ...item
    };
    setCollections(prev => ({
      ...prev,
      [collectionName]: [newItem, ...(prev[collectionName] || [])]
    }));
    markDirty();
  };

  const updateCollectionItem = (collectionName: string, id: string, updatedFields: any) => {
    setCollections(prev => ({
      ...prev,
      [collectionName]: (prev[collectionName] || []).map(item =>
        item.id === id ? { ...item, ...updatedFields } : item
      )
    }));
    markDirty();
  };

  const deleteCollectionItem = (collectionName: string, id: string) => {
    setCollections(prev => ({
      ...prev,
      [collectionName]: (prev[collectionName] || []).filter(item => item.id !== id)
    }));
    markDirty();
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
    markDirty();
  };

  const updateSeoSettings = (seo: SeoSettings) => {
    setSeoSettings(seo);
    markDirty();
  };

  const updateNavigation = (nav: NavigationSettings) => {
    setNavigation(nav);
    markDirty();
  };

  const addMediaItem = (item: MediaItem) => {
    setMedia(prev => [item, ...prev]);
    markDirty();
  };

  const updateMediaItem = (id: string, updated: Partial<MediaItem>) => {
    setMedia(prev => prev.map(m => (m.id === id ? { ...m, ...updated } : m)));
    markDirty();
  };

  const deleteMediaItem = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
    markDirty();
  };

  const publishChanges = (commitMessage?: string) => {
    const message = commitMessage || `Update ${config.siteName} content via Universal CMS`;
    const newCommit: VersionCommit = {
      id: `commit-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      author: 'Universal CMS Engine',
      message,
      changesCount: Object.keys(collections).length,
      summary: [
        `Synchronized ${config.siteName} schema and collections`,
        `Updated settings for ${config.siteType}`,
        'Ready for Git repository commit'
      ]
    };

    setVersionHistory(prev => [newCommit, ...prev]);
    setHasUnpublishedChanges(false);
    localStorage.setItem(STORAGE_KEYS.DIRTY, 'false');
  };

  const loadPreset = (presetId: string) => {
    const preset = PRESETS[presetId];
    if (!preset) return;

    setActivePresetId(presetId);
    localStorage.setItem(STORAGE_KEYS.PRESET, presetId);
    setConfig(preset.config);
    setSchema(preset.schema);

    if (presetId === 'cafe') {
      setCollections({
        menu: defaultMenu,
        gallery: defaultGallery,
        testimonials: defaultTestimonials,
        reservation: defaultReservation,
        faq: defaultFaq,
        pages: defaultPages
      });
      setSiteSettings(defaultSettings as unknown as SiteSettings);
    } else {
      setCollections(preset.sampleCollections);
      setSiteSettings({
        siteName: preset.config.siteName,
        tagline: `${preset.name} - Universal CMS Dynamic Schema Mode`,
        story: preset.description,
        foundedYear: 2024,
        contact: {
          phone: '+1 (555) 019-2834',
          email: `contact@${preset.id}example.com`,
          address: '100 Global Discovery Way',
          city: 'San Francisco, CA'
        },
        hours: [
          { days: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
          { days: 'Saturday', time: '10:00 AM – 4:00 PM' }
        ],
        socials: {
          instagram: 'https://instagram.com',
          twitter: 'https://twitter.com'
        }
      });
    }

    markDirty();
  };

  const resetToOriginal = () => {
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
    localStorage.removeItem(STORAGE_KEYS.SCHEMA);
    localStorage.removeItem(STORAGE_KEYS.COLLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.SEO);
    localStorage.removeItem(STORAGE_KEYS.NAV);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.DIRTY);
    localStorage.removeItem(STORAGE_KEYS.PRESET);

    setActivePresetId('cafe');
    setConfig(defaultConfig as unknown as CmsConfig);
    setSchema(defaultSchema as unknown as CmsSchema);
    setCollections({
      menu: defaultMenu,
      gallery: defaultGallery,
      testimonials: defaultTestimonials,
      reservation: defaultReservation,
      faq: defaultFaq,
      pages: defaultPages
    });
    setMedia(defaultMedia as unknown as MediaItem[]);
    setSiteSettings(defaultSettings as unknown as SiteSettings);
    setSeoSettings(defaultSeo as unknown as SeoSettings);
    setNavigation(defaultNav as unknown as NavigationSettings);
    setHasUnpublishedChanges(false);
  };

  // Helper for Git deployment files
  const generateGitHubFiles = (): Record<string, string> => {
    const files: Record<string, string> = {
      'cms-config.json': JSON.stringify(config, null, 2),
      'cms-schema.json': JSON.stringify(schema, null, 2),
      'content/settings/site.json': JSON.stringify(siteSettings, null, 2),
      'content/seo/seo.json': JSON.stringify(seoSettings, null, 2),
      'content/navigation/links.json': JSON.stringify(navigation, null, 2),
      'content/media/library.json': JSON.stringify(media, null, 2)
    };

    Object.entries(collections).forEach(([collName, items]) => {
      files[`content/${collName}/items.json`] = JSON.stringify(items, null, 2);
    });

    return files;
  };

  return (
    <CmsContext.Provider
      value={{
        config,
        schema,
        collections,
        media,
        siteSettings,
        seoSettings,
        navigation,
        versionHistory,
        hasUnpublishedChanges,
        activePresetId,
        updateConfig,
        updateSchema,
        getCollection,
        addCollectionItem,
        updateCollectionItem,
        deleteCollectionItem,
        updateSiteSettings,
        updateSeoSettings,
        updateNavigation,
        addMediaItem,
        updateMediaItem,
        deleteMediaItem,
        publishChanges,
        loadPreset,
        resetToOriginal,
        generateGitHubFiles
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
