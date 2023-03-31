import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Toggle } from '../Toggle';

describe('Toggle', () => {
  let handleChange: jest.Mock;

  beforeAll(() => {
    handleChange = jest.fn();
  });

  it('should have been in the document', () => {
    render(<Toggle text="Получать уведомления" onChange={handleChange} />);
    const toggle = screen.getByTestId('toggle');
    expect(toggle).toBeInTheDocument();
  });

  it('should have been checked', () => {
    render(
      <Toggle text="Получать уведомления" isChecked onChange={handleChange} />
    );
    const input = screen.getByTestId('toggle-input');
    expect(input).toHaveAttribute('checked');
  });

  it('should have name attr', () => {
    render(
      <Toggle
        text="Получать уведомления"
        name="subscription"
        onChange={handleChange}
      />
    );
    const input = screen.getByTestId('toggle-input');
    expect(input).toHaveAttribute('name');
  });

  it('when toggle is changed should be called the onChange callback', () => {
    render(<Toggle text="женщина" onChange={handleChange} />);
    const input = screen.getByTestId('toggle-input');

    userEvent.click(input);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

export {};
