'use strict';

/**
 * article router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::article.article', {
  config: {
    find: {
      middlewares: ['api::article.article.find-published'],
    },
    findOne: {
      middlewares: ['api::article.article.find-by-slug'],
    },
    create: {
      middlewares: ['api::article.article.locale-enforcer'],
    },
    update: {
      middlewares: ['api::article.article.locale-enforcer'],
    },
  },
});

// Custom routes
module.exports = {
  routes: [
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
  ],
};
