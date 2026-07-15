#!/usr/bin/env node
/**
 * 复制所有 index.html 为 foo.html，让 /foo 和 /foo/ 都能访问
 * (绕开 GitHub Pages 不自动重定向子目录的问题)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');

let count = 0;
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
    } else if (entry.name === 'index.html') {
      const parent = path.dirname(p);
      const name = path.basename(parent);
      if (name === 'dist' || name.startsWith('.') || name === '_astro') continue;
      const dest = path.join(path.dirname(parent), `${name}.html`);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(p, dest);
        count += 1;
      }
    }
  }
}

walk(DIST);
console.log(`[duplicate-index-html] generated ${count} duplicate .html files for non-slash URLs`);

// 确保 .nojekyll 存在（防止 GitHub Pages 走 Jekyll 处理）
const nojekyll = path.join(DIST, '.nojekyll');
if (!fs.existsSync(nojekyll)) {
  fs.writeFileSync(nojekyll, '');
  console.log('[duplicate-index-html] created .nojekyll');
}
