'use strict';

/**
 * article router — core REST + custom routes
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
  routes: [...defaultRouter.routes, ...customRoutes],
};
