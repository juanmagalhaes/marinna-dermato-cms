'use strict';

/**
 * Middleware to enforce pt_BR locale in SEO components
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Only apply to create and update operations
    if (['POST', 'PUT'].includes(ctx.method)) {
      const { data } = ctx.request.body;
      
      if (data && data.seo) {
        // Force locale to pt_BR
        data.seo.locale = 'pt_BR';
      }
    }
    
    await next();
  };
};
