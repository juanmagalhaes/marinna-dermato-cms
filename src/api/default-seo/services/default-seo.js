'use strict';

/**
 * default-seo service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::default-seo.default-seo');
