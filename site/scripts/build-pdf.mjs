import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS = join(__dirname, '..', 'src', 'content', 'docs');
const BASE = 'https://blacksujit.github.io/System-Design-Practice';

const marked = new Marked({ gfm: true, breaks: false });

function stripFrontmatter(md) {
  return md.replace(/^---[\s\S]*?---\s*/, '');
}

const ROUTES = {
  'index.md': '',
  'master-plan.md': 'master-plan',
  'practice.md': 'practice',
  'build-projects.md': 'build-projects',
  'resources.md': 'resources',
  'notes-template.md': 'notes-template',
  '01-fundamentals/index.md': '01-fundamentals/',
  '01-fundamentals/notes.md': '01-fundamentals/notes',
  '02-networking/index.md': '02-networking/',
  '02-networking/notes.md': '02-networking/notes',
  '03-databases/index.md': '03-databases/',
  '03-databases/notes.md': '03-databases/notes',
  '04-caching/index.md': '04-caching/',
  '04-caching/notes.md': '04-caching/notes',
  '05-load-balancing/index.md': '05-load-balancing/',
  '05-load-balancing/notes.md': '05-load-balancing/notes',
  '06-message-queues/index.md': '06-message-queues/',
  '06-message-queues/notes.md': '06-message-queues/notes',
  '07-consistent-hashing/index.md': '07-consistent-hashing/',
  '07-consistent-hashing/notes.md': '07-consistent-hashing/notes',
  '08-cap-theorem/index.md': '08-cap-theorem/',
  '08-cap-theorem/notes.md': '08-cap-theorem/notes',
  '09-projects/chat-system/README.md': '09-projects/chat-system/readme',
  '09-projects/notification-system/README.md': '09-projects/notification-system/readme',
  '09-projects/rate-limiter/README.md': '09-projects/rate-limiter/readme',
  '09-projects/url-shortener/README.md': '09-projects/url-shortener/readme',
  '10-large-scale/url-shortener/README.md': '10-large-scale/url-shortener/readme',
  '10-large-scale/instagram/README.md': '10-large-scale/instagram/readme',
  '10-large-scale/twitter-feed/README.md': '10-large-scale/twitter-feed/readme',
  '10-large-scale/youtube/README.md': '10-large-scale/youtube/readme',
  '11-advanced/google-docs/README.md': '11-advanced/google-docs/readme',
  '11-advanced/google-maps/README.md': '11-advanced/google-maps/readme',
  '11-advanced/twitter-clone/README.md': '11-advanced/twitter-clone/readme',
  '11-advanced/web-crawler/README.md': '11-advanced/web-crawler/readme',
  '12-interview-prep/index.md': '12-interview-prep/',
};

const FILES = [
  ['01', 'Getting Started', ['index.md']],
  ['02', 'The 30-Day Master Plan', ['master-plan.md']],
  ['03', 'Practice Problem Bank', ['practice.md']],
  ['04', 'Build Projects', ['build-projects.md']],
  ['05', 'Resources & References', ['resources.md']],
  ['06', 'Core Concepts', ['01-fundamentals/index.md', '01-fundamentals/notes.md',
    '02-networking/index.md', '02-networking/notes.md',
    '03-databases/index.md', '03-databases/notes.md',
    '04-caching/index.md', '04-caching/notes.md',
    '05-load-balancing/index.md', '05-load-balancing/notes.md',
    '06-message-queues/index.md', '06-message-queues/notes.md',
    '07-consistent-hashing/index.md', '07-consistent-hashing/notes.md',
    '08-cap-theorem/index.md', '08-cap-theorem/notes.md']],
  ['07', 'Guided Build Projects', ['09-projects/chat-system/README.md',
    '09-projects/notification-system/README.md',
    '09-projects/rate-limiter/README.md',
    '09-projects/url-shortener/README.md']],
  ['08', 'Large-Scale System Designs', ['10-large-scale/url-shortener/README.md',
    '10-large-scale/instagram/README.md',
    '10-large-scale/twitter-feed/README.md',
    '10-large-scale/youtube/README.md']],
  ['09', 'Advanced Deep Dives', ['11-advanced/google-docs/README.md',
    '11-advanced/google-maps/README.md',
    '11-advanced/twitter-clone/README.md',
    '11-advanced/web-crawler/README.md']],
  ['10', 'Interview Prep Playbook', ['12-interview-prep/index.md']],
];

