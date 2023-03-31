import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

import { FirebaseAPI } from '../../../FirebaseAPI';
import { SignInData, SignUpData } from '../../../types/AuthData';
import { Status } from '../../../types/Status';
import type { RootState } from '../../index';

import {
  AuthError,
  calculateExpirationTime,
  ReauthenticateData,
  updateLocalStorage,
  UserData,
} from './helpers';

type InitialState = {
  isAuth: boolean;
  email: string | null;
  token: string | null;
  refreshToken: string | null;
  expirationTime: string | null;
  userId: string | null;
  userName: string | null;
  userSurname: string | null;
  error: AuthError | string | null;
  profilePicture: string | null;
  status: Status;
  changeProfilePictureStatus: Status;
  changeProfilePictureErrorMessage: null | string;
  changePasswordStatus: Status;
  changePasswordErrorMessage: AuthError | string | null;
  deleteAccountStatus: Status;
  deleteAccountErrorMessage: AuthError | string | null;
  changeUserNameStatus: Status;
  changeUserNameErrorMessage: AuthError | string | null;
};

export const initialState: InitialState = {
  isAuth: !!localStorage.getItem('token'),
  token: localStorage.getItem('token') || null,
  email: localStorage.getItem('email') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  expirationTime: localStorage.getItem('expirationTime') || null,
  userId: localStorage.getItem('userId') || null,
  userName: localStorage.getItem('userName') || null,
  userSurname: localStorage.getItem('userSurname') || null,
  profilePicture: localStorage.getItem('profilePicture') || null,
  error: null,
  status: 'idle',
  changeProfilePictureStatus: 'idle',
  changeProfilePictureErrorMessage: null,
  changePasswordStatus: 'idle',
  changePasswordErrorMessage: null,
  deleteAccountStatus: 'idle',
  deleteAccountErrorMessage: null,
  changeUserNameStatus: 'idle',
  changeUserNameErrorMessage: null,
};

const NAMESPACE = 'auth';

export const signUp = createAsyncThunk<
  Omit<UserData, 'profilePicture'>,
  SignUpData,
  { rejectValue: AxiosError<{ error: AuthError }> | string }
>(`${NAMESPACE}/signUp`, async (signUpData, { rejectWithValue }) => {
  try {
    const { data } = await FirebaseAPI.signUp(signUpData);

    const fullName = data.displayName.split(' ');

    const expirationTime = calculateExpirationTime(
      Number(data.expiresIn)
    ).toISOString();

    const userData = {
      email: data.email,
      token: data.idToken,
      refreshToken: data.refreshToken,
      expirationTime,
      userId: data.localId,
      userName: fullName[0],
      userSurname: fullName[1],
    };

    return userData;
  } catch (error) {
    return rejectWithValue(
      axios.isAxiosError(error)
        ? error
        : 'Произошла неизвестная ошибка, попробуйте позже'
    );
  }
});

export const signIn = createAsyncThunk<
  UserData,
  Omit<SignInData, 'returnSecureToken'>,
  { rejectValue: AxiosError<{ error: AuthError }> | string }
>(`${NAMESPACE}/signIn`, async (signInData, { rejectWithValue }) => {
  try {
    const { data } = await FirebaseAPI.signIn(signInData);

    const fullName = data.displayName.split(' ');

    const expirationTime = calculateExpirationTime(
      Number(data.expiresIn)
    ).toISOString();

    const userData = {
      email: data.email,
      token: data.idToken,
      refreshToken: data.refreshToken,
      expirationTime,
      userId: data.localId,
      profilePicture: data.photoUrl,
      userName: fullName[0],
      userSurname: fullName[1],
    };

    return userData;
  } catch (error) {
    return rejectWithValue(
      axios.isAxiosError(error)
        ? error
        : 'Произошла неизвестная ошибка, попробуйте позже'
    );
  }
});

export const reauthenticate = createAsyncThunk<
  ReauthenticateData,
  string,
  { rejectValue: AxiosError<{ error: AuthError }> | string }
>(`${NAMESPACE}/reauthenticate`, async (refreshToken, { rejectWithValue }) => {
  try {
    const { data } = await FirebaseAPI.reauthenticate(refreshToken);

    const expirationTime = calculateExpirationTime(
      Number(data.expires_in)
    ).toISOString();

    const newTokens = {
      token: data.id_token,
      refreshToken: data.refresh_token,
      expirationTime,
    };

    return newTokens;
  } catch (error) {
    return rejectWithValue(
      axios.isAxiosError(error)
        ? error
        : 'Произошла неизвестная ошибка, попробуйте позже'
    );
  }
});

