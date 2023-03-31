/* eslint-disable max-len */
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DropdownGuestsIds } from '../../../shared/constants/DropdownGuestsIds';
import { FurnitureIds } from '../../../shared/constants/FurnitureIds';
import { mockedStore } from '../../../shared/testUtils/mockedStore';
import { renderWithProviders } from '../../../shared/testUtils/testUtils';
import { initialState as filtersInitialState } from '../../../store/slices/filters/slice';
import { initialState as roomsInitialState } from '../../../store/slices/rooms/slice';
import { Rooms } from '../Rooms';

const mockedRoom = {
  roomNumber: 1,
  furniture: [{ id: '1', limit: 1 }],
  capacity: [{ id: '2', limit: 1 }],
  reservedDates: [{ from: '1', to: '1' }],
  details: {},
  images: ['room1.jpg'],
  imagesDetailed: [''],
  isLux: false,
  price: 999,
  rates: {
    abc: {
      userId: '124124',
      rate: 4,
    },
  },
  feedbackCount: 999,
  information: {
    abc: false,
  },
};

beforeAll(() => {
  Object.defineProperty(window, 'scrollTo', {
    value: () => {},
    writable: true,
  });
});

describe('Rooms', () => {
  it('renders no rooms message when there are no rooms matching the search criteria', () => {
    renderWithProviders(<Rooms />);
    const errorMessage = screen.getByText(
      'нет комнат, соответствующих параметрам поиска'
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it('renders the correct number of RoomCard components', () => {
    const mockedRooms = [...Array(12).keys()].map((item: number) => ({
      ...mockedRoom,
      roomNumber: item,
    }));

    renderWithProviders(<Rooms />, {
      preloadedState: {
        ...mockedStore,
        rooms: { ...roomsInitialState, rooms: mockedRooms },
      },
    });
    const roomCards = screen.getAllByTestId('room-card');

    expect(roomCards).toHaveLength(12);
  });

  it('cards should change when clicking on the next page', () => {
    const mockedRooms = [...Array(20).keys()].map((item: number) => ({
      ...mockedRoom,
      roomNumber: item,
    }));

    renderWithProviders(<Rooms />, {
      preloadedState: {
        ...mockedStore,
        rooms: { ...roomsInitialState, rooms: mockedRooms },
      },
    });

    const roomCards = screen.getAllByTestId('room-card');

    expect(roomCards).toHaveLength(12);

    const pagination = screen.getByTestId('pagination');
    expect(pagination).toBeInTheDocument();

    const nextButton = screen.getByRole('button', { name: /arrow_forward/i });
    userEvent.click(nextButton);

    const pageSecondRoomCards = screen.getAllByTestId('room-card');

    expect(pageSecondRoomCards).toHaveLength(8);
  });

  it('should pass props to the RoomCard component for each room', () => {
    renderWithProviders(<Rooms />, {
      preloadedState: {
        ...mockedStore,
        rooms: { ...roomsInitialState, rooms: [mockedRoom] },
      },
    });

    const roomCard = screen.getByTestId('room-card');
    const roomNumber = within(roomCard).getByText('1');
    const roomPrice = within(roomCard).getByText(/999₽/i);
    const ratingStars = within(roomCard).getAllByText('star');
    const roomImg = within(roomCard).getAllByAltText('комната отеля');

    expect(roomNumber).toBeInTheDocument();
    expect(roomPrice).toBeInTheDocument();
    expect(ratingStars).toHaveLength(4);
    expect(roomImg[0]).toHaveAttribute('src', 'room1.jpg');
  });

  it('pagination should not be shown if there are fewer rooms than ITEMS_PER_PAGE', () => {
    renderWithProviders(<Rooms />, {
      preloadedState: {
        ...mockedStore,
        rooms: { ...roomsInitialState, rooms: [mockedRoom] },
      },
    });

    expect(screen.queryByTestId('pagination')).toBeFalsy();
  });

  it('only cards matching the selected filters should shown', () => {
    const mockedRooms = [
      {
        roomNumber: 999,
        furniture: [{ id: FurnitureIds.BEDROOMS, limit: 999 }],
        capacity: [
          { id: 'guest', limit: 0 },
          { id: 'baby', limit: 0 },
        ],
        reservedDates: [],
        details: {
          canSmoke: false,
          withAssistance: false,
          withBreakfast: false,
        },
        images: ['room999.jpg'],
        imagesDetailed: [''],
        isLux: false,
        price: 100,
        rating: 2,
        feedbackCount: 999,
        information: {
          abc: false,
        },
      },
      {
        roomNumber: 1,
        furniture: [{ id: FurnitureIds.BEDROOMS, limit: 999 }],
        capacity: [
          { id: 'guest', limit: 0 },
          { id: 'baby', limit: 0 },
        ],
        reservedDates: [],
        details: {
          canSmoke: true,
          withAssistance: false,
        },
        images: ['room1.jpg'],
        imagesDetailed: [''],
        isLux: false,
        price: 100,
        rating: 2,
        feedbackCount: 999,
        information: {
          abc: false,
        },
      },
      {
        roomNumber: 941,
        furniture: [{ id: FurnitureIds.BEDROOMS, limit: 999 }],
        capacity: [
          { id: 'guest', limit: 0 },
          { id: 'baby', limit: 0 },
        ],
        reservedDates: [],
        details: {
          canSmoke: true,
          withAssistance: true,
          withBreakfast: false,
        },
        images: ['room1.jpg'],
        imagesDetailed: [''],
        isLux: false,
        price: 100,
        rating: 2,
        feedbackCount: 999,
        information: {
          abc: false,
        },
      },
      {
        roomNumber: 2,
        furniture: [{ id: FurnitureIds.BEDROOMS, limit: 999 }],
        capacity: [
          { id: 'guest', limit: 0 },
          { id: 'baby', limit: 0 },
        ],
        reservedDates: [],
        details: {
          canSmoke: true,
          withAssistance: true,
          withBreakfast: true,
        },
        images: ['room2.jpg'],
        imagesDetailed: [''],
        isLux: false,
        price: 100,
        rating: 2,
        feedbackCount: 999,
        information: {
          abc: false,
        },
      },
      {
        roomNumber: 3,
        furniture: [{ id: FurnitureIds.BEDROOMS, limit: 5 }],
        capacity: [
          { id: 'guest', limit: 0 },
          { id: 'baby', limit: 0 },
        ],
        reservedDates: [],
        details: {
          canSmoke: true,
          withAssistance: true,
          withBreakfast: true,
        },
        images: ['room3.jpg'],
        imagesDetailed: [''],
        isLux: false,
        price: 500,
        rating: 2,
        feedbackCount: 999,
        information: {
          abc: false,
        },
      },
      {
        roomNumber: 4,
        furniture: [{ id: FurnitureIds.BEDROOMS, limit: 999 }],
        capacity: [
          { id: 'guest', limit: 0 },
          { id: 'baby', limit: 0 },
        ],
        reservedDates: [],
        details: {
          canSmoke: true,
          withAssistance: true,
          withBreakfast: true,
        },
        images: ['room4.jpg'],
        imagesDetailed: [''],
        isLux: false,
        price: 500,
        rating: 2,
        feedbackCount: 999,
        information: {
          abc: false,
        },
      },
      {
        roomNumber: 5,
        furniture: [{ id: FurnitureIds.BEDROOMS, limit: 999 }],
        capacity: [
          { id: 'guest', limit: 999 },
          { id: 'baby', limit: 0 },
        ],
        reservedDates: [{ from: '20.02.2023', to: '21.02.2023' }],
        details: {
          canSmoke: true,
          withAssistance: true,
          withBreakfast: true,
        },
        images: ['room5.jpg'],
        imagesDetailed: [''],
        isLux: false,
        price: 500,
        rating: 2,
        feedbackCount: 999,
        information: {
          abc: false,
        },
      },
      {
        roomNumber: 6,
        furniture: [{ id: FurnitureIds.BEDROOMS, limit: 999 }],
        capacity: [
          { id: 'guest', limit: 999 },
          { id: 'baby', limit: 0 },
        ],
        reservedDates: [],
        details: {
          canSmoke: true,
          withAssistance: true,
          withBreakfast: true,
        },
        images: ['room6.jpg'],
        imagesDetailed: [''],
        isLux: false,
        price: 500,
        rating: 2,
        feedbackCount: 999,
        information: {
          abc: false,
        },
      },
    ];

    renderWithProviders(<Rooms />, {
      preloadedState: {
        ...mockedStore,
        rooms: { ...roomsInitialState, rooms: mockedRooms },
        filters: {
          ...filtersInitialState,
          price: { min: 0, max: 999, from: 500, to: 500 },
          rules: [{ name: 'canSmoke', label: 'Можно курить', isChecked: true }],
          availability: [
            {
              name: 'withAssistance',
              label: 'Широкий коридор',
              description: 'Ширина коридоров в номере не менее 91 см.',
              isChecked: true,
            },
          ],
          convenience: [
            { name: 'withBreakfast', label: 'Завтрак', isChecked: true },
          ],
          furniture: [
            {
              id: FurnitureIds.BEDROOMS,
              name: 'спальни',
              amount: 999,
              maxValue: 999,
            },
          ],
          capacity: {
            items: [
              {
                id: DropdownGuestsIds.ADULTS,
                name: 'Взрослые',
                amount: 999,
              },
              { id: DropdownGuestsIds.CHILDREN, name: 'Дети', amount: 0 },
              { id: DropdownGuestsIds.BABIES, name: 'Младенцы', amount: 0 },
            ],
            guestsLimit: 9999,
            babiesLimit: 999,
          },
          selectedDates: [new Date('2023.02.20'), new Date('2023.02.21')],
        },
      },
    });

    const roomsCards = screen.getAllByTestId('room-card');
    expect(roomsCards).toHaveLength(2);
  });
});
