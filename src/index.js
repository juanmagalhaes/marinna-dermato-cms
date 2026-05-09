'use strict';

const ARTICLE_UID = 'api::article.article';

/** Keys Strapi merges from schema `config.metadatas` (see content-manager metadatas.mjs). */
const EDIT_METADATA_KEYS = [
  'label',
  'description',
  'placeholder',
  'visible',
  'editable',
  'mainField',
];
const LIST_METADATA_KEYS = ['label', 'searchable', 'sortable'];

/**
 * Content Manager persists field labels in the DB. On sync, stored metadatas are merged
 * *after* schema defaults, so old rows keep technical names and ignore `schema.json` labels.
 * Re-apply `config.metadatas` from each schema on top of the stored configuration.
 */
function mergeSchemaMetadataLabels(schema, metadatas) {
  const specMap = schema.config?.metadatas;
  if (!specMap || !metadatas) return metadatas;

  const next = structuredClone(metadatas);
  for (const [attr, spec] of Object.entries(specMap)) {
    if (!spec) continue;
    // Store may lack keys until CM sync; still apply schema labels (fixes partial local DB).
    if (!next[attr]) {
      next[attr] = { edit: {}, list: {} };
    }
    if (spec.edit) {
      for (const key of EDIT_METADATA_KEYS) {
        if (Object.prototype.hasOwnProperty.call(spec.edit, key)) {
          next[attr].edit[key] = spec.edit[key];
        }
      }
    }
    if (spec.list) {
      for (const key of LIST_METADATA_KEYS) {
        if (Object.prototype.hasOwnProperty.call(spec.list, key)) {
          next[attr].list[key] = spec.list[key];
        }
      }
    }
  }
  return next;
}

async function syncContentManagerLabelsFromSchema(strapi) {
  const cmTypes = strapi.plugin('content-manager').service('content-types');
  const cmComponents = strapi.plugin('content-manager').service('components');

  for (const schema of Object.values(strapi.contentTypes)) {
    if (!schema?.uid) continue;
    if (schema.uid.startsWith('admin::') || schema.uid.startsWith('strapi::')) continue;

    const conf = await cmTypes.findConfiguration(schema);
    const nextMeta = mergeSchemaMetadataLabels(schema, conf.metadatas);
    if (JSON.stringify(conf.metadatas) === JSON.stringify(nextMeta)) continue;

    await cmTypes.updateConfiguration(schema, {
      settings: conf.settings,
      metadatas: nextMeta,
      layouts: conf.layouts,
    });
  }

  for (const schema of Object.values(strapi.components)) {
    if (!schema?.uid) continue;

    const conf = await cmComponents.findConfiguration(schema);
    const nextMeta = mergeSchemaMetadataLabels(schema, conf.metadatas);
    if (JSON.stringify(conf.metadatas) === JSON.stringify(nextMeta)) continue;

    await cmComponents.updateConfiguration(schema, {
      settings: conf.settings,
      metadatas: nextMeta,
      layouts: conf.layouts,
    });
  }
}

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
    await syncContentManagerLabelsFromSchema(strapi);

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
