import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { FirebaseAPI } from '../../../FirebaseAPI';
import { FeedbackData } from '../../../types/FeedbackData';
import { LikeData } from '../../../types/LikeData';
import { Message } from '../../../types/Message';
import { RateData } from '../../../types/RateData';
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

const initialState: InitialState = {
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

export const addFeedback = createAsyncThunk<
  RoomData,
  FeedbackData,
  { rejectValue: string }
>(`${NAMESPACE}/addFeedback`, async (feedbackData, { rejectWithValue }) => {
  try {
    const {
      roomNumber,
      text,
      sequenceNumber,
      userId,
      date,
      userName,
      path,
      profilePicture,
    } = feedbackData;
    const { data } = await FirebaseAPI.addFeedback({
      roomNumber,
      sequenceNumber,
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
    const { roomNumber, sequenceNumber, userId, path } = likeData;
    const { data } = await FirebaseAPI[method]({
      roomNumber,
      sequenceNumber,
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

export const setRate = createAsyncThunk<
  RoomData,
  RateData,
  { rejectValue: string }
>(`${NAMESPACE}/setRate`, async (rateData, { rejectWithValue }) => {
  try {
    const { roomNumber, userId, rate, sequenceNumber, path } = rateData;
    const method = path ? 'changeRate' : 'addRate';
    const { data } = await FirebaseAPI[method]({
      sequenceNumber,
      roomNumber,
      userId,
      rate,
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
      .addCase(setRate.fulfilled, (state, { payload }) => {
        state.rateStatus = 'resolved';
        state.room = payload;
        state.rateErrorMessage = null;
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
      .addCase(setRate.pending, (state) => {
        state.rateStatus = 'loading';
        state.rateErrorMessage = null;
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
      })
      .addCase(setRate.rejected, (state, { payload }) => {
        state.likeStatus = 'rejected';
        if (payload) state.rateErrorMessage = payload;
        else state.rateErrorMessage = 'Не удалось установить оценку';
      });
  },
});

const roomReducer = slice.reducer;

export { roomReducer };