export const changePassword = createAsyncThunk<
  { token: string; refreshToken: string; expirationTime: string },
  { password: string; newPassword: string },
  { state: RootState; rejectValue: AxiosError<{ error: AuthError }> | string }
>(
  `${NAMESPACE}/changePassword`,
  async ({ password, newPassword }, { rejectWithValue, getState }) => {
    const {
      auth: { email },
    } = getState();
    try {
      if (email) {
        const { data } = await FirebaseAPI.changePassword({
          password,
          email,
          newPassword,
        });
        const expirationTime = calculateExpirationTime(
          Number(data.expiresIn)
        ).toISOString();

        return {
          token: data.idToken,
          refreshToken: data.refreshToken,
          expirationTime,
        };
      }
      return rejectWithValue('Вы не авторизованны');
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error : 'Произошла неизвестная ошибка'
      );
    }
  }
);

export const deleteAccount = createAsyncThunk<
  undefined,
  Omit<SignInData, 'returnSecureToken'>,
  { rejectValue: AxiosError<{ error: AuthError }> | string }
>(`${NAMESPACE}/deleteAccount`, async (data, { rejectWithValue }) => {
  try {
    await FirebaseAPI.deleteAccount(data);
    return undefined;
  } catch (error) {
    return rejectWithValue(
      axios.isAxiosError(error)
        ? error
        : 'Произошла неизвестная ошибка, попробуйте позже'
    );
  }
});

export const updateProfilePicture = createAsyncThunk<
  string,
  File,
  { state: RootState; rejectValue: string }
>(
  `${NAMESPACE}/updateProfilePicture`,
  async (file, { rejectWithValue, getState }) => {
    const {
      auth: { token, userId },
    } = getState();
    try {
      if (userId && token) {
        const url = await FirebaseAPI.updateProfilePicture(file, userId, token);
        return url;
      }
      return rejectWithValue('произошла неизвестная ошибка');
    } catch (error) {
      return rejectWithValue('произошла неизвестная ошибка');
    }
  }
);

export const updateUserName = createAsyncThunk<
  { userName: string; userSurname: string } | undefined,
  { name?: string; surname?: string },
  { state: RootState; rejectValue: AxiosError<{ error: AuthError }> | string }
>(
  `${NAMESPACE}/updateUserName`,
  async ({ name, surname }, { rejectWithValue, getState }) => {
    const {
      auth: { userName, userSurname, token, userId },
    } = getState();

    try {
      if (userId && token && userName && userSurname) {
        const data = await FirebaseAPI.updateUserName({
          name: name || userName,
          surname: surname || userSurname,
          userId,
          token,
        });

        const fullName = data.split(' ');

        return { userName: fullName[0], userSurname: fullName[1] };
      }
      return undefined;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error)
          ? error
          : 'Произошла неизвестная ошибка, попробуйте позже'
      );
    }
  }
);

