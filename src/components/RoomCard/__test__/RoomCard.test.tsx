/* eslint-disable react/jsx-props-no-spreading */
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RoomCard } from '../RoomCard';

describe('RoomCard', () => {
  const mockOnClickRate = jest.fn();

  const props = {
    id: '123',
    roomNumber: 999999,
    price: 1000,
    feedbackCount: 5,
    rateNumber: 4,
    imgsSrc: ['img1.jpg', 'img2.jpg'],
    isLux: true,
    onClickRate: mockOnClickRate,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders room card with correct info', () => {
    render(
      <BrowserRouter>
        <RoomCard {...props} />
      </BrowserRouter>
    );
    expect(screen.getByTestId('room-card')).toBeInTheDocument();
    expect(screen.getByText(/люкс/i)).toBeInTheDocument();
    expect(screen.getByText(/1 000/i)).toBeInTheDocument();
    expect(screen.getByText('999999')).toBeInTheDocument();
    const starsElements = screen.getAllByText('star');
    expect(starsElements).toHaveLength(4);
  });

  test('does not render luxury label when isLux prop is false', () => {
    render(
      <BrowserRouter>
        <RoomCard {...props} isLux={false} />
      </BrowserRouter>
    );
    expect(screen.queryByText('люкс')).toBeNull();
  });

  test('calls onClickRate with correct arguments when rate is clicked', () => {
    render(
      <BrowserRouter>
        <RoomCard {...props} rateNumber={5} isRatingActive />
      </BrowserRouter>
    );
    const rateButtons = screen.getAllByRole('button', { name: 'star' });
    expect(rateButtons).toHaveLength(5);
    fireEvent.click(rateButtons[3]);
    expect(mockOnClickRate).toHaveBeenCalledWith('123', 4);
  });

  test(`does not call onClickRate when rate
   is clicked and onClickRate is not defined`, () => {
    render(
      <BrowserRouter>
        <RoomCard {...props} onClickRate={undefined} />
      </BrowserRouter>
    );
    const rateButtons = screen.getAllByRole('button', { name: 'star' });
    expect(rateButtons).toHaveLength(4);
    userEvent.click(rateButtons[3]);
    expect(mockOnClickRate).not.toHaveBeenCalled();
  });

  test(`roomCard props isLux should be by default false`, () => {
    render(
      <BrowserRouter>
        <RoomCard
          id="123"
          roomNumber={999999}
          price={1000}
          feedbackCount={5}
          rateNumber={4}
          imgsSrc={['img1.jpg', 'img2.jpg']}
        />
      </BrowserRouter>
    );
    expect(screen.queryByText(/люкс/i)).not.toBeInTheDocument();
  });
});
