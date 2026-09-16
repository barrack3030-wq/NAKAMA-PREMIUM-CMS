# Universal CMS & Adaptive Static Website

A production-ready static website paired with a **Single Universal CMS Engine** that automatically adapts menus, forms, fields, validation, and dashboard widgets according to the website's `cms-config.json` and `cms-schema.json`.

---

## 1. Core Architecture Philosophy

```
Universal CMS Engine (Reusable across ALL websites)
        ↓
website-specific configuration (`cms-config.json`)
        ↓
website-specific schema definition (`cms-schema.json`)
        ↓
website-specific content collections (`/content/**/*.json`)
        ↓
CMS automatically renders matching menus, forms, fields, and dashboards
```

- **ONE CMS Engine**: Zero hardcoded models for specific industries (e.g. coffee shop, dental clinic, travel agency).
- **Zero Database Lock-in**: All content is stored in version-controlled, human-readable JSON files inside the `/content` folder.
- **Git-Native Workflow**: Content changes are staged, reviewed via built-in Git Diff, and committed straight to GitHub.
- **Real-Time Split Screen**: Experience live website preview side-by-side with the CMS administration engine.

---

## 2. Directory Structure

```
├── cms-config.json              # Website capabilities & feature flags
├── cms-schema.json              # Dynamic field definitions & data types
├── content/                     # Human-readable content files (Git tracked)
│   ├── pages/pages.json         # Static page content (Hero, Story, etc.)
│   ├── menu/items.json          # Collection items
│   ├── gallery/items.json       # Gallery imagery & categories
│   ├── testimonials/items.json  # Reviews, star ratings & quotes
│   ├── reservation/items.json   # Table reservations submitted by guests
│   ├── faq/items.json           # Frequently asked questions
│   ├── settings/site.json       # Contact details, business hours & branding
│   ├── seo/seo.json             # Meta tags, OpenGraph & canonical URLs
│   ├── media/library.json       # Reusable media assets
│   └── navigation/links.json    # Header and footer navigation links
├── src/
│   ├── cms/                     # Universal Reusable CMS Engine
│   │   ├── types.ts             # Schema, Config & Content TypeScript interfaces
│   │   ├── CmsContext.tsx       # Global state engine, Git file exporter & persistence
│   │   ├── presets.ts           # Verification schemas (Cafe, Travel, Dental)
│   │   ├── UniversalCMS.tsx     # Master adaptive CMS layout & sidebar
│   │   └── components/
│   │       ├── Dashboard.tsx          # Dynamic metrics, recent items & quick actions
│   │       ├── CollectionManager.tsx  # Dynamic data tables, search, filters & export
│   │       ├── FormEngine.tsx         # Universal schema-driven form generator
│   │       ├── MediaLibrary.tsx       # Asset manager with drag-and-drop & copy URL
│   │       ├── SeoManager.tsx         # Live Google SERP preview & JSON-LD generator
│   │       ├── WebsiteSettings.tsx    # Brand info, hours table & banner manager
│   │       ├── NavigationManager.tsx   # Header & footer link editor
│   │       ├── PublishManager.tsx     # Git commit staging, diff viewer & bundle download
│   │       └── PresetSwitcher.tsx     # Live demonstration of CMS adapting to new schemas
│   ├── website/                 # Customer-Facing Website (Aura Artisan Cafe)
│   │   ├── Navbar.tsx           # Sticky nav with live announcement banner
│   │   ├── HeroSection.tsx      # Roast feature, dual CTAs & ethos badges
│   │   ├── StorySection.tsx     # Brand narrative & ethical sourcing cards
│   │   ├── MenuSection.tsx      # Filterable seasonal menu with dietary tags
│   │   ├── GallerySection.tsx   # Atmosphere grid with photo lightbox
│   │   ├── TestimonialsSection.tsx # Guest praise & star ratings
│   │   ├── ReservationSection.tsx  # Working table booking form syncing into CMS
│   │   ├── FaqSection.tsx       # Interactive accordion FAQ
│   │   ├── Footer.tsx           # Hours table, contact info & Schema.org JSON-LD
│   │   └── WebsiteView.tsx      # Master page layout
│   └── App.tsx                  # Workspace root with Live Site, CMS, & Split-Screen modes
└── package.json
```

---

## 3. Quickstart & Local Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Workspace View Modes:**
   - **Live Website**: Full view of the customer-facing website.
   - **Universal CMS**: Full view of the CMS administration dashboard.
   - **Split Screen**: Side-by-side mode. Make an edit in the CMS (e.g., change a coffee price, add a gallery photo, toggle an announcement banner) and watch the website update in real-time.

---

## 4. GitHub Deployment Instructions

Because all website content lives in `/content/**/*.json`, deploying content updates follows standard Git workflows:

```bash
# 1. Initialize git repository (if not already initialized)
git init
git add .
git commit -m "Initial commit: Universal CMS & Aura Artisan Cafe"

# 2. Push to GitHub
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### Static Hosting CI/CD (Cloudflare Pages, Vercel, Netlify, or GitHub Pages)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18+

Any content update committed to GitHub automatically triggers a build and serves the updated static website globally with ultra-low latency.

---

## 5. How to Adapt the CMS for Any Other Website

To adapt this CMS engine for a completely different website (e.g., Dental Clinic, Law Firm, Portfolio):
1. **Edit `cms-config.json`**: Enable or disable features (e.g., `services: true`, `menu: false`).
2. **Edit `cms-schema.json`**: Define the collection keys, fields, labels, and validation rules.
3. The Universal CMS automatically re-renders its sidebar, data tables, validation rules, and edit forms without altering a single line of CMS engine code.
