import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ButtonLink } from '../ButtonLink';

describe('ButtonLink', () => {
  it('should render the component with the default props', () => {
    render(<ButtonLink text="Click me" />, { wrapper: BrowserRouter });
    expect(screen).toMatchSnapshot();
  });

  it('sets the href prop as the "to" prop of the Link component', () => {
    render(<ButtonLink text="Click me" href="/example" />, {
      wrapper: BrowserRouter,
    });
    const link = screen.getByRole('link', { name: 'Click me' });
    expect(link).toHaveAttribute('href', '/example');
  });

  it('applies the "button-link" class to the Link component', () => {
    render(<ButtonLink text="Click me" />, { wrapper: BrowserRouter });
    const link = screen.getByRole('link', { name: 'Click me' });
    expect(link).toHaveClass('button-link');
  });

  it(`applies the "button-link_bordered" class to the 
  Link component when withBorder prop is true`, () => {
    render(<ButtonLink text="Click me" withBorder />, {
      wrapper: BrowserRouter,
    });
    const link = screen.getByRole('link', { name: 'Click me' });
    expect(link).toHaveClass('button-link_bordered');
  });

  it(`applies the "button-link_size_small" class to the 
  Link component when isSmall prop is true`, () => {
    render(<ButtonLink text="Click me" isSmall />, { wrapper: BrowserRouter });
    const link = screen.getByRole('link', { name: 'Click me' });
    expect(link).toHaveClass('button-link_size_small');
  });

  it('calls the onClick function when the Link component is clicked', () => {
    const handleClick = jest.fn();
    render(<ButtonLink text="Click me" onClick={handleClick} />, {
      wrapper: BrowserRouter,
    });
    const link = screen.getByRole('link', { name: 'Click me' });
    userEvent.click(link);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
