import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { mockedStore } from '../../../shared/testUtils/mockedStore';
import { renderWithProviders } from '../../../shared/testUtils/testUtils';
import { initialState as authInitialState } from '../../../store/slices/auth/slice';
import { Header } from '../Header';

describe('Header component rendering', () => {
  it('Header layout matches the snapshot', () => {
    const view = renderWithProviders(<Header />);
    expect(view).toMatchSnapshot();
  });

  it('mobile mode', () => {
    renderWithProviders(<Header />);
    expect(document.body).not.toHaveStyle('overflow: hidden');
    const burger = screen.getByTitle('главное меню');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 30000,
    });
    fireEvent(window, new Event('resize'));
    expect(document.body).not.toHaveStyle('overflow: hidden');
    act(() => {
      userEvent.click(burger);
    });
    expect(document.body).not.toHaveStyle('overflow: hidden');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    fireEvent(window, new Event('resize'));
    expect(document.body).toHaveStyle('overflow: hidden');

    act(() => {
      userEvent.click(burger);
    });
    expect(document.body).not.toHaveStyle('overflow: hidden');
    act(() => {
      userEvent.click(burger);
    });
    expect(document.body).toHaveStyle('overflow: hidden');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 450,
    });
    fireEvent(window, new Event('resize'));
    expect(document.body).toHaveStyle('overflow: hidden');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 770,
    });
    fireEvent(window, new Event('resize'));
    expect(document.body).not.toHaveStyle('overflow: hidden');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    fireEvent(window, new Event('resize'));
    expect(document.body).toHaveStyle('overflow: hidden');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1980,
    });
    fireEvent(window, new Event('resize'));
    expect(document.body).not.toHaveStyle('overflow: hidden');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    fireEvent(window, new Event('resize'));
    act(() => {
      userEvent.click(burger);
    });
    expect(document.body).toHaveStyle('overflow: hidden');
    userEvent.click(screen.getByRole('navigation'));
    expect(document.body).toHaveStyle('overflow: hidden');

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    fireEvent(window, new Event('resize'));
    userEvent.click(screen.getByRole('navigation'));
    expect(document.body).not.toHaveStyle('overflow: hidden');
  });

  it(`Renders links to SignIn and Registration pages 
  if user is not authorized`, () => {
    renderWithProviders(<Header />);

    expect(screen.getByText('войти')).toBeInTheDocument();
    expect(screen.getByText('зарегистрироваться')).toBeInTheDocument();
    expect(screen.queryByText('TestName TestSurname')).not.toBeInTheDocument();
  });

  it('Renders link to Profile page if user is authorized', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        ...mockedStore,
        auth: {
          ...authInitialState,
          isAuth: true,
          userName: 'TestName',
          userSurname: 'TestSurname',
        },
      },
    });

    expect(screen.queryByText('войти')).not.toBeInTheDocument();
    expect(screen.queryByText('зарегистрироваться')).not.toBeInTheDocument();
    expect(screen.getByText('TestName TestSurname')).toBeInTheDocument();
  });
});
