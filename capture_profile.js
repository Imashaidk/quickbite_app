const puppeteer = require('puppeteer-core');
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1280, height: 850 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Click Get Started
  const rect = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*')).reverse();
    const el = all.find(e => e.innerText && e.innerText.trim().includes('Get Started'));
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await page.mouse.click(rect.x, rect.y);
  await new Promise(r => setTimeout(r, 1500));

  // Click Sign in as Student
  const rect2 = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*')).reverse();
    const el = all.find(e => e.innerText && e.innerText.trim().includes('Sign In as Student'));
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await page.mouse.click(rect2.x, rect2.y);
  await new Promise(r => setTimeout(r, 2000));

  // Now on Home screen, click 'Student Profile' in sidebar
  const rect3 = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*')).reverse();
    const el = all.find(e => e.innerText && e.innerText.trim() === 'Student Profile');
    if (el) {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    return null;
  });

  if (rect3) {
    console.log('Clicking Student Profile in sidebar at:', rect3);
    await page.mouse.click(rect3.x, rect3.y);
  } else {
    console.log('Clicking top right profile icon...');
    await page.mouse.click(1225, 30);
  }

  await new Promise(r => setTimeout(r, 2000));
  console.log('Capturing 08_profile.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_profile.png') });

  await browser.close();
  console.log('Profile captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
