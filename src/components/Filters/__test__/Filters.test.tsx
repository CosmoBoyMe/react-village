import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DropdownGuestsIds } from '../../../shared/constants/DropdownGuestsIds';
import { FurnitureIds } from '../../../shared/constants/FurnitureIds';
import { mockedStore } from '../../../shared/testUtils/mockedStore';
import { renderWithProviders } from '../../../shared/testUtils/testUtils';
import { initialState as filtersInitialState } from '../../../store/slices/filters/slice';
import { Filters } from '../Filters';

describe('filters', () => {
  it('clicking close button hides the filters content', () => {
    renderWithProviders(<Filters />);
    const button = screen.getByRole('button', { name: 'открыть фильтры' });
    userEvent.click(button);
    const closeButton = screen.getByRole('button', { name: 'close' });
    userEvent.click(closeButton);
    const filtersContent = screen.getByTestId('filters-content');
    expect(filtersContent).not.toHaveClass('filters__content_visible');
  });

  test("clicking 'открыть фильтры' button shows the filters content", () => {
    renderWithProviders(<Filters />);
    const button = screen.getByRole('button', { name: 'открыть фильтры' });
    userEvent.click(button);
    const filtersContent = screen.getByTestId('filters-content');
    expect(filtersContent).toHaveClass('filters__content_visible');
  });

  test('should toggle rule checkbox when clicked', () => {
    renderWithProviders(<Filters />, {
      preloadedState: {
        ...mockedStore,
        filters: {
          ...filtersInitialState,
          rules: [
            { name: 'canSmoke', label: 'Можно курить', isChecked: true },
            { name: 'withPets', label: 'Можно с питомцами', isChecked: false },
            {
              name: 'withGuests',
              label: 'Можно пригласить гостей (до 10 человек)',
              isChecked: true,
            },
          ],
        },
      },
    });
    const canSmokeRule = screen.getByLabelText('Можно курить');
    const withPetsRule = screen.getByLabelText('Можно с питомцами');
    expect(canSmokeRule).toBeChecked();
    expect(withPetsRule).not.toBeChecked();

    userEvent.click(canSmokeRule);
    expect(canSmokeRule).not.toBeChecked();
  });

  test('should toggle availability checkbox when clicked', () => {
    renderWithProviders(<Filters />, {
      preloadedState: {
        ...mockedStore,
        filters: {
          ...filtersInitialState,
          availability: [
            {
              name: 'withAssistance',
              label: 'Широкий коридор',
              description: 'Ширина коридоров в номере не менее 91 см',
              isChecked: true,
            },
            {
              name: 'withWideHallway',
              label: 'Помощник для инвалидов',
              description:
                'На 1 этаже вас встретит специалист  и проводит до номера',
              isChecked: false,
            },
          ],
        },
      },
    });
    const withAssistanceInput = screen.getByTestId(
      'check-box-input withAssistance'
    );
    const withWideHallwayInput = screen.getByTestId(
      'check-box-input withWideHallway'
    );

    expect(withAssistanceInput).toBeChecked();
    expect(withWideHallwayInput).not.toBeChecked();

    userEvent.click(withAssistanceInput);
    expect(withAssistanceInput).not.toBeChecked();
  });

  test('should toggle convenience checkbox when clicked', () => {
    renderWithProviders(<Filters />, {
      preloadedState: {
        ...mockedStore,
        filters: {
          ...filtersInitialState,
          convenience: [
            { name: 'withBreakfast', label: 'Завтрак', isChecked: true },
            { name: 'withDesk', label: 'Письменный стол', isChecked: false },
          ],
        },
      },
    });
    const withBreakfastInput = screen.getByTestId(
      'check-box-input withBreakfast'
    );
    const withDeskInput = screen.getByTestId('check-box-input withDesk');

    expect(withBreakfastInput).toBeChecked();
    expect(withDeskInput).not.toBeChecked();

    userEvent.click(withBreakfastInput);
    expect(withBreakfastInput).not.toBeChecked();
  });

  test('should update guestDropdown when clicked on buttons', () => {
    renderWithProviders(<Filters />, {
      preloadedState: {
        ...mockedStore,
        filters: {
          ...filtersInitialState,
          capacity: {
            items: [
              { id: DropdownGuestsIds.ADULTS, name: 'Взрослые', amount: 0 },
              { id: DropdownGuestsIds.CHILDREN, name: 'Дети', amount: 0 },
              { id: DropdownGuestsIds.BABIES, name: 'Младенцы', amount: 0 },
            ],
            guestsLimit: 5,
            babiesLimit: 5,
          },
        },
      },
    });

    const guestDropdown = screen.getByTestId('guest-dropdown');
    const plusButtons = within(guestDropdown).getAllByRole('button', {
      name: '+',
    });
    const minusButtons = within(guestDropdown).getAllByRole('button', {
      name: '-',
    });
    const amountContainers = within(guestDropdown).getAllByTestId(
      'dropdown-guest-amount'
    );

    expect(amountContainers[0]).toHaveTextContent('0');
    userEvent.click(plusButtons[0]);
    expect(amountContainers[0]).toHaveTextContent('1');
    userEvent.click(minusButtons[0]);
    expect(amountContainers[0]).toHaveTextContent('0');
  });

  test('should update furniture dropdown when clicked on buttons', () => {
    renderWithProviders(<Filters />, {
      preloadedState: {
        ...mockedStore,
        filters: {
          ...filtersInitialState,
          furniture: [
            {
              id: FurnitureIds.BEDROOMS,
              name: 'спальни',
              amount: 0,
              maxValue: 5,
            },
            { id: FurnitureIds.BEDS, name: 'кровати', amount: 0, maxValue: 5 },
            {
              id: FurnitureIds.BATHROOMS,
              name: 'ванные комнаты',
              amount: 0,
              maxValue: 5,
            },
          ],
        },
      },
    });

    const dropdown = screen.getByTestId('dropdown');
    const plusButtons = within(dropdown).getAllByRole('button', {
      name: '+',
    });
    const minusButtons = within(dropdown).getAllByRole('button', {
      name: '-',
    });
    const amountContainers = within(dropdown).getAllByTestId(
      'dropdown-item-amount'
    );

    expect(amountContainers[0]).toHaveTextContent('0');
    fireEvent.pointerDown(plusButtons[0]);
    expect(amountContainers[0]).toHaveTextContent('1');
    fireEvent.pointerDown(minusButtons[0]);
    expect(amountContainers[0]).toHaveTextContent('0');
  });

  test('range slider should be in the document when price is not null', () => {
    renderWithProviders(<Filters />, {
      preloadedState: {
        ...mockedStore,
        filters: {
          ...filtersInitialState,
          price: { min: 0, max: 12000, from: 0, to: 12000 },
        },
      },
    });

    const rangeSlider = screen.getByTestId('range-slider');
    expect(rangeSlider).toBeInTheDocument();
  });
});
