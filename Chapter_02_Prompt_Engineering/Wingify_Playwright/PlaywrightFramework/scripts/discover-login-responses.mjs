import { chromium } from '@playwright/test';

const LOGIN_URL = 'https://app.wingify.com/#/login';
const xpaths = {
  email: "//form[@id='js-login-form']//input[@type='email' and @placeholder='Enter email ID']",
  password:
    "//form[@id='js-login-form']//input[@type='password' and @placeholder='Enter password']",
  signIn:
    "//form[@id='js-login-form']//button[@type='submit' and normalize-space()='Sign in']",
  emailInvalid:
    "//form[@id='js-login-form']//input[@type='email' and @placeholder='Enter email ID']/ancestor::*[contains(@class,'form-block')][1]//span[contains(@class,'invalid-reason') and normalize-space()='Invalid email']",
};

async function collectVisibleLoginFeedback(page) {
  return page.evaluate(() => {
    const form = document.querySelector('#js-login-form');
    if (!form) {
      return { formFound: false, messages: [], url: location.href, title: document.title };
    }

    const formMessages = Array.from(
      form.querySelectorAll('.invalid-reason, .text--danger, [role="alert"]'),
    )
      .map((el) => ({
        text: (el.textContent || '').trim(),
        visible: Boolean(el.offsetParent),
        className: String(el.className),
      }))
      .filter((item) => item.text.length > 0);

    const globalMessages = Array.from(
      document.querySelectorAll(
        '.notification, .notification--error, .banner, [class*="notification"]',
      ),
    )
      .map((el) => ({
        text: (el.textContent || '').trim().replace(/\s+/g, ' '),
        visible: Boolean(el.offsetParent),
        className: String(el.className),
      }))
      .filter((item) => item.text.length > 0);

    return {
      formFound: true,
      url: location.href,
      title: document.title,
      messages: [...formMessages, ...globalMessages],
    };
  });
}

async function runScenario(name, action, page) {
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
  await page.locator(xpaths.signIn).waitFor({ state: 'visible' });
  await action(page);
  await page.waitForTimeout(2500);
  const feedback = await collectVisibleLoginFeedback(page);
  return { scenario: name, feedback };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const results = [];

results.push(
  await runScenario('empty-credentials', async (activePage) => {
    await activePage.locator(xpaths.signIn).click();
  }, page),
);

results.push(
  await runScenario('invalid-credentials', async (activePage) => {
    await activePage.locator(xpaths.email).fill('invalid.user@example.com');
    await activePage.locator(xpaths.password).fill('NotAValidPassword123!');
    await activePage.locator(xpaths.signIn).click();
  }, page),
);

await browser.close();
console.log(JSON.stringify(results, null, 2));