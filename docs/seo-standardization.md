# SEO Component Standardization

## 📋 Changes Made

### **Before (Article SEO):**
```json
{
  "metaTitle": "string",
  "metaDescription": "text", 
  "keywords": "text",
  "ogImage": "media",
  "ogTitle": "string",
  "ogDescription": "text",
  "twitterCard": "enum",
  "canonicalUrl": "string"
}
```

### **After (Standardized SEO):**
```json
{
  "defaultTitle": "string",
  "description": "text",
  "siteName": "string",
  "keywords": "string",
  "openGraphImage": "media",
  "twitterImage": "media",
  "ogTitle": "string",
  "ogDescription": "text",
  "twitterCard": "enum"
}
```

**Nota (2026):** `locale` e `canonicalUrl` **não** fazem parte do modelo. Idioma é fixo no frontend; URL canónica é calculada no Next (`SITE_URL` + pathname). Ver `seo-plano-referencia.md`.

## 🎯 Benefits of Standardization

### **1. Consistency**
- Same field names across Default SEO and Article SEO
- Unified data structure for easier frontend handling
- Consistent API responses

### **2. Completeness**
- All SEO fields from Default SEO are now available in articles
- Additional Open Graph and Twitter specific fields
- Better social media sharing support

### **3. Flexibility**
- Títulos compostos por rota ficam no Next (não há `titleTemplate` no CMS)
- Separate images for Open Graph and Twitter

### **4. Maintainability**
- Single source of truth for SEO field structure
- Easier to add new SEO features
- Consistent validation rules

## 🔄 Migration Impact

### **Frontend Changes Required:**
1. Update field references:
   - `seo.metaTitle` → `seo.defaultTitle`
   - `seo.metaDescription` → `seo.description`
   - `seo.ogImage` → `seo.openGraphImage`

2. Handle new fields:
   - `seo.siteName` for site branding
   - `seo.twitterImage` for Twitter/X link previews

### **Backend Changes:**
- No breaking changes to API endpoints
- New fields are optional with sensible defaults
- Backward compatibility maintained

## 📝 Usage Examples

### **Title generation**
No CMS: use `seo.defaultTitle` (ou título da página definido no Next). Sufixos e padrões por rota são código no frontend.

### **Social Media Images:**
```javascript
// Open Graph image
const ogImage = seo.openGraphImage || seo.featuredImage;

// Twitter specific image
const twitterImage = seo.twitterImage || seo.openGraphImage || seo.featuredImage;
```

### **Meta Tags:**
```javascript
// Basic meta tags
const metaTitle = seo.defaultTitle;
const metaDescription = seo.description;
const metaKeywords = seo.keywords;

// Open Graph tags
const ogTitle = seo.ogTitle || seo.defaultTitle;
const ogDescription = seo.ogDescription || seo.description;
const ogImage = seo.openGraphImage;
const ogSiteName = seo.siteName;
// og:locale: fixo no frontend (site monolíngue pt-BR)

// Twitter tags
const twitterTitle = seo.ogTitle || seo.defaultTitle;
const twitterDescription = seo.ogDescription || seo.description;
const twitterImage = seo.twitterImage || seo.openGraphImage;
const twitterCard = seo.twitterCard;
```

## ✅ Files Updated

1. **`src/components/shared/seo.json`** - Updated component schema
2. **`scripts/seed-blog-data.js`** - Updated seeding script
3. **`docs/blog-structure.md`** - Updated documentation
4. **`docs/seo-standardization.md`** - This migration guide

## 🚀 Next Steps

1. **Restart Strapi** to load the updated component
2. **Update frontend** to use new field names
3. **Test SEO** functionality with new structure
4. **Update existing articles** if needed (optional)
