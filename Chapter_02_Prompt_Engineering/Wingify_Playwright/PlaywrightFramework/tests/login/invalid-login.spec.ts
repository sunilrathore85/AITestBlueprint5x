import * as allure from 'allure-js-commons';
import { LoginOracles } from '../../src/config/login-oracles';
import { testWithLocatorValidation as test, expect } from '../../src/fixtures/login.fixture';
import { getInvalidLoginCredentials } from '../../src/utils/credentials';

test.describe('Login - invalid credentials', () => {
  test('rejects login when email and password are invalid', async ({ loginPage, page }) => {
    await allure.epic('VWO Login Dashboard');
    await allure.feature('Authentication');
    await allure.story('Negative - invalid email and password');

    const credentials = getInvalidLoginCredentials();
    await loginPage.login(credentials.email, credentials.password);

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