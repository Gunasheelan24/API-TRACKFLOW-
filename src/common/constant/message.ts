export const errorMessage = {
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
} as const;

export const successMessage = {
  ACCOUNT_CREATED: 'Account created successfully',
  LOGIN_SUCCESS: 'Successfully logged in to your account',
} as const;
