// Optional headless smoke test. Requires puppeteer (not a project dependency):
//   npm i -D puppeteer && npm run build && npm run preview &
//   node scripts/smoke.mjs
// Boots the built app, starts it, walks the frog, teleports it onto islands to
// exercise the project + contact modals, and captures console errors + shots.
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';

const URL = process.env.SMOKE_URL || 'http://localhost:4173/';
const OUT = process.env.OUT_DIR || '/tmp/froggy-shots';
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--ignore-gpu-blocklist',
    '--window-size=1280,800',
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
const frog = () =>
  page.evaluate(() => {
    const f = window.__frog;
    return f ? { x: +f.position.x.toFixed(2), z: +f.position.z.toFixed(2) } : null;
  });
const tp = (x, z) => page.evaluate(([x, z]) => window.__frog.position.set(x, 0, z), [x, z]);
const waitModal = () =>
  page.waitForFunction(() => !!document.querySelector('.modal-card'), { timeout: 4000 }).catch(() => {});

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push('console.error: ' + m.text()));
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

const gl = await page.evaluate(() => {
  const c = document.querySelector('canvas');
  const ctx = c && (c.getContext('webgl2') || c.getContext('webgl'));
  return ctx ? 'ok' : 'no-context';
});
console.log('WebGL:', gl);

await page.waitForFunction(() => {
  const b = document.querySelector('.start__btn');
  return b && !b.disabled;
}, { timeout: 15000 });
await page.screenshot({ path: `${OUT}/01-start.png` });

await page.click('.start__btn');
await sleep(1200);
console.log('start frog =', await frog());
await page.screenshot({ path: `${OUT}/02-intro.png` });

// Walk up off the intro island for a moment.
await page.keyboard.down('KeyW');
await sleep(1500);
await page.keyboard.up('KeyW');
console.log('after W, frog =', await frog());

// Tour the mid-garden from a bridge midpoint clear of any node's open range.
await tp(-0.75, 1.75);
await sleep(900);
await page.screenshot({ path: `${OUT}/03-garden.png` });

// Project island (XR Utility Explorer at [2,5]).
await tp(2, 5);
await waitModal();
await sleep(600);
let title = await page.$eval('#modal-title', (e) => e.textContent).catch(() => null);
console.log('project modal title:', title);
await page.screenshot({ path: `${OUT}/04-project.png` });
await page.click('.modal-close');
await sleep(500);

// Walk away so the dismissed-lock clears, then contact island ([1.5,-8.5]).
await tp(2, 9);
await sleep(300);
await tp(1.5, -8.5);
await waitModal();
await sleep(600);
title = await page.$eval('#modal-title', (e) => e.textContent).catch(() => null);
const hasLinks = await page.$('.modal-links');
console.log('contact modal title:', title, '| has link list:', !!hasLinks);
await page.screenshot({ path: `${OUT}/05-contact.png` });

console.log('--- ERRORS (' + errors.length + ') ---');
for (const e of errors.slice(0, 40)) console.log(e);

await browser.close();
process.exit(errors.length ? 2 : 0);
