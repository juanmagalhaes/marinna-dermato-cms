'use strict';

/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  // Custom method to get published articles with populated relations
  async findPublished(ctx) {
    const { query } = ctx;
    
    const entity = await strapi.entityService.findMany('api::article.article', {
      ...query,
      filters: {
        ...query.filters,
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

    return entity;
  },

  // Custom method to get article by slug
  async findBySlug(ctx) {
    const { slug } = ctx.params;
    
    const entity = await strapi.entityService.findMany('api::article.article', {
      filters: {
        slug,
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
    });

    if (!entity || entity.length === 0) {
      return ctx.notFound('Article not found');
    }

    return entity[0];
  },
}));
