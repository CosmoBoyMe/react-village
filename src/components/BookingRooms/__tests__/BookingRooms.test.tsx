import { ToastContainer } from 'react-toastify';
import { fireEvent, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { AxiosErrorMessages } from '../../../libs/toastify/index';
import { BookingErrorMessages } from '../../../shared/constants/BookingErrorMessages';
import { DropdownGuestsIds } from '../../../shared/constants/DropdownGuestsIds';
import { mockedStore } from '../../../shared/testUtils/mockedStore';
import { renderWithProviders } from '../../../shared/testUtils/testUtils';
import { initialState as authInitialState } from '../../../store/slices/auth/slice';
import {
  BookingRoom as BookingRoomSliceProps,
  InitialState as InitialStateProfileProps,
  initialState as initialStateProfileDefault,
} from '../../../store/slices/profile/slice';
import { CANCELLATION } from '../../RoomBookingCard/constants';
import { BookingRooms } from '../BookingRooms';

describe('RoomBookingCard', () => {
  const sliceProfile: BookingRoomSliceProps = {
    roomNumber: 1,
    price: 2000,
    feedbackCount: 10,
    totalAmount: 6000,
    additionalService: 2730,
    discount: 300,
    bookedDates: {
      '0': {
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
        userId: 'TEST_USER_ID',
      },
      '1': {
        dates: {
          from: '25.03.2023',
          to: '29.03.2023',
        },
        userId: 'TEST_USER_ID_2',
      },
    },
    bookingStatus: true,
    bookingId: 'ROOM1',
    capacity: [{ id: 'guest', limit: 5 }],
    isLux: false,
    furniture: [
      { id: 'bedrooms', limit: 1 },
      { id: 'beds', limit: 2 },
      { id: 'bathrooms', limit: 2 },
    ],
    reservedDates: [{ from: '', to: '' }],
    details: {},
    images: [''],
    imagesDetailed: [''],
    rating: 4,
    information: {},
    guests: [
      {
        id: DropdownGuestsIds.ADULTS,
        amount: 2,
        name: 'Взрослые',
      },
      {
        id: DropdownGuestsIds.CHILDREN,
        amount: 1,
        name: 'Дети',
      },
      {
        id: DropdownGuestsIds.BABIES,
        amount: 0,
        name: 'Младенцы',
      },
    ],
    dates: {
      from: '21.03.2023',
      to: '22.03.2023',
    },
  };

  const sliceProfileWithNotLivedRoom: BookingRoomSliceProps = {
    ...sliceProfile,
    ...{
      dates: {
        from: '05.04.2023',
        to: '06.04.2023',
      },
    },
    bookedDates: {
      '0': {
        dates: {
          from: '05.04.2023',
          to: '06.04.2023',
        },
        userId: 'TEST_USER_ID',
      },
    },
    bookingStatus: false,
  };

  const userData = {
    ...authInitialState,
    isAuth: true,
    userName: 'UserName',
    userSurname: 'UserSurname',
    userId: 'TEST_USER_ID',
  };

  const profileDataWithLivedRoom: InitialStateProfileProps = {
    bookedRooms: [sliceProfile],
    status: 'resolved',
    cancelBookingStatus: 'idle',
    rateStatus: 'idle',
    errorMessage: null,
    rateErrorMessage: null,
  };

  const profileDataWithNotLivedRoom: InitialStateProfileProps = {
    bookedRooms: [sliceProfileWithNotLivedRoom],
    status: 'resolved',
    cancelBookingStatus: 'idle',
    rateStatus: 'idle',
    errorMessage: null,
    rateErrorMessage: null,
  };

  it('renders correctly', () => {
    renderWithProviders(<BookingRooms />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...userData,
        },
        profile: {
          ...profileDataWithLivedRoom,
        },
      },
    });

    const priceElements = screen.getAllByText('6 000₽');
    const priceElement = priceElements[0];

    expect(
      screen.queryByRole('button', { name: 'Отмена' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Подробнее' })
    ).toBeInTheDocument();
    expect(priceElement).toBeInTheDocument();
    expect(screen.getByText('отзывов')).toBeInTheDocument();
    expect(screen.getByText('Общая стоимость')).toBeInTheDocument();
  });

  it(`opens modal on "Подробнее" button click 
      and close on "закрыть" and modal-close-btn`, () => {
    renderWithProviders(<BookingRooms />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...userData,
        },
        profile: {
          ...profileDataWithLivedRoom,
        },
      },
    });
    const modal = screen.getByTestId('booking-details-modal');
    const overlay = screen.getByTestId('modal-overlay');
    const closeModal = screen.getByTestId('modal-close-btn');
    const detailsButton = screen.getByRole('button', {
      name: 'Подробнее',
    });
    const secondBtnCloseModal = screen.getByText('закрыть');

    fireEvent.click(detailsButton);

    expect(modal).toHaveClass('modal_active');

    fireEvent.click(closeModal);
    expect(modal).not.toHaveClass('modal_active');

    fireEvent.click(detailsButton);
    expect(modal).toHaveClass('modal_active');

    fireEvent.click(overlay);
    expect(modal).not.toHaveClass('modal_active');

    fireEvent.click(detailsButton);
    expect(modal).toHaveClass('modal_active');

    fireEvent.click(secondBtnCloseModal);
    expect(modal).not.toHaveClass('modal_active');
  });

  it(`rating clickable if booking finished`, () => {
    renderWithProviders(<BookingRooms />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...userData,
        },
        profile: {
          ...profileDataWithLivedRoom,
        },
      },
    });

    const buttonsStar = screen.getAllByText('star_border');
    const btnStar = buttonsStar[0];

    expect(btnStar).not.toHaveClass('rate__icon_inactive');
  });

  it(`rating not clickable if booking not finished`, () => {
    renderWithProviders(<BookingRooms />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...userData,
        },
        profile: {
          ...profileDataWithNotLivedRoom,
        },
      },
    });

    const buttonsStar = screen.getAllByText('star_border');
    const btnStar = buttonsStar[0];

    expect(btnStar).toHaveClass('rate__icon_inactive');
  });

  it('cancels booking on "Отмена" button click', () => {
    renderWithProviders(<BookingRooms />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...userData,
        },
        profile: {
          ...profileDataWithNotLivedRoom,
        },
      },
    });

    expect(
      screen.getByText('Бронирование не подтверждено')
    ).toBeInTheDocument();
    expect(screen.getByText('Подробнее')).toBeInTheDocument();
    expect(screen.getByText('Отмена')).toBeInTheDocument();

    const cancelBookingButton = screen.getByRole('button', { name: 'Отмена' });
    expect(cancelBookingButton).not.toBeDisabled();

    fireEvent.click(cancelBookingButton);
    expect(cancelBookingButton).toBeDisabled();
  });

  test('displays correct date', () => {
    renderWithProviders(<BookingRooms />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...userData,
        },
        profile: {
          ...initialStateProfileDefault,
          bookedRooms: [],
          status: 'resolved',
          cancelBookingStatus: 'idle',
          rateStatus: 'idle',
          errorMessage: null,
          rateErrorMessage: null,
        },
      },
    });

    expect(screen.getByText('У вас нет бронирований')).toBeInTheDocument();
    expect(screen.queryByText('Подробнее')).not.toBeInTheDocument();
  });

  test('get error if network off', () => {
    renderWithProviders(<BookingRooms />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...userData,
        },
        profile: {
          ...initialStateProfileDefault,
          bookedRooms: [],
          status: 'rejected',
          cancelBookingStatus: 'idle',
          rateStatus: 'idle',
          errorMessage: AxiosErrorMessages.NETWORK_ERROR,
          rateErrorMessage: null,
        },
      },
    });

    expect(
      screen.getByText('Произошла ошибка, повторите позже')
    ).toBeInTheDocument();
  });

  test(`cancel button disabled if booking 
        canceling room loading and user get error`, async () => {
    renderWithProviders(
      <>
        <BookingRooms />
        <ToastContainer position="top-right" newestOnTop />;
      </>,
      {
        preloadedState: {
          ...mockedStore,
          auth: {
            ...userData,
          },
          profile: {
            ...initialStateProfileDefault,
            bookedRooms: [sliceProfileWithNotLivedRoom],
            status: 'resolved',
            cancelBookingStatus: 'idle',
            rateStatus: 'idle',
            errorMessage: null,
            rateErrorMessage: null,
          },
        },
      }
    );

    const cancelBookingButton = screen.getByRole('button', { name: 'Отмена' });

    fireEvent.click(cancelBookingButton);
    expect(cancelBookingButton).toBeDisabled();
    expect(
      await screen.findByText(CANCELLATION.IN_PROGRESS)
    ).toBeInTheDocument();
    expect(
      await screen.findByText('У вас нет бронирования этого номера')
    ).toBeInTheDocument();
  });

  test(`if user not have bookings, 
        he get message "У вас нет бронирований"`, async () => {
    renderWithProviders(<BookingRooms />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...userData,
        },
        profile: {
          ...initialStateProfileDefault,
          bookedRooms: [sliceProfileWithNotLivedRoom],
          status: 'rejected',
          cancelBookingStatus: 'idle',
          rateStatus: 'idle',
          errorMessage: BookingErrorMessages.BOOKINGS_NOT_FOUND,
          rateErrorMessage: null,
        },
      },
    });

    expect(
      await screen.findByText('У вас нет бронирований')
    ).toBeInTheDocument();
  });

  test(`if loading bookings in progress, user look Loader`, () => {
    renderWithProviders(<BookingRooms />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...userData,
        },
        profile: {
          ...initialStateProfileDefault,
          bookedRooms: [],
          status: 'loading',
          cancelBookingStatus: 'idle',
          rateStatus: 'idle',
          errorMessage: null,
          rateErrorMessage: null,
        },
      },
    });

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  test(`pagination appears when drawing more than 
        12 reserved rooms; pagination changes cards`, () => {
    const mockBookingRooms = [
      {
        roomNumber: 1001,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1001',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1002,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1002',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1003,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1003',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1004,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1004',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1005,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1005',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1006,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1006',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1007,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1007',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1008,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1008',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1009,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1009',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1010,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1010',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1011,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1011',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1012,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1012',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1013,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1013',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
      {
        roomNumber: 1014,
        price: 2000,
        feedbackCount: 10,
        totalAmount: 6000,
        additionalService: 2730,
        discount: 300,
        bookedDates: {
          '0': {
            dates: {
              from: '21.03.2023',
              to: '22.03.2023',
            },
            userId: 'USER_ID',
          },
          '1': {
            dates: {
              from: '25.03.2023',
              to: '29.03.2023',
            },
            userId: 'USER_ID_2',
          },
        },
        bookingStatus: true,
        bookingId: 'ROOM1014',
        capacity: [{ id: 'guest', limit: 5 }],
        isLux: false,
        furniture: [
          { id: 'bedrooms', limit: 1 },
          { id: 'beds', limit: 2 },
          { id: 'bathrooms', limit: 2 },
        ],
        reservedDates: [{ from: '', to: '' }],
        details: {},
        images: [''],
        imagesDetailed: [''],
        rating: 4,
        information: {},
        guests: [
          {
            id: DropdownGuestsIds.ADULTS,
            amount: 2,
            name: 'Взрослые',
          },
          {
            id: DropdownGuestsIds.CHILDREN,
            amount: 1,
            name: 'Дети',
          },
          {
            id: DropdownGuestsIds.BABIES,
            amount: 0,
            name: 'Младенцы',
          },
        ],
        dates: {
          from: '21.03.2023',
          to: '22.03.2023',
        },
      },
    ];

    renderWithProviders(<BookingRooms />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...userData,
        },
        profile: {
          ...initialStateProfileDefault,
          bookedRooms: mockBookingRooms,
          status: 'resolved',
          cancelBookingStatus: 'idle',
          rateStatus: 'idle',
          errorMessage: null,
          rateErrorMessage: null,
        },
      },
    });

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.queryByText('1014')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('arrow_forward'));

    const elementsWithRoomNumber = screen.getAllByText('1014');
    const roomNumber = elementsWithRoomNumber[0];

    expect(roomNumber).toBeInTheDocument();

    fireEvent.click(screen.getByText('arrow_back'));
    expect(screen.queryByText('1014')).not.toBeInTheDocument();
  });
});
