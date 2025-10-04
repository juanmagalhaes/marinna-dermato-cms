# Locale Enforcement - pt_BR

## 🎯 Overview

The SEO component is configured to always use `pt_BR` as the locale, ensuring consistency across all content types and preventing accidental changes.

## 🔧 Implementation

### **1. Schema Level Enforcement**

#### **SEO Component (`shared.seo`)**
```json
{
  "locale": {
    "type": "string",
    "maxLength": 10,
    "default": "pt_BR",
    "required": true
  }
}
```

#### **Default SEO (`default-seo`)**
```json
{
  "locale": {
    "type": "string",
    "required": true,
    "default": "pt_BR"
  }
}
```

### **2. Application Level Enforcement**

#### **Global Lifecycle Hook (`src/index.js`)**
```javascript
strapi.db.lifecycles.subscribe({
  models: ['article', 'default-seo'],
  beforeCreate(event) {
    const { data } = event.params;
    if (data && data.seo) {
      data.seo.locale = 'pt_BR';
    }
  },
  beforeUpdate(event) {
    const { data } = event.params;
    if (data && data.seo) {
      data.seo.locale = 'pt_BR';
    }
  },
});
```

#### **Article Middleware (`api/article/middlewares/locale-enforcer.js`)**
```javascript
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (['POST', 'PUT'].includes(ctx.method)) {
      const { data } = ctx.request.body;
      if (data && data.seo) {
        data.seo.locale = 'pt_BR';
      }
    }
    await next();
  };
};
```

## 🛡️ Protection Levels

### **Level 1: Schema Validation**
- Field is `required: true`
- Default value is `pt_BR`
- Strapi validates on save

### **Level 2: Middleware Enforcement**
- Article-specific middleware
- Applied to create/update operations
- Forces locale to `pt_BR` before processing

### **Level 3: Global Lifecycle Hook**
- Application-wide enforcement
- Covers all content types using SEO component
- Runs before database operations

## ✅ Benefits

### **1. Consistency**
- All SEO data uses the same locale
- No mixed language content
- Unified user experience

### **2. Security**
- Prevents accidental locale changes
- Protects against API manipulation
- Ensures data integrity

### **3. Simplicity**
- No need to specify locale manually
- Automatic enforcement
- Reduced human error

## 🔍 Testing

### **Test Cases:**
1. **Create Article with pt_BR** ✅ Should work normally
2. **Create Article with en_US** ✅ Should be forced to pt_BR
3. **Update Article locale** ✅ Should be forced to pt_BR
4. **API manipulation** ✅ Should be forced to pt_BR

### **Verification:**
```javascript
// Check that locale is always pt_BR
const article = await strapi.entityService.findOne('api::article.article', id, {
  populate: { seo: true }
});

console.log(article.seo.locale); // Should always be "pt_BR"
```

## 📝 Usage

### **Frontend:**
```javascript
// Always safe to assume pt_BR
const locale = article.seo.locale; // "pt_BR"
const ogLocale = `pt_BR`; // Hardcoded is safe
```

### **API:**
```javascript
// Even if you send different locale, it will be forced to pt_BR
const response = await fetch('/api/articles', {
  method: 'POST',
  body: JSON.stringify({
    data: {
      title: 'Test Article',
      seo: {
        locale: 'en_US', // This will be forced to pt_BR
        defaultTitle: 'Test'
      }
    }
  })
});
```

## 🚀 Future Considerations

If internationalization is needed in the future:

1. **Remove enforcement** from lifecycle hooks
2. **Add locale validation** instead of forcing
3. **Update frontend** to handle multiple locales
4. **Add locale selection** in admin interface

For now, the enforcement ensures a consistent Portuguese (Brazil) experience across all content.
