/* eslint-disable @typescript-eslint/no-misused-promises */
import axios, { AxiosResponse } from 'axios';
import { initializeApp } from 'firebase/app';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { changeFeedbackInfo } from './shared/helpers/changeFeedbackInfo/changeFeedbackInfo';
import {
  AuthResponseData,
  ReAuthPostData,
  ReAuthResponseData,
  SignInData,
  SignUpData,
  SignUpPostData,
} from './types/AuthData';
import { BookingData, BookingRequestData } from './types/BookingData';
import { FeedbackData, FeedbackItemData } from './types/FeedbackData';
import { LikeData } from './types/LikeData';
import { RateData } from './types/RateData';
import { RoomData } from './types/RoomData';

type ChangePasswordData = {
  email: string;
  password: string;
  newPassword: string;
};

type ChangePasswordResponse = {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
};

const API_KEY = 'AIzaSyCzs3m1T-AwNOuezc9VVx8gWcrndQyIisY';
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'react-village-d5bce.firebaseapp.com',
  databaseURL: 'https://react-village-d5bce-default-rtdb.firebaseio.com',
  projectId: 'react-village-d5bce',
  storageBucket: 'react-village-d5bce.appspot.com',
  messagingSenderId: '903474401236',
  appId: '1:903474401236:web:4e87d7adb9bc43c9361041',
  measurementId: 'G-PHSNLX928V',
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

const axiosInstance = axios.create({
  baseURL: 'https://react-village-d5bce-default-rtdb.firebaseio.com/',
});

const authInstance = axios.create({
  baseURL: 'https://identitytoolkit.googleapis.com/v1',
  params: {
    key: API_KEY,
  },
});

