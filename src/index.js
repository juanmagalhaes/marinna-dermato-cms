'use strict';

const ARTICLE_UID = 'api::article.article';

/** Field order in Content Manager edit view (categories & tags before SEO, then blocks). */
const ARTICLE_EDIT_FIELD_ORDER = [
  'title',
  'slug',
  'excerpt',
  'featuredImage',
  'categories',
  'tags',
  'seo',
  'blocks',
];

const MAX_EDIT_ROW = 12;

/**
 * Re-pack edit layout rows (Strapi grid) in `desiredFirst` order, preserving
 * per-field sizes from the current layout when present.
 */
function rebuildArticleEditLayout(contentType, currentEdit, fieldSizes) {
  const byName = {};
  for (const row of currentEdit) {
    for (const cell of row) {
      if (cell?.name) byName[cell.name] = cell.size;
    }
  }

  const defaultSize = (name) => {
    const attr = contentType.attributes[name];
    if (!attr) return 6;
    const type =
      attr.customField && fieldSizes.hasFieldSize(attr.customField)
        ? attr.customField
        : attr.type;
    return fieldSizes.getFieldSize(type).default;
  };

  const sequence = [
    ...ARTICLE_EDIT_FIELD_ORDER.filter((n) => contentType.attributes[n]),
    ...Object.keys(byName).filter((n) => !ARTICLE_EDIT_FIELD_ORDER.includes(n)),
  ];

  const layout = [];
  let row = [];
  let sum = 0;

  for (const name of sequence) {
    if (!contentType.attributes[name]) continue;
    const size = byName[name] ?? defaultSize(name);
    if (sum + size > MAX_EDIT_ROW) {
      if (row.length) layout.push(row);
      row = [];
      sum = 0;
    }
    row.push({ name, size });
    sum += size;
  }
  if (row.length) layout.push(row);

  return layout;
}

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

  async bootstrap({ strapi }) {
    const contentType = strapi.contentTypes[ARTICLE_UID];
    if (!contentType) return;

    const cm = strapi.plugin('content-manager').service('content-types');
    const conf = await cm.findConfiguration(contentType);
    const edit = conf?.layouts?.edit;
    if (!edit || !Array.isArray(edit)) return;

    const fieldSizes = strapi.plugin('content-manager').service('field-sizes');
    const newEdit = rebuildArticleEditLayout(contentType, edit, fieldSizes);

    if (JSON.stringify(edit) === JSON.stringify(newEdit)) return;

    await cm.updateConfiguration(contentType, {
      settings: conf.settings,
      metadatas: conf.metadatas,
      layouts: {
        ...conf.layouts,
        edit: newEdit,
      },
    });
  },
};
