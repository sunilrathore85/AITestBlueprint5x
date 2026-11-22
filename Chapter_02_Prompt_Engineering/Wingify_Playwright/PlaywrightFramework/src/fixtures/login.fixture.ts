import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { validateLoginLocators } from '../utils/locator-validation';

type LoginFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<LoginFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export const testWithLocatorValidation = base.extend<LoginFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const results = await validateLoginLocators(page);
    const primaryLocators = results.slice(0, 3);
    const invalid = primaryLocators.filter((result) => result.matchCount !== 1);

    if (invalid.length > 0) {
      throw new Error(
        `Login XPath locators must match exactly one element: ${JSON.stringify(invalid)}`,
      );
    }

    const invisibleMandatory = primaryLocators.filter((result) => !result.visible);
    if (invisibleMandatory.length > 0) {
      throw new Error(
        `Login XPath locators must resolve to visible elements: ${JSON.stringify(invisibleMandatory)}`,
      );
    }

    await use(loginPage);
  },
});

export { expect } from '@playwright/test';