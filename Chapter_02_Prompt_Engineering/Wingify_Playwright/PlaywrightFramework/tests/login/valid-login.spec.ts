import * as allure from 'allure-js-commons';
import { LoginOracles } from '../../src/config/login-oracles';
import { testWithLocatorValidation as test, expect } from '../../src/fixtures/login.fixture';
import {
  getValidLoginCredentials,
  MISSING_VALID_CREDENTIALS_MESSAGE,
} from '../../src/utils/credentials';

test.describe('Login - valid credentials', () => {
  test('authenticates when email and password are valid', async ({ loginPage, page }) => {
    await allure.epic('VWO Login Dashboard');
    await allure.feature('Authentication');
    await allure.story('Positive - valid email and password');

    const credentials = getValidLoginCredentials();
    if (!credentials) {
      test.skip(true, MISSING_VALID_CREDENTIALS_MESSAGE);
      return;
    }

    await loginPage.login(credentials.email, credentials.password);

    await expect(page).not.toHaveURL(new RegExp(`${LoginOracles.loginUrlFragment}$`), {
      timeout: 30_000,
    });
    await expect(page).not.toHaveTitle(LoginOracles.loginPageTitle, { timeout: 30_000 });
  });
});