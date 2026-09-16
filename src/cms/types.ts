export type FieldType =
  | 'text'
  | 'textarea'
  | 'rich-text'
  | 'markdown'
  | 'number'
  | 'price'
  | 'image'
  | 'gallery'
  | 'video'
  | 'url'
  | 'email'
  | 'phone'
  | 'date'
  | 'time'
  | 'select'
  | 'checkbox'
  | 'toggle'
  | 'color'
  | 'repeater'
  | 'relation'
  | 'seo';

export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: string[] | { label: string; value: string }[];
  relationTo?: string;
  relationLabelField?: string;
  itemType?: string;
  helpText?: string;
  min?: number;
  max?: number;
}

export interface CollectionDefinition {
  label: string;
  singularLabel?: string;
  icon: string;
  description?: string;
  identifierField: string;
  fields: FieldDefinition[];
}

export interface CmsSchema {
  collections: Record<string, CollectionDefinition>;
}

export interface CmsConfig {
  siteName: string;
  siteType: string;
  version?: string;
  apiEndpoint?: string;
  features: {
    pages?: boolean;
    menu?: boolean;
    gallery?: boolean;
    testimonials?: boolean;
    reservation?: boolean;
    faq?: boolean;
    blog?: boolean;
    products?: boolean;
    services?: boolean;
    doctors?: boolean;
    destinations?: boolean;
    packages?: boolean;
    itineraries?: boolean;
    bookings?: boolean;
    events?: boolean;
    team?: boolean;
    courses?: boolean;
    facilities?: boolean;
    [key: string]: boolean | undefined;
  };
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  dimensions?: string;
  altText: string;
  tags: string[];
  createdAt: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string[];
  ogImage: string;
  author: string;
  twitterHandle: string;
  robots: string;
  themeColor: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  story: string;
  foundedYear: number;
  contact: {
    phone: string;
    email: string;
    address: string;
    city: string;
  };
  hours: { days: string; time: string }[];
  socials: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  announcement?: {
    enabled: boolean;
    text: string;
  };
}

export interface NavigationLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavigationSettings {
  header: NavigationLink[];
  footer: NavigationLink[];
}

export interface VersionCommit {
  id: string;
  timestamp: string;
  author: string;
  message: string;
  changesCount: number;
  summary: string[];
}
