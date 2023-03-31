import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { DropdownGuestsIds } from '../../../shared/constants/DropdownGuestsIds';
import { DropdownGuestsItemData } from '../../../types/DropdownItemData';
import { DropdownGuests } from '../DropdownGuests';

describe('dropdownGuests component rendering', () => {
  it('dropdownGuests layout matches the snapshot', () => {
    const guests = [
      { id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 0 },
      { id: DropdownGuestsIds.CHILDREN, name: 'дети', amount: 0 },
      { id: DropdownGuestsIds.BABIES, name: 'младенцы', amount: 0 },
    ];

    const view = render(<DropdownGuests items={guests} />);

    expect(view).toMatchSnapshot();
  });

  it(`Should return item value when active Plus button clicked - 
  case 1`, () => {
    const guests = [
      { id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 0 },
      { id: DropdownGuestsIds.CHILDREN, name: 'дети', amount: 0 },
      { id: DropdownGuestsIds.BABIES, name: 'младенцы', amount: 0 },
    ];

    const onChange = jest.fn(
      (dropdownItems: DropdownGuestsItemData[]) => dropdownItems
    );
    render(
      <DropdownGuests
        items={guests}
        onChange={onChange}
        guestsLimit={2}
        babiesLimit={1}
      />
    );
    const buttonsPlus = screen.getAllByText('+');
    userEvent.click(buttonsPlus[1]);
    expect(onChange).lastReturnedWith([
      { id: 'adults', name: 'взрослые', amount: 0 },
      { id: 'children', name: 'дети', amount: 1 },
      { id: 'babies', name: 'младенцы', amount: 0 },
    ]);

    userEvent.click(buttonsPlus[2]);

    expect(onChange).lastReturnedWith([
      { id: 'adults', name: 'взрослые', amount: 0 },
      { id: 'children', name: 'дети', amount: 1 },
      { id: 'babies', name: 'младенцы', amount: 0 },
    ]);
  });

  it(`Should return item value when active Plus button clicked - 
  case 2`, () => {
    const guests = [
      { id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 0 },
      { id: DropdownGuestsIds.CHILDREN, name: 'дети', amount: 1 },
      { id: DropdownGuestsIds.BABIES, name: 'младенцы', amount: 0 },
    ];

    const onChange = jest.fn(
      (dropdownItems: DropdownGuestsItemData[]) => dropdownItems
    );
    render(
      <DropdownGuests
        items={guests}
        onChange={onChange}
        guestsLimit={2}
        babiesLimit={1}
      />
    );
    const buttonsPlus = screen.getAllByText('+');

    userEvent.click(buttonsPlus[0]);
    expect(onChange).lastReturnedWith([
      { id: 'adults', name: 'взрослые', amount: 1 },
      { id: 'children', name: 'дети', amount: 1 },
      { id: 'babies', name: 'младенцы', amount: 0 },
    ]);
  });

  it(`Should return item value when active Plus button clicked - 
  case 3`, () => {
    const guests = [
      { id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 1 },
      { id: DropdownGuestsIds.CHILDREN, name: 'дети', amount: 1 },
      { id: DropdownGuestsIds.BABIES, name: 'младенцы', amount: 0 },
    ];

    const onChange = jest.fn(
      (dropdownItems: DropdownGuestsItemData[]) => dropdownItems
    );
    render(
      <DropdownGuests
        items={guests}
        onChange={onChange}
        guestsLimit={2}
        babiesLimit={1}
      />
    );
    const buttonsPlus = screen.getAllByText('+');

    userEvent.click(buttonsPlus[2]);
    expect(onChange).lastReturnedWith([
      { id: 'adults', name: 'взрослые', amount: 1 },
      { id: 'children', name: 'дети', amount: 1 },
      { id: 'babies', name: 'младенцы', amount: 1 },
    ]);
  });

  it(`Should return item value when active Minus button clicked - 
  case 1`, () => {
    const guests = [
      { id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 1 },
      { id: DropdownGuestsIds.CHILDREN, name: 'дети', amount: 1 },
      { id: DropdownGuestsIds.BABIES, name: 'младенцы', amount: 1 },
    ];

    const onChange = jest.fn(
      (dropdownItems: DropdownGuestsItemData[]) => dropdownItems
    );
    render(
      <DropdownGuests
        items={guests}
        onChange={onChange}
        guestsLimit={2}
        babiesLimit={1}
      />
    );
    const buttonsMinus = screen.getAllByText('-');

    userEvent.click(buttonsMinus[0]);
    expect(onChange).lastReturnedWith([
      { id: 'adults', name: 'взрослые', amount: 0 },
      { id: 'children', name: 'дети', amount: 1 },
      { id: 'babies', name: 'младенцы', amount: 0 },
    ]);
  });

  it(`Should return item value when active Minus button clicked - 
  case 2`, () => {
    const guests = [
      { id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 0 },
      { id: DropdownGuestsIds.CHILDREN, name: 'дети', amount: 1 },
      { id: DropdownGuestsIds.BABIES, name: 'младенцы', amount: 0 },
    ];

    const onChange = jest.fn(
      (dropdownItems: DropdownGuestsItemData[]) => dropdownItems
    );
    render(
      <DropdownGuests
        items={guests}
        onChange={onChange}
        guestsLimit={2}
        babiesLimit={1}
      />
    );
    const buttonsMinus = screen.getAllByText('-');
    userEvent.click(buttonsMinus[1]);

    expect(onChange).lastReturnedWith([
      { id: 'adults', name: 'взрослые', amount: 0 },
      { id: 'children', name: 'дети', amount: 0 },
      { id: 'babies', name: 'младенцы', amount: 0 },
    ]);
  });

  it(`Should not return item value when inactive Plus button clicked -
  case 1`, () => {
    const guests = [
      { id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 0 },
      { id: DropdownGuestsIds.CHILDREN, name: 'дети', amount: 1 },
      { id: DropdownGuestsIds.BABIES, name: 'младенцы', amount: 0 },
    ];

    const onChange = jest.fn(
      (dropdownItems: DropdownGuestsItemData[]) => dropdownItems
    );
    render(
      <DropdownGuests
        items={guests}
        onChange={onChange}
        guestsLimit={2}
        babiesLimit={1}
      />
    );
    const buttonsPlus = screen.getAllByText('+');
    userEvent.click(buttonsPlus[2]);
    expect(onChange).not.toBeCalled();
  });

  it(`Should not return item value when inactive Plus button clicked - 
  case 2`, () => {
    const guests = [
      { id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 1 },
      { id: DropdownGuestsIds.CHILDREN, name: 'дети', amount: 1 },
      { id: DropdownGuestsIds.BABIES, name: 'младенцы', amount: 1 },
    ];

    const onChange = jest.fn(
      (dropdownItems: DropdownGuestsItemData[]) => dropdownItems
    );
    render(
      <DropdownGuests
        items={guests}
        onChange={onChange}
        guestsLimit={2}
        babiesLimit={1}
      />
    );
    const buttonsPlus = screen.getAllByText('+');

    userEvent.click(buttonsPlus[2]);
    expect(onChange).not.toBeCalled();
  });

  it(`Should not return item value when inactive Plus or Minus button clicked - 
  case 3`, () => {
    const guests = [
      { id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 0 },
      { id: DropdownGuestsIds.CHILDREN, name: 'дети', amount: 0 },
      { id: DropdownGuestsIds.BABIES, name: 'младенцы', amount: 0 },
    ];

    const onChange = jest.fn(
      (dropdownItems: DropdownGuestsItemData[]) => dropdownItems
    );
    render(
      <DropdownGuests
        items={guests}
        onChange={onChange}
        guestsLimit={2}
        babiesLimit={1}
      />
    );

    const buttonsPlus = screen.getAllByText('+');
    const buttonsMinus = screen.getAllByText('-');

    userEvent.click(buttonsMinus[0]);

    expect(onChange).not.toBeCalled();

    userEvent.click(buttonsMinus[1]);

    expect(onChange).not.toBeCalled();

    userEvent.click(buttonsMinus[2]);

    expect(onChange).not.toBeCalled();

    userEvent.click(buttonsPlus[2]);

    expect(onChange).not.toBeCalled();
  });

  it(`Return zero items values when Clear button clicked`, () => {
    const guests = [
      { id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 1 },
      { id: DropdownGuestsIds.CHILDREN, name: 'дети', amount: 1 },
      { id: DropdownGuestsIds.BABIES, name: 'младенцы', amount: 1 },
    ];

    const onChange = jest.fn(
      (dropdownItems: DropdownGuestsItemData[]) => dropdownItems
    );
    render(<DropdownGuests items={guests} onChange={onChange} />);

    const clearButton = screen.getByText('Очистить');

    expect(clearButton).toBeInTheDocument();

    userEvent.click(clearButton);

    expect(onChange).lastReturnedWith([
      { id: 'adults', name: 'взрослые', amount: 0 },
      { id: 'children', name: 'дети', amount: 0 },
      { id: 'babies', name: 'младенцы', amount: 0 },
    ]);
  });

  it(`Open and close dropdown`, () => {
    const guests = [
      { id: DropdownGuestsIds.ADULTS, name: 'взрослые', amount: 1 },
      { id: DropdownGuestsIds.CHILDREN, name: 'дети', amount: 1 },
      { id: DropdownGuestsIds.BABIES, name: 'младенцы', amount: 1 },
    ];

    render(<DropdownGuests items={guests} />);

    const dropdown = screen.getByTestId('guest-dropdown');

    expect(dropdown).not.toHaveClass('dropdown_opened');
    // act(() => {
    userEvent.click(screen.getByRole('textbox'));
    // });
    expect(dropdown).toHaveClass('dropdown_opened');
    // act(() => {
    userEvent.click(screen.getByText('Применить'));
    // });
    expect(dropdown).not.toHaveClass('dropdown_opened');
  });
});
