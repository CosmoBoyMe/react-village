import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { mockedStore } from '../../../shared/testUtils/mockedStore';
import { renderWithProviders } from '../../../shared/testUtils/testUtils';
import { initialState as authInitialState } from '../../../store/slices/auth/slice';
import { initialState as roomsInitialState } from '../../../store/slices/rooms/slice';
import { App } from '../App';

beforeAll(() => {
  Object.defineProperty(window, 'scrollTo', {
    value: () => {},
    writable: true,
  });
});

describe('Application rendering', () => {
  it(`Renders application with correct routing 
  when user is not authorized`, async () => {
    renderWithProviders(<App />);
    userEvent.click(screen.getByText('подобрать номер'));
    expect(await screen.findByTitle('ожидание загрузки')).toBeInTheDocument();

    userEvent.click(screen.getByText('о нас'));
    expect(
      await screen.findByText('Найдём номера под ваши пожелания')
    ).toBeInTheDocument();

    userEvent.click(screen.getByText('услуги'));
    expect(await screen.findByText('404')).toBeInTheDocument();

    userEvent.click(screen.getByText(/войти/));
    expect(await screen.findByText('Войти')).toBeInTheDocument();
    expect(
      await screen.findByText('Нет аккаунта на Toxin?')
    ).toBeInTheDocument();
    expect(await screen.findByText('создать')).toBeInTheDocument();

    userEvent.click(screen.getByText('зарегистрироваться'));
    expect(await screen.findByText('Регистрация аккаунта')).toBeInTheDocument();
  });

  it(`Renders application with correct routing
  when user is authorized`, async () => {
    const room = {
      roomNumber: 111,
      furniture: [
        { id: 'bedrooms', limit: 1 },
        { id: 'beds', limit: 2 },
        { id: 'bathrooms', limit: 2 },
      ],
      capacity: [{ id: 'guest', limit: 2 }],
      reservedDates: [{ from: '', to: '' }],
      details: {},
      images: [''],
      imagesDetailed: [''],
      isLux: false,
      price: 5500,
      rating: 4,
      feedbackCount: 2,
      information: {},
    };
    const view = renderWithProviders(<App />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...authInitialState,
          isAuth: true,
          userName: 'TestName',
          userSurname: 'TestSurname',
        },
        rooms: {
          ...roomsInitialState,
          rooms: [room],
          errorMessage: null,
          status: 'resolved',
        },
      },
    });

    userEvent.click(screen.getByText('TestName TestSurname'));
    expect(
      await screen.findByText('Забронированные номера')
    ).toBeInTheDocument();

    userEvent.click(screen.getByText('о нас'));
    userEvent.click(screen.getByText('подобрать номер'));
    expect(
      await screen.findByText('Номера, которые мы для вас подобрали')
    ).toBeInTheDocument();

    userEvent.click(await screen.findByText('111'));
    expect(
      screen.queryByText('Номера, которые мы для вас подобрали')
    ).not.toBeInTheDocument();
    expect(await screen.findByTitle('ожидание загрузки')).toBeInTheDocument();
    expect(view).toMatchSnapshot();
  });
});
