import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ButtonEdit } from '../ButtonEdit';

describe('ButtonEdit', () => {
  it('should render a button element', () => {
    render(<ButtonEdit />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should call the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<ButtonEdit onClick={handleClick} />);

    const button = screen.getByRole('button');
    userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
