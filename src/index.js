'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // Global hook to enforce pt_BR locale in SEO components
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
  },
};