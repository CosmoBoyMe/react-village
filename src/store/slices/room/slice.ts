import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { FirebaseAPI } from '../../../FirebaseAPI';
import { BookedDatesData } from '../../../types/BookedDatesData';
import { FeedbackData } from '../../../types/FeedbackData';
import { LikeData } from '../../../types/LikeData';
import { Message } from '../../../types/Message';
import { RoomData } from '../../../types/RoomData';
import { Status } from '../../../types/Status';

type InitialState = {
  room: RoomData | null;
  status: Status;
  errorMessage: Message;
  feedbackStatus: Status;
  feedbackErrorMessage: Message;
  likeStatus: Status;
  likeErrorMessage: Message;
  rateStatus: Status;
  rateErrorMessage: Message;
};

export const initialState: InitialState = {
  room: null,
  status: 'idle',
  errorMessage: null,
  feedbackStatus: 'idle',
  feedbackErrorMessage: null,
  likeStatus: 'idle',
  likeErrorMessage: null,
  rateStatus: 'idle',
  rateErrorMessage: null,
};

const NAMESPACE = 'room';

export const fetchRoomById = createAsyncThunk<
  RoomData,
  number,
  { rejectValue: string }
>(`${NAMESPACE}/fetchRoomById`, async (id, { rejectWithValue }) => {
  try {
    const { data } = await FirebaseAPI.fetchRoomById(id);

    const roomData = Object.values(data)[0];

    return roomData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue('Произошла неизвестная ошибка, попробуйте позже');
  }
});

export const getBookings = createAsyncThunk<
  BookedDatesData | undefined,
  number,
  { rejectValue: string }
>(`${NAMESPACE}/getBookings`, async (id, { rejectWithValue }) => {
  try {
    const { data } = await FirebaseAPI.fetchRoomById(id);

    return Object.values(data)[0].bookedDates;
  } catch (error) {
    return axios.isAxiosError(error)
      ? rejectWithValue(error.message)
      : rejectWithValue('Произошла неизвестная ошибка, попробуйте позже');
  }
});

export const addFeedback = createAsyncThunk<
  RoomData,
  FeedbackData,
  { rejectValue: string }
>(`${NAMESPACE}/addFeedback`, async (feedbackData, { rejectWithValue }) => {
  try {
    const { roomNumber, text, userId, date, userName, path, profilePicture } =
      feedbackData;
    const { data } = await FirebaseAPI.addFeedback({
      roomNumber,
      text,
      userId,
      date,
      profilePicture,
      userName,
      path,
    });

    return Object.values(data)[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Произошла неизвестная ошибка, попробуйте позже');
  }
});

export const changeLike = createAsyncThunk<
  RoomData,
  LikeData,
  { rejectValue: string }
>(`${NAMESPACE}/changeLike`, async (likeData, { rejectWithValue }) => {
  const method = likeData.isLiked ? 'addLike' : 'removeLike';
  try {
    const { roomNumber, userId, path } = likeData;
    const { data } = await FirebaseAPI[method]({
      roomNumber,
      userId,
      path,
    });

    return Object.values(data)[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Произошла неизвестная ошибка, попробуйте позже');
  }
});

const slice = createSlice({
  name: NAMESPACE,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomById.fulfilled, (state, { payload }) => {
        state.status = 'resolved';
        state.room = payload;
        state.errorMessage = null;
      })
      .addCase(getBookings.fulfilled, (state, { payload }) => {
        if (state.room)
          state.room.bookedDates = payload || state.room.bookedDates;
      })
      .addCase(addFeedback.fulfilled, (state, { payload }) => {
        state.feedbackStatus = 'resolved';
        state.room = payload;
        state.feedbackErrorMessage = null;
      })
      .addCase(changeLike.fulfilled, (state, { payload }) => {
        state.likeStatus = 'resolved';
        state.room = payload;
        state.likeErrorMessage = null;
      })
      .addCase(fetchRoomById.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(addFeedback.pending, (state) => {
        state.feedbackStatus = 'loading';
        state.feedbackErrorMessage = null;
      })
      .addCase(changeLike.pending, (state) => {
        state.likeStatus = 'loading';
        state.likeErrorMessage = null;
      })
      .addCase(fetchRoomById.rejected, (state, { payload }) => {
        state.status = 'rejected';
        if (payload) state.errorMessage = payload;
        else state.errorMessage = 'Не удалось загрузить страницу';
      })
      .addCase(addFeedback.rejected, (state, { payload }) => {
        state.feedbackStatus = 'rejected';
        if (payload) state.feedbackErrorMessage = payload;
        else state.feedbackErrorMessage = 'Не удалось сохранить отзыв';
      })
      .addCase(changeLike.rejected, (state, { payload }) => {
        state.likeStatus = 'rejected';
        if (payload) state.likeErrorMessage = payload;
        else state.likeErrorMessage = 'Не удалось установить лайк';
      });
  },
});

const roomReducer = slice.reducer;

export { roomReducer };
