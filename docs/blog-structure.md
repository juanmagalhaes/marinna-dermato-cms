# Blog Structure - Dra. Marinna

## 📋 Content Types Created

### 1. Article (api::article.article)
**Main blog article content type with dynamic blocks**

#### Fields:
- `title` (string, required) - Article title
- `slug` (uid, required) - URL slug auto-generated from title
- `excerpt` (text) - Article summary/excerpt
- `featuredImage` (media) - Main article image
- `publishedAt` (datetime) - Publication date
- `status` (enum) - draft, published, archived
- `seo` (component) - SEO metadata
- `blocks` (dynamic-zone) - Content blocks
- `categories` (relation) - Many-to-many with categories
- `tags` (relation) - Many-to-many with tags

### 2. Category (api::category.category)
**Article categories for organization**

#### Fields:
- `name` (string, required) - Category name
- `slug` (uid, required) - URL slug
- `description` (text) - Category description
- `color` (string) - Hex color for UI display
- `articles` (relation) - Related articles

### 3. Tag (api::tag.tag)
**Article tags for filtering and organization**

#### Fields:
- `name` (string, required) - Tag name
- `slug` (uid, required) - URL slug
- `description` (text) - Tag description
- `color` (string) - Hex color for UI display
- `articles` (relation) - Related articles

## 🧩 Dynamic Zone Components

### 1. Text Block (article.text-block)
**Rich text content with WYSIWYG editor**

#### Fields:
- `content` (richtext, required) - WYSIWYG content
- `alignment` (enum) - left, center, right
- `backgroundColor` (string) - Background color (hex)
- `padding` (enum) - none, small, medium, large

### 2. Image Block (article.image-block)
**Image content with styling options**

#### Fields:
- `image` (media, required) - Image file
- `caption` (string) - Image caption
- `alignment` (enum) - left, center, right, full-width
- `size` (enum) - small, medium, large, full
- `link` (string) - Optional link URL
- `alt` (string) - Alt text for accessibility

### 3. Video Block (article.video-block)
**Video content supporting multiple platforms**

#### Fields:
- `videoType` (enum, required) - instagram, youtube, vimeo, upload
- `videoUrl` (string, required) - Video URL
- `thumbnail` (media) - Custom thumbnail
- `caption` (string) - Video caption
- `alignment` (enum) - left, center, right, full-width
- `size` (enum) - small, medium, large, full
- `autoplay` (boolean) - Auto-play video
- `muted` (boolean) - Muted by default

### 4. Quote Block (article.quote-block)
**Quote content with author information**

#### Fields:
- `quote` (text, required) - Quote text
- `author` (string) - Quote author
- `source` (string) - Quote source
- `style` (enum) - default, highlighted, minimal
- `alignment` (enum) - left, center, right

## 🔧 Shared Components

### SEO Component (shared.seo)
**Reusable SEO metadata - standardized with Default SEO**

#### Fields:
- `defaultTitle` (string) - Page title
- `titleTemplate` (string) - Title template with %s placeholder
- `description` (text) - Meta description
- `siteName` (string) - Site name
- `locale` (string) - Language/locale (always pt_BR, enforced)
- `keywords` (string) - SEO keywords
- `canonicalUrl` (string) - Canonical URL
- `openGraphImage` (media) - Open Graph image
- `twitterImage` (media) - Twitter specific image
- `ogTitle` (string) - Open Graph specific title
- `ogDescription` (text) - Open Graph specific description
- `twitterCard` (enum) - Twitter card type (summary, summary_large_image)

## 🚀 API Endpoints

### Articles
- `GET /api/articles` - List all articles
- `GET /api/articles/published` - List published articles
- `GET /api/articles/slug/:slug` - Get article by slug
- `GET /api/articles/:id` - Get article by ID
- `POST /api/articles` - Create article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Tags
- `GET /api/tags` - List all tags
- `GET /api/tags/:id` - Get tag by ID
- `POST /api/tags` - Create tag
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

## 📝 Usage Examples

### Creating an Article
```javascript
const article = await strapi.entityService.create('api::article.article', {
  data: {
    title: 'Cuidados com a Pele no Verão',
    slug: 'cuidados-pele-verao',
    excerpt: 'Dicas essenciais para proteger sua pele...',
    status: 'published',
    publishedAt: new Date().toISOString(),
    seo: {
      defaultTitle: 'Cuidados com a Pele no Verão',
      titleTemplate: '%s | Dra. Marinna - Dermatologista',
      description: 'Aprenda os cuidados essenciais...',
      siteName: 'Dra. Marinna - Dermatologista',
      locale: 'pt_BR',
      keywords: 'pele, verão, protetor solar, dermatologia',
      ogTitle: 'Cuidados com a Pele no Verão - Dra. Marinna',
      ogDescription: 'Aprenda os cuidados essenciais...',
      twitterCard: 'summary_large_image',
    },
    blocks: [
      {
        __component: 'article.text-block',
        content: '<h2>Introdução</h2><p>Conteúdo...</p>',
        alignment: 'left',
      },
      {
        __component: 'article.image-block',
        image: 1, // Media ID
        caption: 'Proteção solar é essencial',
        alignment: 'center',
        size: 'large',
      },
    ],
  },
});
```

### Querying Articles
```javascript
const articles = await strapi.entityService.findMany('api::article.article', {
  filters: {
    status: 'published',
    publishedAt: {
      $notNull: true,
    },
  },
  populate: {
    featuredImage: true,
    seo: true,
    categories: true,
    tags: true,
    blocks: {
      populate: {
        image: true,
        thumbnail: true,
      },
    },
  },
  sort: { publishedAt: 'desc' },
});
```

## 🌱 Seeding Data

Run the seeding script to populate initial data:

```bash
node scripts/seed-blog-data.js
```

This will create:
- Sample categories (Dermatologia Clínica, Cuidados com a Pele, Tratamento Capilar, etc.)
- Sample tags (minoxidil, queda de cabelo, tratamento capilar, acne, etc.)
- A sample article about minoxidil with Instagram video and content blocks

## 🎨 Frontend Integration

The frontend should:
1. Fetch articles from `/api/articles/published`
2. Render dynamic blocks using appropriate components
3. Handle rich text content with proper styling
4. Support image optimization and lazy loading
5. Embed videos from different platforms
6. Implement SEO metadata from the seo component
