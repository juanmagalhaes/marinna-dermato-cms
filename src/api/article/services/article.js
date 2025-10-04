'use strict';

/**
 * article service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::article.article', ({ strapi }) => ({
  // Custom method to generate slug from title
  async generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  },

  // Custom method to get related articles
  async getRelatedArticles(articleId, limit = 3) {
    const article = await strapi.entityService.findOne('api::article.article', articleId, {
      populate: {
        categories: true,
        tags: true,
      },
    });

    if (!article) return [];

    const categoryIds = article.categories?.map(cat => cat.id) || [];
    const tagIds = article.tags?.map(tag => tag.id) || [];

    const relatedArticles = await strapi.entityService.findMany('api::article.article', {
      filters: {
        id: {
          $ne: articleId,
        },
        status: 'published',
        publishedAt: {
          $notNull: true,
        },
        $or: [
          {
            categories: {
              id: {
                $in: categoryIds,
              },
            },
          },
          {
            tags: {
              id: {
                $in: tagIds,
              },
            },
          },
        ],
      },
      populate: {
        featuredImage: true,
        categories: true,
        tags: true,
      },
      sort: { publishedAt: 'desc' },
      limit,
    });

    return relatedArticles;
  },
}));
