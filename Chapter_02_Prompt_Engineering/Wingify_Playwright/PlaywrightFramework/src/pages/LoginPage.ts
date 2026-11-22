import { Locator, Page } from '@playwright/test';
import { LOGIN_ROUTE, LoginXPaths } from '../config/login-locators';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly authenticationFailureNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator(LoginXPaths.emailInput);
    this.passwordInput = page.locator(LoginXPaths.passwordInput);
    this.signInButton = page.locator(LoginXPaths.signInButton);
    this.authenticationFailureNotification = page.locator(
      LoginXPaths.authenticationFailureNotification,
    );
  }

  async goto(): Promise<void> {
    await this.page.goto(LOGIN_ROUTE, { waitUntil: 'domcontentloaded' });
    await this.signInButton.waitFor({ state: 'visible' });
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submitSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.submitSignIn();
  }

  async clearCredentials(): Promise<void> {
    await this.emailInput.fill('');
    await this.passwordInput.fill('');
  }
}