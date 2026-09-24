const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function clickText(page, text) {
  const rect = await page.evaluate((targetText) => {
    // Find leaf nodes or elements that contain targetText
    const all = Array.from(document.querySelectorAll('*'));
    // reverse to check inner-most elements first
    for (let el of all.reverse()) {
      if (el.innerText && el.innerText.trim().includes(targetText) && el.children.length <= 3) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
      }
    }
    return null;
  }, text);

  if (rect) {
    console.log(`Clicking "${text}" at (${Math.round(rect.x)}, ${Math.round(rect.y)})...`);
    await page.mouse.click(rect.x, rect.y);
    return true;
  } else {
    console.warn(`Could not find element with text "${text}"`);
    return false;
  }
}

async function run() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1280, height: 850 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log('Navigating to http://localhost:8081...');
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  // 1. Splash Screen
  console.log('1. Capturing 01_welcome_splash.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_welcome_splash.png') });

  // 2. Login Screen
  console.log('Navigating to Login...');
  await clickText(page, 'Get Started');
  await new Promise(r => setTimeout(r, 2000));
  console.log('2. Capturing 02_login_screen.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_login_screen.png') });

  // 3. Home Screen
  console.log('Navigating to Home...');
  await clickText(page, 'Sign In as Student');
  await new Promise(r => setTimeout(r, 2500));
  console.log('3. Capturing 03_home_catalog.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_home_catalog.png') });

  // 4. Item Detail Screen
  console.log('Navigating to Item Detail...');
  await clickText(page, 'Chicken Kottu Roti');
  await new Promise(r => setTimeout(r, 2000));
  console.log('4. Capturing 04_item_detail.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_item_detail.png') });

  // Add to tray
  console.log('Adding to Tray...');
  await clickText(page, 'Add to Tray');
  await new Promise(r => setTimeout(r, 1500));

  // 5. Cart Screen
  console.log('Navigating to Cart...');
  const clickedTray = await clickText(page, 'View Tray');
  if (!clickedTray) {
    await clickText(page, 'Tray');
  }
  await new Promise(r => setTimeout(r, 2000));
  console.log('5. Capturing 05_cart_tray.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_cart_tray.png') });

  // 6. Checkout Screen
  console.log('Navigating to Checkout...');
  await clickText(page, 'Proceed to Checkout');
  await new Promise(r => setTimeout(r, 2000));
  console.log('6. Capturing 06_checkout.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_checkout.png') });

  // 7. Order Tracking Screen
  console.log('Placing Order...');
  await clickText(page, 'Confirm and Place Order');
  await new Promise(r => setTimeout(r, 2500));
  console.log('7. Capturing 07_order_tracking.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_order_tracking.png') });

  // 8. Profile Screen
  console.log('Navigating to Profile...');
  await clickText(page, 'Return to Home Menu');
  await new Promise(r => setTimeout(r, 2000));

  await clickText(page, 'Kavindu Perera');
  await new Promise(r => setTimeout(r, 2000));
  console.log('8. Capturing 08_profile.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_profile.png') });

  await browser.close();
  console.log('All 8 unique screenshots captured successfully!');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
