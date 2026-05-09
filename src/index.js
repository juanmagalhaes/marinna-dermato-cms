'use strict';

module.exports = {
  register({ strapi }) {
    strapi.customFields.register({
      name: 'tinymce-html',
      type: 'text',
      inputSize: {
        default: 12,
        isResizable: true,
      },
    });
  },

  bootstrap(/* { strapi } */) {},
};
