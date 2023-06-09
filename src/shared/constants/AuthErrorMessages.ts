enum AuthErrorMessages {
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  MISSING_PASSWORD = 'MISSING_PASSWORD',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_ID_TOKEN = 'INVALID_ID_TOKEN',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  TOO_MANY_ATTEMPTS_TRY_LATER = 'TOO_MANY_ATTEMPTS_TRY_LATER',
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN = 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN',
}

export { AuthErrorMessages };