const slice = createSlice({
  name: NAMESPACE,
  initialState,
  reducers: {
    signOut: (state) => {
      updateLocalStorage('remove');

      return {
        ...state,
        email: null,
        profilePicture: null,
        isAuth: false,
        token: null,
        refreshToken: null,
        expirationTime: null,
        userId: null,
        userName: null,
        userSurname: null,
        error: null,
        status: 'idle',
      };
    },

    resetErrors: (state) => {
      return {
        ...state,
        error: null,
        status: 'idle',
      };
    },

    resetDeleteAccountState: (state) => {
      state.deleteAccountErrorMessage = null;
      state.deleteAccountStatus = 'idle';
    },
  },

  extraReducers(builder) {
    builder
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(signUp.fulfilled, (state, { payload }) => {
        updateLocalStorage('set', payload);

        return {
          ...state,
          ...payload,
          status: 'resolved',
          isAuth: !!payload.token,
        };
      })

      .addCase(signUp.rejected, (state, { payload }) => {
        state.status = 'rejected';

        if (payload instanceof AxiosError) {
          if (payload.response?.status === 400) {
            /* eslint-disable-next-line
                @typescript-eslint/no-unsafe-assignment,
                @typescript-eslint/no-unsafe-member-access */
            state.error = payload.response?.data.error;
          } else {
            state.error = payload.message;
          }
        }

        if (typeof payload === 'string') {
          state.error = payload;
        }
      })

      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(signIn.fulfilled, (state, { payload }) => {
        updateLocalStorage('set', payload);

        return {
          ...state,
          ...payload,
          status: 'resolved',
          isAuth: !!payload.token,
        };
      })

      .addCase(signIn.rejected, (state, { payload }) => {
        state.status = 'rejected';

        if (payload instanceof AxiosError) {
          if (payload.response?.status === 400) {
            /* eslint-disable-next-line
                @typescript-eslint/no-unsafe-assignment,
                @typescript-eslint/no-unsafe-member-access */
            state.error = payload.response?.data.error;
          } else {
            state.error = payload.message;
          }
        }

        if (typeof payload === 'string') {
          state.error = payload;
        }
      })

      .addCase(reauthenticate.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(reauthenticate.fulfilled, (state, { payload }) => {
        updateLocalStorage('set', payload);

        return {
          ...state,
          ...payload,
          status: 'resolved',
        };
      })

      .addCase(reauthenticate.rejected, (state, { payload }) => {
        state.status = 'rejected';

        if (payload instanceof AxiosError) {
          if (payload.response?.status === 400) {
            /* eslint-disable-next-line
                @typescript-eslint/no-unsafe-assignment,
                @typescript-eslint/no-unsafe-member-access */
            state.error = payload.response?.data.error;
          } else {
            state.error = payload.message;
          }
        }

        if (typeof payload === 'string') {
          state.error = payload;
        }
      })

      .addCase(changePassword.pending, (state) => {
        state.changePasswordStatus = 'loading';
        state.changePasswordErrorMessage = null;
      })

      .addCase(changePassword.fulfilled, (state, { payload }) => {
        updateLocalStorage('set', payload);

        return {
          ...state,
          ...payload,
          changePasswordStatus: 'resolved',
        };
      })

      .addCase(changePassword.rejected, (state, { payload }) => {
        state.changePasswordStatus = 'rejected';
        if (payload instanceof AxiosError) {
          if (payload.response?.status === 400) {
            /* eslint-disable-next-line
                @typescript-eslint/no-unsafe-assignment,
                @typescript-eslint/no-unsafe-member-access */
            state.changePasswordErrorMessage = payload.response?.data.error;
          } else {
            state.changePasswordErrorMessage = payload.message;
          }
        }

        if (typeof payload === 'string') {
          state.changePasswordErrorMessage = payload;
        }
      })

      .addCase(deleteAccount.pending, (state) => {
        state.deleteAccountStatus = 'loading';
        state.deleteAccountErrorMessage = null;
      })

      .addCase(deleteAccount.fulfilled, (state) => {
        slice.caseReducers.signOut(state);
        state.deleteAccountStatus = 'resolved';
      })

      .addCase(deleteAccount.rejected, (state, { payload }) => {
        state.deleteAccountStatus = 'rejected';
        if (payload instanceof AxiosError) {
          if (payload.response?.status === 400) {
            /* eslint-disable-next-line
                @typescript-eslint/no-unsafe-assignment,
                @typescript-eslint/no-unsafe-member-access */
            state.deleteAccountErrorMessage = payload.response?.data.error;
          } else {
            state.deleteAccountErrorMessage = payload.message;
          }
        }

        if (typeof payload === 'string') {
          state.deleteAccountErrorMessage = payload;
        }
      })

      .addCase(updateProfilePicture.pending, (state) => {
        state.changeProfilePictureStatus = 'loading';
        state.changePasswordErrorMessage = null;
      })

      .addCase(updateProfilePicture.fulfilled, (state, { payload }) => {
        updateLocalStorage('set', { profilePicture: payload });
        state.profilePicture = payload;
        state.changeProfilePictureStatus = 'resolved';
      })

      .addCase(updateProfilePicture.rejected, (state, { payload }) => {
        state.changeProfilePictureStatus = 'rejected';
        if (payload) state.changeProfilePictureErrorMessage = payload;
      })

      .addCase(updateUserName.pending, (state) => {
        state.changeUserNameStatus = 'loading';
        state.changeUserNameErrorMessage = null;
      })

      .addCase(updateUserName.fulfilled, (state, { payload }) => {
        updateLocalStorage('set', payload);

        return {
          ...state,
          ...payload,
          changeUserNameStatus: 'resolved',
        };
      })

      .addCase(updateUserName.rejected, (state, { payload }) => {
        state.changeUserNameStatus = 'rejected';

        if (payload instanceof AxiosError) {
          if (payload.response?.status === 400) {
            /* eslint-disable-next-line
                @typescript-eslint/no-unsafe-assignment,
                @typescript-eslint/no-unsafe-member-access */
            state.changeUserNameErrorMessage = payload.response?.data.error;
          } else {
            state.changeUserNameErrorMessage = payload.message;
          }
        }

        if (typeof payload === 'string') {
          state.changeUserNameErrorMessage = payload;
        }
      });
  },
});

export const { reducer: authReducer, actions: authActions } = slice;
