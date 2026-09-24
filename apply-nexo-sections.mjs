// Usage (from the project root):  node apply-nexo-sections.mjs src/app/page.tsx
// Puts the new sections DIRECTLY into your page.tsx (no extra imports/files needed afterwards).
// NexoSections.tsx must lie next to this script while it runs; after that you can delete both.
import fs from 'node:fs';

const file = process.argv[2] || 'src/app/page.tsx';
if (!fs.existsSync(file)) { console.error('File not found: ' + file); process.exit(1); }

let s = fs.readFileSync(file, 'utf8');
if (s.includes('DetailsSection')) { console.log('Already applied.'); process.exit(0); }

function must(cond, what) { if (!cond) { console.error('Anchor not found: ' + what + ' (file left untouched)'); process.exit(1); } }
function insertBefore(anchor, add) { must(s.includes(anchor), anchor); s = s.replace(anchor, add + anchor); }

// 1) sections code -> appended to the end of page.tsx
const srcPath = new URL('./NexoSections.tsx', import.meta.url);
let code = fs.readFileSync(srcPath, 'utf8')
  .replace("'use client';", '')
  .replace("import type { ReactNode } from 'react';", '')
  .replace(/\bReactNode\b/g, 'React.ReactNode')
  .replace(/^export /gm, ''); // Next.js pages must not have extra named exports

// 2) extra css next to the existing <style>
must(s.includes('<style>{nexoStyles}</style>'), '<style>{nexoStyles}</style>');
s = s.replace('<style>{nexoStyles}</style>', '<style>{nexoStyles}</style>\n      <style>{nexoExtraStyles}</style>');

// 3) sections in the right places
insertBefore('{/* INTERFACE SHOWCASE */}', '<DetailsSection />\n\n        ');
insertBefore('{/* HOW IT WORKS */}', '<DesktopSection />\n\n        ');
insertBefore('{/* RULES */}', '<StackSection />\n\n        <RoadmapSection />\n\n        ');

// 4) nav: Interface -> Desktop, Rules -> Roadmap
const nav = (h, t) => `<a href="#${h}" className="hover:text-white transition-colors">${t}</a>`;
must(s.includes(nav('interface', 'Interface')) && s.includes(nav('rules', 'Rules')), 'nav links');
s = s.replace(nav('interface', 'Interface'), nav('desktop', 'Desktop')).replace(nav('rules', 'Rules'), nav('roadmap', 'Roadmap'));

fs.writeFileSync(file + '.bak', fs.readFileSync(file));
fs.writeFileSync(file, s.trimEnd() + '\n\n/* ═════════ NEW SECTIONS ═════════ */\n' + code.trim() + '\n');
console.log('Done. Backup: ' + file + '.bak');
