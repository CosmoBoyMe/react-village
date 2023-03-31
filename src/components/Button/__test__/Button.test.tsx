import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '../Button';

describe('Button', () => {
  it('renders a button with text', () => {
    render(<Button text="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls the onClick function when clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Click me" onClick={handleClick} />);
    userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('calls the onPointerDown function when pointer is down on button', () => {
    const handlePointerDown = jest.fn();
    render(<Button text="Click me" onPointerDown={handlePointerDown} />);
    fireEvent.pointerDown(screen.getByText('Click me'));
    expect(handlePointerDown).toHaveBeenCalledTimes(1);
  });

  it(`calls the onKeyDown function when a
   key is pressed while the button is focused`, () => {
    const handleKeyDown = jest.fn();
    render(<Button text="Click me" onKeyDown={handleKeyDown} />);
    fireEvent.keyDown(screen.getByText('Click me'), {
      key: 'Enter',
      code: 'Enter',
    });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('renders a button with a border', () => {
    render(<Button text="Click me" withBorder />);
    expect(screen.getByText('Click me')).toHaveClass(
      'button__special_bordered'
    );
  });

  it('renders a button without a border', () => {
    render(<Button text="Click me" />);
    expect(screen.getByText('Click me')).not.toHaveClass(
      'button__special_bordered'
    );
  });

  it('renders a button with a background', () => {
    render(<Button text="Click me" withBackground />);
    expect(screen.getByText('Click me')).toHaveClass(
      'button__special_background'
    );
  });

  it('renders a button without a background', () => {
    render(<Button text="Click me" />);
    expect(screen.getByText('Click me')).not.toHaveClass(
      'button__special_background'
    );
  });
});
