'use strict';

/**
 * article router — core REST + custom routes
 *
 * Do not spread `defaultRouter.routes` at module load time: the getter needs
 * a bootstrapped Strapi (`strapi.contentType`). Defer merge via `get routes()`.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::article.article');

const customRoutes = [
  {
    method: 'GET',
    path: '/articles/published',
    handler: 'article.findPublished',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'GET',
    path: '/articles/slug/:slug',
    handler: 'article.findBySlug',
    config: {
      policies: [],
      middlewares: [],
    },
  },
];

module.exports = {
  type: defaultRouter.type,
  prefix: defaultRouter.prefix,
  get routes() {
    return [...defaultRouter.routes, ...customRoutes];
  },
};
