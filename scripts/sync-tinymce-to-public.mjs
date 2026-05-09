/**
 * Copy TinyMCE from node_modules into public/tinymce so the admin can load it
 * from the same origin (Strapi CSP: script-src 'self' 'unsafe-inline').
 */
import { cpSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = path.join(root, 'node_modules', 'tinymce');
const dest = path.join(root, 'public', 'tinymce');

if (!existsSync(src)) {
  console.warn('[sync-tinymce] skip: node_modules/tinymce not found');
  process.exit(0);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
console.log('[sync-tinymce] copied npm tinymce → public/tinymce');
