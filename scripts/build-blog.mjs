// scripts/build-blog.mjs
// Usage:
//   npm i -D gray-matter marked
//   npm run build:blog
//
// Reads /posts/*.md, parses front-matter, renders Markdown to HTML using marked,
// then writes static files to /blog/<slug>/index.html, builds /blog/index.html, and /blog/rss.xml

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

// load config
const CONFIG = JSON.parse(
  await fs.readFile(path.join(process.cwd(), 'site.config.json'), 'utf8')
);
const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'posts');
const OUT_DIR = path.join(ROOT, 'blog');
const TPL_DIR = path.join(ROOT, 'templates');

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

function escapeHtml(s='') {
//  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');
  s = s == null ? '' : String(s);    // ← coerce to string
  return s
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/\"/g,'&quot;')
    .replace(/'/g,'&#39;');	
}

async function loadTemplate(name) {
  const p = path.join(TPL_DIR, name + '.html');
  return fs.readFile(p, 'utf8');
}

function toSlug(s='') {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function rssDate(d) {
  // RFC-822-ish
  return new Date(d).toUTCString();
}

async function readPosts() {
  const files = (await fs.readdir(POSTS_DIR)).filter(f => f.endsWith('.md'));
  const posts = [];
  for (const file of files) {
    const full = path.join(POSTS_DIR, file);
    const raw = await fs.readFile(full, 'utf8');
    const { data, content } = matter(raw);

    if (data.draft === true) continue;

    const title = data.title ?? file.replace(/\.md$/, '');
    const slug = data.slug ?? toSlug(title);
    const date = data.date ?? new Date().toISOString().slice(0,10);
    const description = data.description ?? '';
    const canonical = data.canonical ?? `https://example.com/blog/${slug}/`;
    const tags = Array.isArray(data.tags) ? data.tags : [];

    const html = marked.parse(content);

    posts.push({
      id: data.id ?? slug,
      title, slug, date, description, canonical, tags,
      html
    });
  }
  // newest first
  posts.sort((a,b)=> (a.date < b.date ? 1 : -1));
  return posts;
}

async function writePostPages(posts, postTpl) {
  for (const p of posts) {
    const outDir = path.join(OUT_DIR, p.slug);
    await ensureDir(outDir);
    const tags = p.tags.join(', ');
    const html = postTpl
      .replaceAll('{{title}}', escapeHtml(p.title))
      .replaceAll('{{description}}', escapeHtml(p.description))
      .replaceAll('{{canonical}}', escapeHtml(p.canonical))
      .replaceAll('{{date}}', escapeHtml(p.date))
      .replaceAll('{{tags}}', escapeHtml(tags))
      .replace('{{content}}', p.html);

    await fs.writeFile(path.join(outDir, 'index.html'), html, 'utf8');
  }
}

function listItem(p) {
  const safeTitle = escapeHtml(p.title);
  const safeDesc = escapeHtml(p.description || '');
  return `<li>
    <a href="/blog/${p.slug}/"><strong>${safeTitle}</strong></a>
    <span class="muted"> — ${p.date}</span><br/>
    <span class="desc">${safeDesc}</span>
  </li>`;
}

async function writeIndex(posts, indexTpl) {
  const items = posts.map(listItem).join('\n');
  const html = indexTpl.replace('{{items}}', items);
  await fs.writeFile(path.join(OUT_DIR, 'index.html'), html, 'utf8');
}

async function writeRSS(posts) {
  const site = CONFIG.site;
  const feedTitle = 'Skreieweydo Blog';
  const feedDesc = 'Articles and notes.';
  const feedUrl = `${site}/blog/rss.xml`;

  const items = posts.map(p => `
    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${site}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${site}/blog/${p.slug}/</guid>
      <pubDate>${rssDate(p.date)}</pubDate>
      ${p.tags.slice(0,10).map(t=>`<category>${escapeHtml(t)}</category>`).join('')}
      <description><![CDATA[${p.description ? escapeHtml(p.description) : ''}]]></description>
    </item>
  `).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeHtml(feedTitle)}</title>
    <link>${site}/blog/</link>
    <description>${escapeHtml(feedDesc)}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <docs>https://cyber.harvard.edu/rss/rss.html</docs>
    <generator>build-blog.mjs</generator>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>
    ${items}
  </channel>
</rss>`;

  await fs.writeFile(path.join(OUT_DIR, 'rss.xml'), xml, 'utf8');
}

async function main() {
  await ensureDir(OUT_DIR);
  const [postTpl, indexTpl] = await Promise.all([
    loadTemplate('post'),
    loadTemplate('index')
  ]);
  const posts = await readPosts();
  await writePostPages(posts, postTpl);
  await writeIndex(posts, indexTpl);
  await writeRSS(posts);
  console.log(`Built ${posts.length} post(s) → /blog`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
