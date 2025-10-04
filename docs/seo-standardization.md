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
  "defaultTitle": "string",        // ✅ Renamed from metaTitle
  "titleTemplate": "string",       // ✅ Added (from Default SEO)
  "description": "text",           // ✅ Renamed from metaDescription
  "siteName": "string",           // ✅ Added (from Default SEO)
  "locale": "string",             // ✅ Added (from Default SEO)
  "keywords": "string",           // ✅ Changed from text to string
  "canonicalUrl": "string",       // ✅ Kept same
  "openGraphImage": "media",      // ✅ Renamed from ogImage
  "twitterImage": "media",        // ✅ Added (from Default SEO)
  "ogTitle": "string",            // ✅ Kept same
  "ogDescription": "text",        // ✅ Kept same
  "twitterCard": "enum"           // ✅ Kept same
}
```

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
- `titleTemplate` allows dynamic title generation
- Separate images for Open Graph and Twitter
- Locale support for internationalization

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
   - `seo.titleTemplate` for dynamic titles
   - `seo.siteName` for site branding
   - `seo.locale` for language detection
   - `seo.twitterImage` for Twitter-specific images

### **Backend Changes:**
- No breaking changes to API endpoints
- New fields are optional with sensible defaults
- Backward compatibility maintained

## 📝 Usage Examples

### **Title Generation:**
```javascript
// Using titleTemplate
const title = seo.titleTemplate.replace('%s', seo.defaultTitle);
// Result: "Cuidados com a Pele no Verão | Dra. Marinna - Dermatologista"
```

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
const ogLocale = seo.locale;

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
