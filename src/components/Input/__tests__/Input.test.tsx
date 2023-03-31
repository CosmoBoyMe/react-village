import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from '../Input';

describe('Input', () => {
  let handleChange: jest.Mock;

  beforeAll(() => {
    handleChange = jest.fn();
  });

  it('should have been in the document', () => {
    render(<Input onChange={handleChange} />);
    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
  });

  it('should have the correct type, name, and placeholder attributes', () => {
    render(
      <Input
        type="email"
        name="email"
        placeholder="Enter email address"
        onChange={handleChange}
      />
    );
    const inputElement = screen.getByTestId('input-input');
    expect(inputElement).toHaveAttribute('type', 'email');
    expect(inputElement).toHaveAttribute('name', 'email');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter email address');
  });

  it('when input is changed should be called the onChange callback', () => {
    render(<Input onChange={handleChange} />);
    const inputElement = screen.getByTestId('input-input');

    userEvent.type(inputElement, 'Test value');
    expect(handleChange).toHaveBeenCalled();
  });

  it(`should have the subscription button
      when isSubscribe prop is true`, () => {
    render(<Input isSubscribe onChange={handleChange} />);
    const inputElement = screen.getByTestId('input-input');
    const buttonElement = screen.getByText('arrow_forward');

    expect(inputElement).toHaveClass('input__input_with-button');
    expect(buttonElement).toBeInTheDocument();
  });

  it('should show error message when isInvalid prop is true', () => {
    render(
      <Input isInvalid errorMessage="Invalid input" onChange={handleChange} />
    );
    const inputElement = screen.getByTestId('input-input');
    const errorMessage = screen.getByText('Invalid input');
    const button = screen.getByText('i');

    expect(inputElement).toHaveClass('input__input_invalid');
    expect(errorMessage).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('should toggle the date mask when hasDateMask is true', () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => 1679331600000);

    const date = new Date(Date.now());
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    render(
      <Input
        value={`${day}.${month}.${year}`}
        hasDateMask
        onChange={handleChange}
      />
    );
    const inputElement = screen.getByTestId('input-input');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveClass('js-input_date-masked');
    expect(inputElement).toHaveValue('21.03.2023');

    jest.clearAllMocks();
  });

  it('should show title element when title prop is exist', () => {
    render(<Input title="Email" onChange={handleChange} />);
    const title = screen.getByText('Email');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Email');
  });

  it('should have value', () => {
    render(<Input value="test@test.com" onChange={handleChange} />);
    const inputElement = screen.getByTestId('input-input');

    expect(inputElement).toHaveAttribute('value', 'test@test.com');
  });

  it(`should have arrow button and datatype for this
      when hasArrow and arrowButtonDataType props is exist`, () => {
    render(
      <Input hasArrow arrowButtonDataType="arrow" onChange={handleChange} />
    );
    const arrowButton = screen.getByText('expand_more');

    expect(arrowButton).toBeInTheDocument();
    expect(arrowButton).toHaveAttribute('data-type', 'arrow');
  });

  it('should have readOnly attribute', () => {
    render(<Input readOnly onChange={handleChange} />);
    const inputElement = screen.getByTestId('input-input');

    expect(inputElement).toHaveAttribute('readonly');
  });

  it('should have spellCheck attribute', () => {
    render(<Input spellcheck onChange={handleChange} />);
    const inputElement = screen.getByTestId('input-input');

    expect(inputElement).toHaveAttribute('spellcheck', 'true');
  });

  it('should have autocomplete attribute', () => {
    render(<Input autoComplete="on" onChange={handleChange} />);
    const inputElement = screen.getByTestId('input-input');

    expect(inputElement).toHaveAttribute('autoComplete', 'on');
  });

  it('should have input__input_lowercase class', () => {
    render(<Input isLowerCase onChange={handleChange} />);
    const inputElement = screen.getByTestId('input-input');

    expect(inputElement).toHaveClass('input__input_lowercase');
  });
});

export {};
