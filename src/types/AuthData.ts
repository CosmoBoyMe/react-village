type SignUpData = {
  email: string;
  password: string;
  name: string;
  surname: string;
};

type SignUpPostData = {
  email: string;
  password: string;
  displayName: string;
  returnSecureToken: boolean;
};

type SignInData = {
  email: string;
  password: string;
  returnSecureToken: boolean;
};

type AuthResponseData = {
  idToken: string;
  refreshToken: string;
  localId: string;
  email: string;
  expiresIn: string;
  displayName: string;
  profilePicture: string;
};

type ReAuthResponseData = {
  expires_in: string;
  refresh_token: string;
  id_token: string;
};

type ReAuthPostData = {
  grant_type: 'refresh_token';
  refresh_token: string;
};

export type {
  AuthResponseData,
  ReAuthPostData,
  ReAuthResponseData,
  SignInData,
  SignUpData,
  SignUpPostData,
};
