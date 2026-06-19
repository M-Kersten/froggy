// Optional headless smoke test. Requires puppeteer (not a project dependency):
//   npm i -D puppeteer && npm run build && npm run preview &
//   node scripts/smoke.mjs
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';

const URL = process.env.SMOKE_URL || 'http://localhost:4173/';
const OUT = process.env.OUT_DIR || '/tmp/froggy-shots';
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist', '--window-size=1280,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
const frog = () => page.evaluate(() => (window.__frog ? { x: +window.__frog.position.x.toFixed(2), z: +window.__frog.position.z.toFixed(2) } : null));
const scrollTo = (sel) => page.evaluate((s) => document.querySelector(s)?.scrollIntoView({ behavior: 'instant', block: 'start' }), sel);

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push('console.error: ' + m.text()));
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
await page.waitForSelector('canvas', { timeout: 15000 });
const gl = await page.evaluate(() => { const c = document.querySelector('canvas'); const x = c && (c.getContext('webgl2') || c.getContext('webgl')); return x ? 'ok' : 'none'; });
console.log('WebGL:', gl);
await sleep(1500);
await page.screenshot({ path: `${OUT}/01-hero.png` });

// Hover the pond + walk with W.
const box = await page.$eval('.pond-wrap', (el) => { const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
await page.mouse.move(box.x, box.y);
await sleep(100);
await page.keyboard.down('KeyW');
await sleep(1200);
await page.keyboard.up('KeyW');
console.log('after W, frog =', await frog());

// Sidebar quick-jump → opens a modal.
await page.evaluate(() => [...document.querySelectorAll('.pond-card')].find((b) => b.textContent.includes('Speaking'))?.click());
await page.waitForFunction(() => !!document.querySelector('.modal-card'), { timeout: 4000 }).catch(() => {});
await sleep(600);
console.log('sidebar modal:', await page.$eval('#modal-title', (e) => e.textContent).catch(() => null));
await page.screenshot({ path: `${OUT}/02-jump-modal.png` });
await page.click('.modal-close').catch(() => {});
await sleep(400);

// Content sections.
await scrollTo('#work'); await sleep(500); await page.screenshot({ path: `${OUT}/03-work.png` });
await scrollTo('#about'); await sleep(400); await page.screenshot({ path: `${OUT}/04-about.png` });
await scrollTo('#contact'); await sleep(400); await page.screenshot({ path: `${OUT}/05-contact.png` });

console.log('--- ERRORS (' + errors.length + ') ---');
for (const e of errors.slice(0, 40)) console.log(e);
await browser.close();
process.exit(errors.length ? 2 : 0);
