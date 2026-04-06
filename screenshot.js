const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-step0.png' });
  console.log('Step 0 captured');
  
  // Scroll to step 1
  await page.evaluate(() => {
    const event = new WheelEvent('wheel', { deltaY: 100, bubbles: true });
    window.dispatchEvent(event);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshot-step1.png' });
  console.log('Step 1 captured');
  
  // Scroll to step 2
  await page.evaluate(() => {
    const event = new WheelEvent('wheel', { deltaY: 100, bubbles: true });
    window.dispatchEvent(event);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshot-step2.png' });
  console.log('Step 2 captured');
  
  await browser.close();
  console.log('Done!');
})();
