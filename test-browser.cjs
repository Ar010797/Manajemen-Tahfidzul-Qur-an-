const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR CONSOLE:', msg.text());
  });
  page.on('pageerror', error => console.log('BROWSER EXCEPTION:', error.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('currentUser', JSON.stringify({ id: '1', username: 'admin', role: 'admin' }));
    localStorage.setItem('token', 'local-token');
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  const content = await page.content();
  if (content.includes('Kelas 6 (SD)')) {
     console.log('SUCCESS: AdminProgressReport rendered!');
  } else {
     console.log('FAILURE: AdminProgressReport text not found!');
     // Let's just output the text content of the body
     console.log(await page.evaluate(() => document.body.innerText.substring(0, 500)));
  }
  
  await browser.close();
})();