const FirebaseAPI = {
  fetchRooms: async () => axiosInstance.get<RoomData[]>('rooms.json'),

  fetchRoomById: async (id: number) =>
    axiosInstance.get<Record<string, RoomData>>('rooms.json', {
      params: {
        orderBy: '"roomNumber"',
        equalTo: id,
      },
    }),

  fetchBookingsByUserId: async (userId: string) =>
    axiosInstance.get<{
      booking: { [key: string]: BookingData };
    } | null>(`users/${userId}.json`),

  makeBooking: async ({
    roomNumber,
    userId,
    discount,
    additionalService,
    totalAmount,
    dates,
    guests,
    bookingStatus,
  }: BookingRequestData) => {
    const roomData = await FirebaseAPI.fetchRoomById(Number(roomNumber));
    const [roomIdKey] = Object.keys(roomData.data);

    const { status, data } = await axiosInstance.post<{ name: string }>(
      `rooms/${roomIdKey}/bookedDates.json`,
      {
        dates,
        userId,
      }
    );
    if (status === 200) {
      axiosInstance.post(`users/${userId}/booking.json`, {
        roomNumber,
        discount,
        additionalService,
        totalAmount,
        dates,
        guests,
        bookingStatus,
      });
    }
    return data;
  },

  addFeedback: async function addFeedback({
    roomNumber,
    path,
    text,
    userId,
    profilePicture,
    date,
    userName,
  }: FeedbackData) {
    const { data } = await FirebaseAPI.fetchRoomById(Number(roomNumber));
    const [roomIdKey] = Object.keys(data);

    await axiosInstance.post(`rooms/${roomIdKey}/${path}.json`, {
      text,
      userId,
      date,
      profilePicture,
      userName,
      path,
    });
    return this.fetchRoomById(Number(roomNumber));
  },

  addLike: async function addLike({ roomNumber, path, userId }: LikeData) {
    const { data } = await FirebaseAPI.fetchRoomById(Number(roomNumber));
    const [roomIdKey] = Object.keys(data);
    await axiosInstance.post(`rooms/${roomIdKey}/${path}.json`, {
      userId,
    });
    return this.fetchRoomById(Number(roomNumber));
  },

  removeLike: async function removeLike({ roomNumber, path }: LikeData) {
    const { data } = await FirebaseAPI.fetchRoomById(Number(roomNumber));
    const [roomIdKey] = Object.keys(data);
    await axiosInstance.delete<{ name: string }>(
      `rooms/${roomIdKey}/${path}.json`
    );
    return this.fetchRoomById(Number(roomNumber));
  },

  setRate: async function setRate({
    roomNumber,
    rate,
    userId,
  }: RateData & { roomNumber: string }) {
    const { data } = await FirebaseAPI.fetchRoomById(Number(roomNumber));

    const [roomIdKey] = Object.keys(data);
    const { rates } = Object.values(data)[0];

    const previousRate = Object.entries(rates ?? {}).find(
      (item) => item[1].userId === userId
    );

    if (previousRate) {
      await axiosInstance.put(
        `rooms/${roomIdKey}/rates/${previousRate[0]}.json`,
        {
          userId,
          rate,
        }
      );
    } else {
      await axiosInstance.post(`rooms/${roomIdKey}/rates.json`, {
        userId,
        rate,
      });
    }

    return rates;
  },

  signUp: async ({ email, password, name, surname }: SignUpData) =>
    authInstance.post<
      AuthResponseData,
      AxiosResponse<AuthResponseData>,
      SignUpPostData
    >('accounts:signUp', {
      email,
      password,
      displayName: `${name} ${surname}`,
      returnSecureToken: true,
    }),

  signIn: async ({ email, password }: Omit<SignInData, 'returnSecureToken'>) =>
    authInstance.post<
      AuthResponseData,
      AxiosResponse<AuthResponseData>,
      SignInData
    >('accounts:signInWithPassword', {
      email,
      password,
      returnSecureToken: true,
    }),

  reauthenticate: async (refreshToken: string) =>
    axios.post<
      ReAuthResponseData,
      AxiosResponse<ReAuthResponseData>,
      ReAuthPostData
    >(
      'https://securetoken.googleapis.com/v1/token',
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          key: API_KEY,
        },
      }
    ),
  removeUserBooking: async (userId: string, bookingId: string) =>
    axiosInstance.delete(`users/${userId}/booking/${bookingId}.json`),

  removeRoomBooking: async (roomIndex: string, id: string) =>
    axiosInstance.delete(`rooms/${roomIndex}/bookedDates/${id}.json`),

  changePassword: async function changePassword({
    email,
    password,
    newPassword,
  }: ChangePasswordData) {
    const {
      data: { idToken },
    } = await this.signIn({ email, password });
    return authInstance.post<ChangePasswordResponse>('accounts:update', {
      password: newPassword,
      idToken,
      returnSecureToken: true,
    });
  },

  deleteAccount: async function deleteAccount({
    email,
    password,
  }: Omit<SignInData, 'returnSecureToken'>) {
    const {
      data: { idToken },
    } = await this.signIn({ email, password });

    return authInstance.post('accounts:delete', {
      idToken,
    });
  },

  updateProfilePicture: async (file: File, userId: string, token: string) => {
    const storageRef = ref(
      storage,
      `${userId}-avatar.${file.type.split('/')[1]}`
    );

    await uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    });

    const url = await getDownloadURL(storageRef);
    await authInstance.post('accounts:update', {
      idToken: token,
      photoUrl: url,
    });

    const { data: roomsData } = await FirebaseAPI.fetchRooms();

    roomsData.forEach(async ({ feedback }, index) => {
      if (feedback) {
        const newFeedback = changeFeedbackInfo<string>(
          userId,
          'profilePicture',
          url,
          feedback
        );
        await axiosInstance.put(`rooms/${index}/feedback.json`, {
          ...newFeedback,
        });
      }
    });
    return url;
  },

  updateUserName: async ({
    name,
    surname,
    userId,
    token,
  }: {
    userId: string;
    token: string;
    name: string;
    surname: string;
  }) => {
    const displayName = `${name} ${surname}`;

    const { data } = await authInstance.post<
      AuthResponseData,
      AxiosResponse<AuthResponseData>,
      { idToken: string; displayName: string }
    >('accounts:update', {
      idToken: token,
      displayName,
    });

    const { data: roomsData } = await FirebaseAPI.fetchRooms();

    roomsData.forEach(async ({ feedback }, index) => {
      if (feedback) {
        const newFeedback = changeFeedbackInfo<string>(
          userId,
          'userName',
          displayName,
          feedback
        );

        await axiosInstance.put<FeedbackItemData>(
          `rooms/${index}/feedback.json`,
          {
            ...newFeedback,
          }
        );
      }
    });

    return data.displayName;
  },
};

export { FirebaseAPI };
