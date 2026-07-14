#!/usr/bin/env node
/**
 * migrate-yuque.mjs
 *
 * 从语雀迁移文档到 Astro Content Collections。
 *
 * 语雀的特殊性：
 *   - body 字段是 HTML，但里面**直接嵌入了 markdown 语法**（##、|、![]()）
 *   - 用 turndown 会把这些 markdown 符号当文本转义掉
 *   - 所以这里用一个专门的 HTML→MD 转换器，先处理 HTML 元素，再保留 markdown 文本
 *
 * 用法:
 *   YUQUE_TOKEN=<token> node scripts/migrate-yuque.mjs [options]
 *
 * 选项:
 *   --repos <ns1,ns2>   要迁的 repo（默认: jose/wg1zg7）
 *   --dry               只打印计划，不写文件
 *   --no-images         跳过图片下载，保留原 CDN 链接
 *   --slug-prefix <p>   输出文件名前缀（默认: yq-）
 *   --tag <t>           额外 tag
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ---------- CLI args ----------
const args = process.argv.slice(2);
const getFlag = (name, def) => {
  const i = args.indexOf(name);
  return i === -1 ? def : args[i + 1];
};
const hasFlag = (name) => args.includes(name);

const DRY = hasFlag('--dry');
const NO_IMAGES = hasFlag('--no-images');
const REPOS = (getFlag('--repos', 'jose/wg1zg7') || '')
  .split(',').map((s) => s.trim()).filter(Boolean);
const SLUG_PREFIX = getFlag('--slug-prefix', 'yq-');
const EXTRA_TAGS = args
  .map((_, i) => (args[i] === '--tag' ? args[i + 1] : null))
  .filter(Boolean);

// ---------- Token ----------
function readToken() {
  if (process.env.YUQUE_TOKEN) return process.env.YUQUE_TOKEN.trim();
  for (const p of ['/tmp/yuque-token', path.join(ROOT, '.yuque-token')]) {
    if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').trim();
  }
  throw new Error('未找到 token。请设置 YUQUE_TOKEN 或写到 /tmp/yuque-token');
}
const TOKEN = readToken();

const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const UPLOADS_DIR = path.join(ROOT, 'public', 'uploads', 'yuque');

const BASE = 'https://www.yuque.com/api/v2';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function apiWithRetry(pathname, maxRetries = 5) {
  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(`${BASE}${pathname}`, {
        headers: { 'X-Auth-Token': TOKEN, Accept: 'application/json' },
      });
      if (res.status === 429) {
        if (attempt >= maxRetries) {
          const text = await res.text().catch(() => '');
          throw new Error(`API ${pathname} -> HTTP 429 ${text.slice(0, 100)}`);
        }
        const delay = Math.min(2000 * 2 ** attempt, 60000);
        attempt += 1;
        console.warn(`    ⏳ 429 限流，${delay / 1000}s 后重试 (${attempt}/${maxRetries})...`);
        await sleep(delay);
        continue;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`API ${pathname} -> HTTP ${res.status} ${text.slice(0, 200)}`);
      }
      const data = await res.json();
      await sleep(1200); // 限流友好：每请求至少 1.2s
      return data;
    } catch (e) {
      if (attempt >= maxRetries) throw e;
      if (!e.message.includes('429')) throw e;
      attempt += 1;
      const delay = Math.min(2000 * 2 ** attempt, 60000);
      console.warn(`    ⏳ 错误重试，${delay / 1000}s 后重试 (${attempt}/${maxRetries})...`);
      await sleep(delay);
    }
  }
}

async function listAllDocs(namespace) {
  const all = [];
  for (let offset = 0; ; offset += 100) {
    const data = await apiWithRetry(`/repos/${namespace}/docs?limit=100&offset=${offset}`);
    all.push(...data.data);
    if (data.data.length < 100) break;
  }
  return all;
}

async function getDoc(namespace, slug) {
  const { data } = await apiWithRetry(`/repos/${namespace}/docs/${slug}`);
  return data;
}

// ============================================================
//  HTML → Markdown（专门处理语雀的"HTML 里嵌 markdown"格式）
// ============================================================
function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function stripTags(s) {
  return decodeEntities(s.replace(/<[^>]+>/g, ''));
}

function yuqueHtmlToMarkdown(html) {
  if (!html) return '';
  let s = html;

  // 1. 提取代码块（保护里面的内容不被后续正则处理）
  const codeBlocks = [];
  s = s.replace(
    /<pre[^>]*>\s*<code(?: class="[^"]*language-(\w+)[^"]*")?[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/g,
    (m, lang, code) => {
      codeBlocks.push({ lang: lang || '', code: decodeEntities(code) });
      return `\n\n@@CB_${codeBlocks.length - 1}@@\n\n`;
    },
  );

  // 2. HTML 表格 → MD 表格
  s = s.replace(/<table[^>]*>([\s\S]*?)<\/table>/g, (m, content) => {
    const rows = [];
    for (const rm of content.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
      const cells = [];
      for (const cm of rm[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)) {
        cells.push(stripTags(cm[1]).replace(/\s+/g, ' ').trim());
      }
      if (cells.length) rows.push(cells);
    }
    if (!rows.length) return '';
    const header = rows[0];
    const sep = header.map(() => ':---');
    const body = rows.slice(1);
    let md = '\n\n| ' + header.join(' | ') + ' |\n';
    md += '| ' + sep.join(' | ') + ' |\n';
    for (const row of body) md += '| ' + row.join(' | ') + ' |\n';
    return md + '\n';
  });

  // 3. <img> → ![](url)
  s = s.replace(
    /<img[^>]*?src="([^"]+)"[^>]*?(?:\s*\/?>|><\/img>)/g,
    (m, src) => `![](${src})`,
  );

  // 4. <a> → [text](url)
  s = s.replace(
    /<a[^>]*?href="([^"]+)"[^>]*?>([\s\S]*?)<\/a>/g,
    (m, url, text) => `[${stripTags(text).trim()}](${url})`,
  );

  // 5. heading
  s = s.replace(
    /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g,
    (m, level, text) => `\n\n${'#'.repeat(+level)} ${stripTags(text).trim()}\n\n`,
  );

  // 6. blockquote
  s = s.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g, (m, content) => {
    const lines = stripTags(content).trim().split('\n');
    return '\n\n' + lines.map((l) => '> ' + l.trim()).join('\n') + '\n\n';
  });

  // 7. strong / em
  s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/g, '**$2**');
  s = s.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/g, '_$2_');

  // 8. ul / ol
  s = s.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (m, content) => {
    const items = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(
      (li) => `- ${stripTags(li[1]).trim()}`,
    );
    return '\n\n' + items.join('\n') + '\n\n';
  });
  s = s.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (m, content) => {
    const items = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(
      (li, i) => `${i + 1}. ${stripTags(li[1]).trim()}`,
    );
    return '\n\n' + items.join('\n') + '\n\n';
  });

  // 9. <p>
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (m, c) => '\n\n' + stripTags(c).trim() + '\n\n');

  // 10. <br>
  s = s.replace(/<br\s*\/?>/g, '\n');

  // 11. 去除 <font>、<span> 等内联标签（保留内容）
  s = s.replace(/<\/?(?:font|span|mark|s|del|u|sup|sub|small)[^>]*>/g, '');

  // 12. 处理语雀特殊的 :::info / :::warning / :::success 容器
  s = s.replace(
    /:::(\w+)\s*([\s\S]*?):::/g,
    (m, kind, content) => {
      const text = stripTags(content).trim();
      return '\n\n> **' + kind.toUpperCase() + '**: ' + text + '\n\n';
    },
  );

  // 13. 清理所有剩余 HTML 标签
  s = stripTags(s);

  // 14. 恢复代码块
  s = s.replace(/@@CB_(\d+)@@/g, (_, i) => {
    const { lang, code } = codeBlocks[+i];
    return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
  });

  // 15. 清理
  s = s.replace(/\n{3,}/g, '\n\n').trim();
  return s;
}

// ============================================================
//  Image download
// ============================================================
function extFromUrl(url) {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?|$)/i);
    if (m) return '.' + m[1].toLowerCase().replace('jpeg', 'jpg');
  } catch {}
  return '.png';
}
function basenameFromUrl(url) {
  try {
    const u = new URL(url);
    const last = u.pathname.split('/').pop() || 'image';
    return last.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
  } catch {
    return 'image';
  }
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

// ============================================================
//  Frontmatter
// ============================================================
function escapeYamlString(s) {
  if (s == null) return '""';
  return `'${String(s).replace(/'/g, "''")}'`;
}

function deriveDescription(md, fallback = '') {
  if (fallback) return fallback.slice(0, 120);
  // 找第一个非空、非标题、非表格、非图片的行
  for (const line of md.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#')) continue;
    if (t.startsWith('|')) continue;
    if (t.startsWith('!')) continue;
    if (t.startsWith('>')) continue;
    if (t.startsWith('```')) continue;
    if (t.startsWith('-') || /^\d+\./.test(t)) continue;
    const clean = t.replace(/[*_`~]/g, '');
    if (clean.length >= 10) {
      return clean.slice(0, 120) + (clean.length > 120 ? '…' : '');
    }
  }
  return '';
}

function buildFrontmatter(meta) {
  const tags = ['yuque', meta.namespace.replace('/', '-'), ...EXTRA_TAGS];
  const lines = [
    `title: ${escapeYamlString(meta.title)}`,
    `description: ${escapeYamlString(meta.description)}`,
    `pubDate: ${meta.created_at.slice(0, 10)}`,
    `updatedDate: ${meta.content_updated_at.slice(0, 10)}`,
    `tags: [${tags.map((t) => escapeYamlString(t)).join(', ')}]`,
    `source: ${escapeYamlString(`https://www.yuque.com/${meta.namespace}/${meta.slug}`)}`,
  ];
  return `---\n${lines.join('\n')}\n---\n\n`;
}

// ============================================================
//  Process one doc
// ============================================================
async function processDoc(namespace, doc, stats) {
  const full = await getDoc(namespace, doc.slug);
  const md = yuqueHtmlToMarkdown(full.body);

  // 下载图片 + 替换 markdown 里的链接
  const imgRegex = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
  const matches = [...md.matchAll(imgRegex)];
  let localMd = md;
  const seen = new Map();
  let downloaded = 0;
  let skipped = 0;

  if (!NO_IMAGES) {
    for (const m of matches) {
      const url = m[2];
      let localRel = seen.get(url);
      if (!localRel) {
        const ext = extFromUrl(url);
        const base = basenameFromUrl(url) || 'image';
        const filename = `${base}${ext}`;
        localRel = `/uploads/yuque/${full.slug}/${filename}`;
        const abs = path.join(ROOT, 'public', localRel);
        if (DRY) {
          stats.dryImages += 1;
        } else if (!fs.existsSync(abs)) {
          try {
            const size = await downloadImage(url, abs);
            downloaded += 1;
            stats.bytesDownloaded += size;
          } catch (e) {
            skipped += 1;
            console.warn(`    ! 图片下载失败 ${url.slice(0, 60)}...: ${e.message}`);
          }
        }
        seen.set(url, localRel);
      }
      localMd = localMd.split(url).join(localRel);
    }
  }

  const description = deriveDescription(localMd, full.description);

  const meta = {
    title: full.title,
    description,
    created_at: full.created_at,
    content_updated_at: full.content_updated_at || full.created_at,
    namespace,
    slug: full.slug,
  };
  const fm = buildFrontmatter(meta);

  const fileName = `${SLUG_PREFIX}${full.slug}.md`;
  const filePath = path.join(BLOG_DIR, fileName);

  if (DRY) {
    stats.dryDocs += 1;
    console.log(
      `  · ${fileName.padEnd(50)} ${meta.created_at.slice(0, 10)} ${meta.title.slice(0, 30)}`,
    );
  } else {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
    fs.writeFileSync(filePath, fm + localMd + '\n');
    stats.ok += 1;
    console.log(
      `  ✓ ${fileName.padEnd(50)} ${meta.created_at.slice(0, 10)} ${meta.title.slice(0, 30)} (${downloaded} img, ${skipped} fail)`,
    );
  }
}

// ============================================================
//  Main
// ============================================================
async function main() {
  console.log('=== Yuque -> Astro 迁移脚本 ===\n');
  console.log(`模式: ${DRY ? 'DRY RUN（不写文件）' : '实际迁移'}`);
  console.log(`图片: ${NO_IMAGES ? '保留原 CDN 链接' : '下载到 public/uploads/yuque/'}`);
  console.log(`Repos: ${REPOS.join(', ')}`);
  console.log(`Slug 前缀: ${SLUG_PREFIX}`);
  if (EXTRA_TAGS.length) console.log(`额外 tags: ${EXTRA_TAGS.join(', ')}`);
  console.log();

  const stats = { ok: 0, fail: 0, dryDocs: 0, dryImages: 0, bytesDownloaded: 0 };

  for (const ns of REPOS) {
    console.log(`--- ${ns} ---`);
    const docs = await listAllDocs(ns);
    console.log(`共 ${docs.length} 篇\n`);
    for (const d of docs) {
      try {
        await processDoc(ns, d, stats);
      } catch (e) {
        stats.fail += 1;
        console.error(`  ✗ ${d.slug} (${d.title.slice(0, 30)}): ${e.message}`);
      }
    }
    console.log();
  }

  console.log('=== 完成 ===');
  if (DRY) {
    console.log(`计划处理: ${stats.dryDocs} 篇文档, ${stats.dryImages} 张图片`);
  } else {
    console.log(`成功: ${stats.ok} 篇, 失败: ${stats.fail} 篇`);
    if (stats.bytesDownloaded) {
      console.log(`下载图片: ${(stats.bytesDownloaded / 1024 / 1024).toFixed(2)} MB`);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
  console.error('\n!!! 错误:', e.message);
  if (process.env.DEBUG) console.error(e);
  process.exit(1);
});
}

