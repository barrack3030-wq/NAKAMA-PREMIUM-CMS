import { CmsConfig, CmsSchema } from './types';

export interface CmsPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  config: CmsConfig;
  schema: CmsSchema;
  sampleCollections: Record<string, any[]>;
}

export const PRESETS: Record<string, CmsPreset> = {
  cafe: {
    id: 'cafe',
    name: 'Aura Artisan Cafe (Current Active)',
    badge: 'Culinary & Roastery',
    description: 'Specialty coffee roastery, seasonal dining, photo gallery, guest reviews, and table reservations.',
    config: {
      siteName: 'Aura Artisan Coffee & Kitchen',
      siteType: 'cafe',
      version: '1.0.0',
      features: {
        pages: true,
        menu: true,
        gallery: true,
        testimonials: true,
        reservation: true,
        faq: true,
        blog: false,
        products: false,
        services: false,
        doctors: false,
        destinations: false,
        packages: false,
        team: false
      }
    },
    schema: {
      collections: {
        pages: {
          label: 'Pages',
          singularLabel: 'Page',
          icon: 'file-text',
          description: 'Static website pages',
          identifierField: 'title',
          fields: [
            { name: 'title', label: 'Page Title', type: 'text', required: true },
            { name: 'slug', label: 'URL Slug', type: 'text', required: true },
            { name: 'headline', label: 'Hero Headline', type: 'text' },
            { name: 'content', label: 'Main Content', type: 'rich-text' },
            { name: 'published', label: 'Published', type: 'toggle', defaultValue: true },
            { name: 'seo', label: 'Page SEO', type: 'seo' }
          ]
        },
        menu: {
          label: 'Menu Items',
          singularLabel: 'Menu Item',
          icon: 'coffee',
          description: 'Specialty coffee, teas, brunch dishes, and pastries',
          identifierField: 'name',
          fields: [
            { name: 'name', label: 'Item Name', type: 'text', required: true },
            {
              name: 'category',
              label: 'Category',
              type: 'select',
              required: true,
              options: ['Specialty Coffee', 'Artisan Teas & Tonics', 'Savory Kitchen', 'Bakes & Pastries']
            },
            { name: 'price', label: 'Price ($)', type: 'price', required: true },
            { name: 'description', label: 'Flavor Notes & Description', type: 'textarea' },
            { name: 'image', label: 'Item Image', type: 'image' },
            { name: 'dietary', label: 'Dietary Badges', type: 'repeater', itemType: 'text' },
            { name: 'isFeatured', label: 'Featured Special', type: 'toggle', defaultValue: false },
            { name: 'inStock', label: 'Available Today', type: 'toggle', defaultValue: true }
          ]
        },
        gallery: {
          label: 'Photo Gallery',
          singularLabel: 'Photo',
          icon: 'image',
          description: 'High-resolution space, roaster, and plate imagery',
          identifierField: 'title',
          fields: [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'url', label: 'Image URL', type: 'image', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Interior', 'Roasting', 'Latte Art', 'Kitchen', 'Community'] },
            { name: 'altText', label: 'Alt Text', type: 'text' },
            { name: 'featured', label: 'Featured', type: 'toggle', defaultValue: true }
          ]
        },
        testimonials: {
          label: 'Testimonials',
          singularLabel: 'Testimonial',
          icon: 'message-square',
          description: 'Editorial reviews and guest feedback',
          identifierField: 'author',
          fields: [
            { name: 'author', label: 'Guest Name', type: 'text', required: true },
            { name: 'role', label: 'Role / Publication', type: 'text' },
            { name: 'quote', label: 'Review Quote', type: 'textarea', required: true },
            { name: 'rating', label: 'Rating (1-5)', type: 'number', defaultValue: 5 },
            { name: 'avatar', label: 'Avatar', type: 'image' },
            { name: 'featured', label: 'Featured', type: 'toggle', defaultValue: true }
          ]
        },
        reservation: {
          label: 'Reservations',
          singularLabel: 'Reservation',
          icon: 'calendar',
          description: 'Live table reservations from website bookings',
          identifierField: 'guestName',
          fields: [
            { name: 'guestName', label: 'Guest Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'phone' },
            { name: 'guests', label: 'Guests', type: 'number', required: true, defaultValue: 2 },
            { name: 'date', label: 'Date', type: 'date', required: true },
            { name: 'time', label: 'Time', type: 'time', required: true },
            { name: 'seatingArea', label: 'Area', type: 'select', options: ['Main Roastery Hall', 'Sunlit Patio', 'Espresso Bar High-Tops', 'Quiet Mezzanine'] },
            { name: 'specialRequests', label: 'Special Requests', type: 'textarea' },
            { name: 'status', label: 'Status', type: 'select', options: ['Confirmed', 'Pending', 'Seated', 'Cancelled'] }
          ]
        },
        faq: {
          label: 'FAQ',
          singularLabel: 'Question',
          icon: 'help-circle',
          description: 'Guest FAQs and roastery details',
          identifierField: 'question',
          fields: [
            { name: 'question', label: 'Question', type: 'text', required: true },
            { name: 'answer', label: 'Answer', type: 'textarea', required: true },
            { name: 'category', label: 'Category', type: 'select', options: ['Coffee & Roasting', 'Visiting & Seating', 'Dietary Options', 'Private Bookings'] },
            { name: 'order', label: 'Order', type: 'number', defaultValue: 1 }
          ]
        }
      }
    },
    sampleCollections: {}
  },
  travel: {
    id: 'travel',
    name: 'Wanderlust Expeditions (Travel Agency Schema)',
    badge: 'Adventure & Travel',
    description: 'Showcases how Universal CMS automatically swaps to Destinations, Tour Packages, Itineraries, and Bookings without code changes.',
    config: {
      siteName: 'Wanderlust Expeditions',
      siteType: 'travel',
      version: '1.0.0',
      features: {
        pages: true,
        destinations: true,
        packages: true,
        itineraries: true,
        bookings: true,
        gallery: true,
        testimonials: true,
        blog: true,
        menu: false,
        reservation: false,
        doctors: false,
        services: false
      }
    },
    schema: {
      collections: {
        destinations: {
          label: 'Destinations',
          singularLabel: 'Destination',
          icon: 'map-pin',
          description: 'Curated international destinations',
          identifierField: 'name',
          fields: [
            { name: 'name', label: 'Destination Name', type: 'text', required: true },
            { name: 'country', label: 'Country', type: 'text', required: true },
            { name: 'season', label: 'Best Season', type: 'select', options: ['Spring', 'Summer', 'Autumn', 'Winter', 'Year-round'] },
            { name: 'overview', label: 'Overview', type: 'textarea' },
            { name: 'heroImage', label: 'Hero Cover Image', type: 'image' }
          ]
        },
        packages: {
          label: 'Tour Packages',
          singularLabel: 'Package',
          icon: 'briefcase',
          description: 'Expedition packages with pricing and durations',
          identifierField: 'title',
          fields: [
            { name: 'title', label: 'Package Title', type: 'text', required: true },
            { name: 'durationDays', label: 'Duration (Days)', type: 'number', required: true },
            { name: 'price', label: 'Starting Price ($)', type: 'price', required: true },
            { name: 'difficulty', label: 'Difficulty Level', type: 'select', options: ['Easy', 'Moderate', 'Challenging', 'Expert'] },
            { name: 'highlights', label: 'Trip Highlights', type: 'repeater', itemType: 'text' }
          ]
        },
        bookings: {
          label: 'Bookings',
          singularLabel: 'Booking',
          icon: 'compass',
          description: 'Client expedition bookings',
          identifierField: 'travelerName',
          fields: [
            { name: 'travelerName', label: 'Lead Traveler', type: 'text', required: true },
            { name: 'email', label: 'Email Address', type: 'email', required: true },
            { name: 'departureDate', label: 'Departure Date', type: 'date', required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['Confirmed', 'Deposit Paid', 'Inquiry'] }
          ]
        }
      }
    },
    sampleCollections: {
      destinations: [
        { id: 'dest-1', name: 'Kyoto & Kumano Kodo', country: 'Japan', season: 'Autumn', overview: 'Ancient cedar forests, temple shrines, and matcha culture.', heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop' },
        { id: 'dest-2', name: 'Reykjavik & Highland Glaciers', country: 'Iceland', season: 'Winter', overview: 'Geothermal hot springs, midnight sun, and aurora borealis.', heroImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=800&auto=format&fit=crop' }
      ],
      packages: [
        { id: 'pkg-1', title: 'Sacred Trails of Kumano', durationDays: 9, price: 3450, difficulty: 'Moderate', highlights: ['Ryokan stays with onsen', 'Temple breakfast', 'Private tea master ceremony'] },
        { id: 'pkg-2', title: 'Glacial Aurora Expedition', durationDays: 7, price: 4200, difficulty: 'Challenging', highlights: ['Ice cave exploration', 'Superjeep traversal', 'Northern lights photography guide'] }
      ],
      bookings: [
        { id: 'bk-1', travelerName: 'Marcus Aurelius', email: 'marcus@example.com', departureDate: '2026-10-15', status: 'Confirmed' }
      ]
    }
  },
  dental: {
    id: 'dental',
    name: 'Aesthetic Dental Studio (Clinic Schema)',
    badge: 'Medical & Wellness',
    description: 'Demonstrates Universal CMS adapting to Doctors, Specialized Services, Consultation Bookings, and Patient Testimonials.',
    config: {
      siteName: 'Aesthetic Dental Studio',
      siteType: 'dental',
      version: '1.0.0',
      features: {
        pages: true,
        doctors: true,
        services: true,
        testimonials: true,
        faq: true,
        menu: false,
        reservation: false,
        destinations: false,
        packages: false
      }
    },
    schema: {
      collections: {
        doctors: {
          label: 'Doctors & Specialists',
          singularLabel: 'Doctor',
          icon: 'user-check',
          description: 'Medical practitioners and credentials',
          identifierField: 'name',
          fields: [
            { name: 'name', label: 'Doctor Name', type: 'text', required: true },
            { name: 'specialty', label: 'Specialty', type: 'select', options: ['Orthodontics', 'Cosmetic Dentistry', 'Periodontics', 'General Dentistry'] },
            { name: 'bio', label: 'Biography', type: 'textarea' },
            { name: 'photo', label: 'Doctor Portrait', type: 'image' }
          ]
        },
        services: {
          label: 'Clinical Services',
          singularLabel: 'Service',
          icon: 'activity',
          description: 'Treatments, procedures, and transparent pricing',
          identifierField: 'title',
          fields: [
            { name: 'title', label: 'Service Name', type: 'text', required: true },
            { name: 'estimatedPrice', label: 'From ($)', type: 'price' },
            { name: 'durationMinutes', label: 'Duration (Min)', type: 'number' },
            { name: 'description', label: 'Procedure Summary', type: 'textarea' }
          ]
        }
      }
    },
    sampleCollections: {
      doctors: [
        { id: 'doc-1', name: 'Dr. Evelyn Vance, DDS', specialty: 'Cosmetic Dentistry', bio: 'Harvard School of Dental Medicine graduate with 14 years specializing in ceramic veneers.', photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop' }
      ],
      services: [
        { id: 'srv-1', title: 'Precision Porcelain Veneers', estimatedPrice: 1200, durationMinutes: 90, description: 'Micro-thin hand-layered porcelain shells designed to enhance tooth shape, shade, and contour.' },
        { id: 'srv-2', title: 'Laser In-Office Teeth Whitening', estimatedPrice: 450, durationMinutes: 60, description: 'Safe, enamel-preserving photothermal whitening system providing up to 8 shades of brightening.' }
      ]
    }
  }
};
