/* eslint-disable max-len */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../../shared/testUtils/testUtils';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  test('renders correctly', () => {
    render(
      <Pagination currentPageNumber={1} itemsPerPage={10} totalRooms={23} />
    );
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toBeInTheDocument();
  });

  it('displays the correct number of pages', () => {
    render(
      <Pagination itemsPerPage={10} totalRooms={23} currentPageNumber={2} />
    );
    const pageButtons = screen.getAllByRole('button');
    const expectedPageCount = Math.ceil(23 / 10);
    expect(pageButtons.length).toBe(expectedPageCount + 2);
  });

  it('displays the correct active page', () => {
    render(
      <Pagination itemsPerPage={10} totalRooms={23} currentPageNumber={2} />
    );
    const activePage = screen.getByText(String(2));
    expect(activePage).toHaveClass('pagination__button_active');
  });

  it(`calls onClickPage with the correct 
  page number when a page button is clicked`, () => {
    const mockOnClickPage = jest.fn();
    renderWithProviders(
      <Pagination
        itemsPerPage={10}
        totalRooms={23}
        currentPageNumber={2}
        onClickPage={mockOnClickPage}
      />
    );
    const pageButtons = screen.getAllByRole('button');
    userEvent.click(pageButtons[1]);
    expect(mockOnClickPage).toHaveBeenCalledWith(1);
  });

  it('disables the previous button on the first page', () => {
    render(
      <Pagination itemsPerPage={10} totalRooms={23} currentPageNumber={1} />
    );

    const prevButton = screen.getByRole('button', { name: /arrow_back/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    render(
      <Pagination itemsPerPage={10} totalRooms={23} currentPageNumber={3} />
    );
    const nextButton = screen.getByRole('button', { name: /arrow_forward/i });
    expect(nextButton).toBeDisabled();
  });

  it('displays ellipsis when there are too many pages', () => {
    render(
      <Pagination itemsPerPage={1} totalRooms={23} currentPageNumber={3} />
    );
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('when click on the prev button onClick should return prevButton number', () => {
    const mockClick = jest.fn();
    render(
      <Pagination
        itemsPerPage={1}
        totalRooms={10}
        currentPageNumber={2}
        onClickPage={mockClick}
      />
    );
    const prevButton = screen.getByRole('button', { name: 'arrow_back' });
    userEvent.click(prevButton);
    expect(mockClick).toHaveBeenCalledWith(1);
  });
});
