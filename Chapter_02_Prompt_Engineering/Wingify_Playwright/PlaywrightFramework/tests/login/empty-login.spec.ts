import * as allure from 'allure-js-commons';
import { LoginOracles } from '../../src/config/login-oracles';
import { testWithLocatorValidation as test, expect } from '../../src/fixtures/login.fixture';

test.describe('Login - empty credentials', () => {
  test('rejects login when email and password are empty', async ({ loginPage, page }) => {
    await allure.epic('VWO Login Dashboard');
    await allure.feature('Authentication');
    await allure.story('Negative - empty email and password');

    await loginPage.clearCredentials();
    await loginPage.submitSignIn();

    await expect(loginPage.authenticationFailureNotification).toBeVisible({
      timeout: 15_000,
    });
    await expect(loginPage.authenticationFailureNotification).toHaveText(
      LoginOracles.authenticationFailureMessage,
    );
    await expect(page).toHaveURL(new RegExp(`${LoginOracles.loginUrlFragment}$`));
    await expect(page).toHaveTitle(LoginOracles.loginPageTitle);
    await expect(loginPage.signInButton).toBeVisible();
  });
});