function resolveHref(href) {
  if (/^https?:|^mailto:|^#/.test(href)) return href;
  const clean = href.split('#')[0].replace(/\.md$/i, '').replace(/^\.?\//, '');
  const route = ROUTES[clean.replace(/^\.\.\//, '')] || ROUTES[clean];
  if (route !== undefined) return `${BASE}/${route}`;
  const anchor = href.startsWith('#') ? href : '';
  return `${BASE}/${clean}/` + (anchor || '');
}

marked.use({
  renderer: {
    link({ href, title, text }) {
      if (/^https?:|^mailto:/.test(href)) {
        return `<a href="${href}">${text}</a>`;
      }
      if (href.startsWith('#')) {
        return `<a href="${href}">${text}</a>`;
      }
      return `<a href="${resolveHref(href)}">${text}</a>`;
    },
    image({ href, title, text }) {
      return '';
    },
  },
});

let body = '';
let toc = [];
let sectionCounter = 0;
const totalPart = FILES.length;

for (const [label, title, rels] of FILES) {
  sectionCounter++;
  body += `<section class="part" id="part${sectionCounter}">\n`;
  body += `<div class="part-head"><a class="chip" href="#toc">&uarr; Contents</a><span class="chip label">Part ${label} of ${String(totalPart).padStart(2, '0')}</span></div>\n`;
  body += `<h1 class="part-title">${label}. ${title}</h1>\n`;
  toc.push(`<li><a href="#part${sectionCounter}"><span class="num">${label}</span>${title}</a></li>`);
  const parts = rels.length;
  const start = label === '01' ? 0 : title === 'Getting Started' ? 0 : sectionCounter;
  for (const rel of rels) {
    const raw = readFileSync(join(DOCS, rel), 'utf8');
    const md = stripFrontmatter(raw);
    const html = marked.parse(md);
    const pageTitle = md
      .split('\n')
      .find((l) => l.startsWith('#') && !l.startsWith('##'))?.replace(/^#+\s*/, '') || rel;
    body += `<div class="doc" data-name="${pageTitle}"><h2 class="doc-title">${pageTitle}</h2>\n${html}\n</div>\n`;
  }
  body += '</section>\n';
}

const css = `
  :root { color-scheme: light; }
  @page { size: A4; margin: 22mm 18mm 24mm; }
  @page :first { margin: 0; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', -apple-system, Roboto, Helvetica, Arial, sans-serif; color: #1c2434; line-height: 1.55; font-size: 10.5pt; margin: 0; }

  .cover { page-break-after: always; height: 297mm; background: linear-gradient(160deg, #0d1730 0%, #16264a 48%, #1d3570 100%); color: #fff; display: flex; flex-direction: column; justify-content: center; padding: 0 26mm; position: relative; overflow: hidden; }
  .cover::after { content: ''; position: absolute; right: -60mm; top: -40mm; width: 170mm; height: 170mm; border-radius: 50%; background: radial-gradient(circle, rgba(110,150,255,.18) 0%, rgba(110,150,255,0) 62%); }
  .cover .brand { display: flex; align-items: center; gap: 6mm; margin-bottom: 14mm; }
  .cover .logo { width: 18mm; height: 18mm; border-radius: 5mm; background: linear-gradient(135deg, #4f8cff, #22d3ee); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15pt; color: #0d1730; }
  .cover .logo-sub { font-size: 9.5pt; letter-spacing: 1.5px; text-transform: uppercase; color: #9db6ff; font-weight: 600; }
  .cover .kicker { font-size: 11pt; letter-spacing: 3px; text-transform: uppercase; color: #93b4ff; font-weight: 700; }
  .cover h1 { font-size: 36pt; line-height: 1.1; margin: 9mm 0 0 0; font-weight: 800; }
  .cover .edition { margin-top: 4mm; display: inline-block; background: rgba(110,150,255,.16); border: 1px solid rgba(147,180,255,.4); color: #cddcff; padding: 2mm 5mm; border-radius: 8mm; font-size: 9.5pt; font-weight: 600; letter-spacing: 1px; }
  .cover p.sub { font-size: 12.5pt; color: #cddcff; margin-top: 9mm; max-width: 152mm; }
  .cover .checkpoints { margin-top: 12mm; display: flex; flex-wrap: wrap; gap: 3mm; }
  .cover .checkpoints span { font-size: 9.5pt; color: #dfe9ff; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.14); padding: 2mm 4mm; border-radius: 4mm; }
  .cover .meta { margin-top: 16mm; border-top: 1px solid rgba(255,255,255,.22); padding-top: 8mm; font-size: 10pt; color: #a9bff5; }

  .toc { page-break-after: always; padding: 20mm 22mm; }
  .toc h1 { font-size: 20pt; margin-bottom: 2mm; }
  .toc .toc-intro { color: #5a6478; font-size: 10pt; margin-bottom: 8mm; max-width: 150mm; }
  .toc ol { list-style: none; margin: 0; padding: 0; column-count: 2; column-gap: 16mm; font-size: 10.5pt; }
  .toc li { margin: 3mm 0; }
  .toc a { color: #1c2434; text-decoration: none; font-weight: 600; display: flex; align-items: baseline; gap: 4mm; }
  .toc .num { background: #16264a; color: #fff; border-radius: 4mm; padding: 0.6mm 2.6mm; font-size: 8.5pt; font-weight: 700; }

  .part { page-break-before: always; }
  .part:first-of-type { page-break-before: always; }
  .part-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3mm; }
  .chip { font-size: 8.5pt; color: #2b5ac9; text-decoration: none; border: 1px solid #b9c9ec; border-radius: 6mm; padding: 1mm 3.5mm; background: #f2f6ff; }
  .chip.label { color: #46516a; border-color: #d2d9ea; background: #fafbff; }
  .part-title { font-size: 17pt; color: #16264a; border-bottom: 2px solid #16264a; padding-bottom: 2.5mm; margin-top: 0; }

  .doc { page-break-before: always; }
  .doc-title { font-size: 13.5pt; color: #16264a; margin-top: 4mm; text-transform: uppercase; letter-spacing: 0.5px; }
  .doc h1, .doc h2, .doc h3, .doc h4 { color: #233a6e; line-height: 1.25; margin-top: 5mm; }
  .doc h3 { font-size: 11pt; } .doc h4 { font-size: 10.5pt; }
  .doc p { margin: 1.8mm 0; }
  .doc ul, .doc ol { margin: 1.5mm 0; padding-left: 6mm; }
  .doc li { margin: 0.8mm 0; }
  .doc strong { color: #16264a; }
  .doc a { color: #2b5ac9; text-decoration: none; border-bottom: 1px dotted #b9c9ec; }
  .doc blockquote { border-left: 3px solid #6f9aff; margin-left: 0; padding-left: 4mm; color: #46516a; }
  .doc code { font-family: Consolas, 'Cascadia Mono', monospace; font-size: 8.8pt; background: #eef2fa; padding: 0.5mm 1.2mm; border-radius: 2px; }
  .doc pre { background: #0f1729; color: #dbe7ff; border-radius: 4px; padding: 4mm; overflow-x: auto; page-break-inside: avoid; }
  .doc pre code { background: none; color: inherit; padding: 0; font-size: 8.5pt; line-height: 1.5; }
  .doc table { border-collapse: collapse; width: 100%; margin: 3mm 0; font-size: 9pt; }
  .doc th, .doc td { border: 1px solid #c8d2e8; padding: 1.5mm 2.5mm; text-align: left; }
  .doc th { background: #e8eefb; }
  .doc img, .doc details, .doc summary { display: none; }
  .doc hr { border: none; border-top: 1px solid #ccd6ee; margin: 5mm 0; }

  .backcover { page-break-before: always; height: 275mm; background: linear-gradient(160deg, #0d1730 0%, #16264a 60%, #1d3570 100%); color: #fff; padding: 30mm 26mm; border-radius: 0; }
  .backcover h1 { font-size: 20pt; margin: 0 0 4mm; }
  .backcover p { color: #cddcff; max-width: 150mm; }
  .backcover .links { margin-top: 10mm; }
  .backcover .links a { display: block; color: #dfe9ff; text-decoration: none; border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.07); padding: 4mm 6mm; border-radius: 5mm; margin: 3.5mm 0; max-width: 150mm; font-size: 10.5pt; }
  .backcover .links a b { color: #7ea6ff; }
  .backcover .foot { margin-top: 14mm; border-top: 1px solid rgba(255,255,255,.22); padding-top: 6mm; color: #a9bff5; font-size: 9.5pt; }
`;

const backcover = `
  <section class="backcover">
    <h1>Keep going, on the live site</h1>
    <p>This PDF is a snapshot of the full, always-updated <b>System Design Mastery</b> docs. New problems, builds, and chapters land there continuously &mdash; free, forever.</p>
    <div class="links">
      <a href="${BASE}/master-plan"><b>30-Day Master Plan</b> &mdash; the day-by-day strategy</a>
      <a href="${BASE}/practice"><b>Practice Problem Bank</b> &mdash; 16 problems by tier</a>
      <a href="${BASE}/build-projects"><b>Build Projects</b> &mdash; 10 hands-on builds</a>
      <a href="${BASE}/12-interview-prep/"><b>Interview Prep Playbook</b> &mdash; framework, platforms &amp; FAQ</a>
      <a href="https://github.com/Blacksujit/System-Design-Practice"><b>GitHub Repo</b> &mdash; source, editable, open source</a>
    </div>
    <div class="foot">System Design Mastery &middot; Complete Interview Prep Edition &middot; v1.2 &middot; Updated 2026 &middot; lifetime updates &middot; crafted from hours of interview-prep notes</div>
  </section>
`;

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
  <section class="cover">
    <div class="brand"><div class="logo">SD</div><div class="logo-sub">Interview Prep Series</div></div>
    <div class="kicker">Complete Interview Prep Edition</div>
    <h1>System Design Mastery</h1>
    <div class="edition">Premium PDF Edition &middot; v1.2 &middot; 10 parts</div>
    <p class="sub">The complete, battle-tested study plan: a 30-day master plan, core concept modules with notes, a practice-problem bank, guided build projects, large-scale system designs, and a full interview-prep playbook.</p>
    <div class="checkpoints"><span>30-Day Master Plan</span><span>16 Practice Problems</span><span>10 Build Projects</span><span>4 Large-Scale Designs</span><span>Interview FAQ Bank</span></div>
    <div class="meta">One-time purchase &middot; lifetime updates &middot; 30-day money-back guarantee &middot; covers 5 core domains &middot; 10 parts &middot; ~100 pages</div>
  </section>
  <section class="toc" id="toc">
    <h1>Contents</h1>
    <div class="toc-intro">10 parts covering the full interview-prep path. Keep the linked pages bookmarked &mdash; every link opens the live docs site.</div>
    <ol>${toc.join('')}</ol>
  </section>
  ${body}
  ${backcover}
</body></html>`;

const OUT = 'C:/Users/SUJITN~1/AppData/Local/Temp/opencode/premium-edition.html';
writeFileSync(OUT, html, 'utf8');
console.log('HTML written:', Buffer.byteLength(html, 'utf8'), 'bytes', '->', OUT);
