'use strict';

/**
 * doctor-profile service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::doctor-profile.doctor-profile');
