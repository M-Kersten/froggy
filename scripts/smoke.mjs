// Optional headless smoke test. Requires puppeteer (not a project dependency):
//   npm i -D puppeteer && npm run build && npm run preview &
//   node scripts/smoke.mjs
// Boots the built app, starts it, drives the frog, and verifies the project
// modal opens/closes — capturing console errors and screenshots to /tmp.
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';

const URL = process.env.SMOKE_URL || 'http://localhost:4173/';
const OUT = process.env.OUT_DIR || '/tmp/froggy-shots';
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const frog = () => page.evaluate(() => {
  const f = window.__frog;
  return f ? { x: +f.position.x.toFixed(2), z: +f.position.z.toFixed(2) } : null;
});

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

const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console.error: ' + m.text());
});
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

await page.waitForFunction(() => {
  const b = document.querySelector('.start__btn');
  return b && !b.disabled;
}, { timeout: 15000 });
await page.screenshot({ path: `${OUT}/01-start.png` });

await page.click('.start__btn');
await sleep(1200);
console.log('after start, frog =', await frog());
await page.screenshot({ path: `${OUT}/02-pond.png` });

// Confirm WASD drives the frog (note: headless software-WebGL runs at a few
// fps, so it crawls here — it's ~3.5 u/s at 60fps).
await page.keyboard.down('KeyW');
await sleep(1500);
await page.keyboard.up('KeyW');
const moved = await frog();
console.log('after holding W, frog =', moved, '(z should be < 6.7)');
await page.screenshot({ path: `${OUT}/03-moved.png` });

// Teleport next to a project pad to exercise proximity → auto modal
// (independent of the slow headless framerate).
await page.evaluate(() => window.__frog.position.set(0, 0, -7.2));
await page.waitForFunction(() => !!document.querySelector('.modal-card'), { timeout: 4000 }).catch(() => {});
await sleep(600);
let modal = await page.$('.modal-card');
const title = await page.$eval('#modal-title', (e) => e.textContent).catch(() => null);
console.log('Modal open near pad:', !!modal, '| title:', title);
await page.screenshot({ path: `${OUT}/04-modal.png` });

// Close it.
if (modal) {
  await page.click('.modal-close');
  await sleep(600);
  const stillOpen = await page.$('.modal-card');
  console.log('Modal closed on button:', !stillOpen);
}
await page.screenshot({ path: `${OUT}/05-final.png` });

console.log('--- ERRORS (' + errors.length + ') ---');
for (const e of errors.slice(0, 40)) console.log(e);

await browser.close();
process.exit(errors.length ? 2 : 0);
