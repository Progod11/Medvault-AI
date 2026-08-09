const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting Real Browser Test...");
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPass = 'Password123!';
  
  try {
    // 1. SIGNUP in Browser A
    const page1 = await browser.newPage();
    console.log("Navigating to /signup...");
    await page1.goto('http://localhost:3000/signup', { waitUntil: 'networkidle0' });
    
    await page1.type('input[type="text"]', 'Test User');
    await page1.type('input[type="email"]', testEmail);
    await page1.type('input[type="password"]', testPass);
    await page1.click('button[type="submit"]');
    
    await page1.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    console.log("Signed up and logged in. Current URL:", page1.url());
    
    // Navigate to Family Members
    await page1.goto('http://localhost:3000/family', { waitUntil: 'networkidle0' });
    
    // Click Add Member
    await page1.click('button:has-text("Add Family Member")');
    // Wait for modal
    await page1.waitForSelector('input[placeholder="e.g. Jane Doe"]', { visible: true });
    
    // Type in details
    await page1.type('input[placeholder="e.g. Jane Doe"]', 'John BrowserOne');
    await page1.type('input[placeholder="e.g. Mother, Son, Spouse"]', 'Brother');
    await page1.type('input[placeholder="e.g. 35"]', '25');
    await page1.select('select', 'O+'); // Blood group
    
    // Submit form
    await page1.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find(b => b.textContent === 'Save Member');
      if (submitBtn) submitBtn.click();
    });
    
    // Wait for the modal to close or the member to appear
    await page1.waitForFunction(
      () => document.body.innerText.includes('John BrowserOne'),
      { timeout: 5000 }
    );
    console.log("✅ Browser 1 successfully added family member to local state + Firebase.");
    
    // Wait a couple seconds to ensure Firestore write completes
    await new Promise(r => setTimeout(r, 2000));
    
    // 2. LOGIN in Browser B
    const page2 = await browser.newPage();
    console.log("Navigating to /login in Browser B...");
    await page2.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    
    await page2.type('input[type="email"]', testEmail);
    await page2.type('input[type="password"]', testPass);
    await page2.click('button[type="submit"]');
    
    await page2.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    console.log("Logged in Browser B. Current URL:", page2.url());
    
    // Navigate to Family Members
    await page2.goto('http://localhost:3000/family', { waitUntil: 'networkidle0' });
    
    // Check if the data is there
    await new Promise(r => setTimeout(r, 2000)); // wait for Firestore sync
    
    const page2Content = await page2.content();
    if (page2Content.includes('John BrowserOne')) {
      console.log("✅ SUCCESS: Browser B successfully synced data from Firestore!");
    } else {
      console.log("❌ FAILED: Browser B does NOT show the family member.");
      console.log("Browser B Content Extract:", page2Content.substring(0, 500));
    }

  } catch (error) {
    console.error("Test failed with error:", error);
  } finally {
    await browser.close();
  }
})();
