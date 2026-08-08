const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  
  // Try to login as admin
  await page.evaluate(() => {
    localStorage.setItem('user', JSON.stringify({id: 'admin_id', username: 'admin', role: 'admin'}));
    localStorage.setItem('current_username', 'admin');
  });
  
  await page.reload();
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
