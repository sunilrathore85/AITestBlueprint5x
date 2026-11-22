export const LOGIN_ROUTE = '/#/login';

export const LoginXPaths = {
  emailInput:
    "//form[@id='js-login-form']//input[@type='email' and @placeholder='Enter email ID']",
  passwordInput:
    "//form[@id='js-login-form']//input[@type='password' and @placeholder='Enter password']",
  signInButton:
    "//form[@id='js-login-form']//button[@type='submit' and normalize-space()='Sign in']",
  authenticationFailureNotification:
    "//div[@id='js-notification-box-msg' and normalize-space()='Your email, password, IP address or location did not match']",
} as const;