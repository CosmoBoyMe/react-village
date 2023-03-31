/* eslint-disable max-len */
import { DropdownGuestsIds } from '../../../shared/constants/DropdownGuestsIds';
import { RoomData } from '../../../types/RoomData';
import {
  hasRoomAllSelectedRules,
  hasRoomSelectedDates,
  isRoomMatchCapacityLimit,
} from '../helpers';

describe('Rooms helpers', () => {
  test(`hasRoomAllSelectedRules should return true if all selected
  rules are present in the room details and have a truthy value`, () => {
    const mockedRoom: RoomData = {
      roomNumber: 1,
      furniture: [{ id: '1', limit: 1 }],
      capacity: [{ id: '2', limit: 1 }],
      reservedDates: [{ from: '1', to: '1' }],
      details: {
        canSmoke: true,
      },
      images: ['room1.jpg'],
      imagesDetailed: [''],
      isLux: false,
      price: 999,
      feedbackCount: 999,
      information: {
        abc: false,
      },
    };
    const mockedRules = [
      {
        label: 'можно курить',
        name: 'canSmoke',
        isChecked: true,
      },
    ];
    const result = hasRoomAllSelectedRules(mockedRoom, mockedRules);
    expect(result).toBeTruthy();
  });

  test(`hasRoomAllSelectedRules should return false if any selected rule
  is not present in the room details or does not have a truthy value`, () => {
    const mockedRoom: RoomData = {
      roomNumber: 1,
      furniture: [{ id: '1', limit: 1 }],
      capacity: [{ id: '2', limit: 1 }],
      reservedDates: [{ from: '1', to: '1' }],
      details: {
        canSmoke: true,
        withPets: false,
      },
      images: ['room1.jpg'],
      imagesDetailed: [''],
      isLux: false,
      price: 999,
      feedbackCount: 999,
      information: {
        abc: false,
      },
    };
    const mockedRules = [
      {
        label: 'можно курить',
        name: 'canSmoke',
        isChecked: true,
      },
      { label: 'Можно с питомцами', name: 'withPets', isChecked: true },
    ];
    const result = hasRoomAllSelectedRules(mockedRoom, mockedRules);
    expect(result).toBe(false);
  });

  test('hasRoomSelectedDates returns true when selected dates are available', () => {
    const reservedDates = [
      { from: '15.03.2022', to: '20.03.2022' },
      { from: '25.03.2022', to: '30.03.2022' },
    ];

    const mockedRoom: RoomData = {
      roomNumber: 1,
      furniture: [{ id: '1', limit: 1 }],
      capacity: [{ id: '2', limit: 1 }],
      reservedDates,
      details: {
        canSmoke: true,
      },
      images: ['room1.jpg'],
      imagesDetailed: [''],
      isLux: false,
      price: 999,
      feedbackCount: 999,
      information: {
        abc: false,
      },
    };

    const selectedDates = [new Date('2022-03-21'), new Date('2022-03-24')];
    const result = hasRoomSelectedDates(mockedRoom, selectedDates);
    expect(result).toBe(true);
  });

  test('hasRoomSelectedDates returns false when selected dates overlap with reserved dates', () => {
    const reservedDates = [
      { from: '15.03.2022', to: '20.03.2022' },
      { from: '25.03.2022', to: '30.03.2022' },
    ];

    const mockedRoom: RoomData = {
      roomNumber: 1,
      furniture: [{ id: '1', limit: 1 }],
      capacity: [{ id: '2', limit: 1 }],
      reservedDates,
      details: {
        canSmoke: true,
      },
      images: ['room1.jpg'],
      imagesDetailed: [''],
      isLux: false,
      price: 999,
      feedbackCount: 999,
      information: {
        abc: false,
      },
    };

    const selectedDates = [new Date('2022-03-18'), new Date('2022-03-26')];
    const result = hasRoomSelectedDates(mockedRoom, selectedDates);
    expect(result).toBe(false);
  });

  test('hasRoomSelectedDates returns false when selected dates exactly match a reserved date range', () => {
    const reservedDates = [
      { from: '15.03.2022', to: '20.03.2022' },
      { from: '25.03.2022', to: '30.03.2022' },
    ];

    const mockedRoom: RoomData = {
      roomNumber: 1,
      furniture: [{ id: '1', limit: 1 }],
      capacity: [{ id: '2', limit: 1 }],
      reservedDates,
      details: {
        canSmoke: true,
      },
      images: ['room1.jpg'],
      imagesDetailed: [''],
      isLux: false,
      price: 999,
      feedbackCount: 999,
      information: {
        abc: false,
      },
    };

    const selectedDates = [new Date('2022-03-15'), new Date('2022-03-20')];
    const result = hasRoomSelectedDates(mockedRoom, selectedDates);
    expect(result).toBe(false);
  });

  test('hasRoomSelectedDates returns true when room has no reserved dates', () => {
    const mockedRoom: RoomData = {
      roomNumber: 1,
      furniture: [{ id: '1', limit: 1 }],
      capacity: [{ id: '2', limit: 1 }],
      reservedDates: [],
      details: {
        canSmoke: true,
      },
      images: ['room1.jpg'],
      imagesDetailed: [''],
      isLux: false,
      price: 999,
      feedbackCount: 999,
      information: {
        abc: false,
      },
    };
    const selectedDates = [new Date('2022-04-01'), new Date('2022-04-03')];
    const result = hasRoomSelectedDates(mockedRoom, selectedDates);
    expect(result).toBe(true);
  });

  test('hasRoomSelectedDates should return false if selected dates contain a reserved date', () => {
    const reservedDates = [
      { from: '05.04.2023', to: '08.04.2023' },
      { from: '10.04.2023', to: '15.04.2023' },
    ];

    const mockedRoom: RoomData = {
      roomNumber: 1,
      furniture: [{ id: '1', limit: 1 }],
      capacity: [{ id: '2', limit: 1 }],
      reservedDates,
      details: {
        canSmoke: true,
      },
      images: ['room1.jpg'],
      imagesDetailed: [''],
      isLux: false,
      price: 999,
      feedbackCount: 999,
      information: {
        abc: false,
      },
    };
    const selectedDates = [new Date('2023-04-01'), new Date('2023-04-20')];
    const result = hasRoomSelectedDates(mockedRoom, selectedDates);
    expect(result).toBe(false);
  });

  it('isRoomMatchCapacityLimit should return true if room capacity matches selected guests', () => {
    const roomData = {
      capacity: [
        { id: 'guest', limit: 5 },
        { id: 'baby', limit: 2 },
      ],
      roomNumber: 1,
      furniture: [{ id: '1', limit: 1 }],
      reservedDates: [],
      details: {
        canSmoke: true,
      },
      images: ['room1.jpg'],
      imagesDetailed: [''],
      isLux: false,
      price: 999,
      feedbackCount: 999,
      information: {
        abc: false,
      },
    };

    const capacity = {
      items: [
        { id: DropdownGuestsIds.ADULTS, name: '', amount: 2 },
        { id: DropdownGuestsIds.CHILDREN, name: '', amount: 1 },
        { id: DropdownGuestsIds.BABIES, name: '', amount: 1 },
      ],
    };
    const result = isRoomMatchCapacityLimit(roomData, capacity);
    expect(result).toBe(true);
  });

  it('isRoomMatchCapacityLimit should return false if baby amount exceeds the room baby limit', () => {
    const room = {
      capacity: [
        { id: 'guest', limit: 5 },
        { id: 'baby', limit: 2 },
      ],
      roomNumber: 1,
      furniture: [{ id: '1', limit: 1 }],
      reservedDates: [],
      details: {
        canSmoke: true,
      },
      images: ['room1.jpg'],
      imagesDetailed: [''],
      isLux: false,
      price: 999,
      feedbackCount: 999,
      information: {
        abc: false,
      },
    };

    const capacity = {
      items: [
        { id: DropdownGuestsIds.ADULTS, name: '', amount: 2 },
        { id: DropdownGuestsIds.CHILDREN, name: '', amount: 1 },
        { id: DropdownGuestsIds.BABIES, name: '', amount: 3 },
      ],
    };
    const result = isRoomMatchCapacityLimit(room, capacity);
    expect(result).toBe(false);
  });

  it('isRoomMatchCapacityLimit should return true if room does not have baby limit', () => {
    const roomWithoutBabies = {
      capacity: [{ id: 'guest', limit: 5 }],
      roomNumber: 1,
      furniture: [{ id: '1', limit: 1 }],
      reservedDates: [],
      details: {
        canSmoke: true,
      },
      images: ['room1.jpg'],
      imagesDetailed: [''],
      isLux: false,
      price: 999,
      feedbackCount: 999,
      information: {
        abc: false,
      },
    };
    const capacity = {
      items: [
        { id: DropdownGuestsIds.ADULTS, name: '', amount: 2 },
        { id: DropdownGuestsIds.CHILDREN, name: '', amount: 1 },
        { id: DropdownGuestsIds.BABIES, name: '', amount: 3 },
      ],
    };
    const result = isRoomMatchCapacityLimit(roomWithoutBabies, capacity);
    expect(result).toBe(true);
  });
});
