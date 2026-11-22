export interface LoginCredentials {
  email: string;
  password: string;
}

export interface InvalidLoginCredentials extends LoginCredentials {}

export function getValidLoginCredentials(): LoginCredentials | null {
  const email = process.env.VWO_EMAIL?.trim();
  const password = process.env.VWO_PASSWORD?.trim();

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

export function getInvalidLoginCredentials(): InvalidLoginCredentials {
  return {
    email: process.env.VWO_INVALID_EMAIL?.trim() || 'invalid.user@example.com',
    password: process.env.VWO_INVALID_PASSWORD?.trim() || 'NotAValidPassword123!',
  };
}

export const MISSING_VALID_CREDENTIALS_MESSAGE =
  'Blocked: VWO_EMAIL and VWO_PASSWORD are required to execute the valid-login scenario. Set both values in PlaywrightFramework/.env or the workspace .env.';