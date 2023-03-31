import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

import { InputEdit } from '../InputEdit';

describe('InputEdit', () => {
  const onChange = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the text when not editable', () => {
    // eslint-disable-next-line testing-library/render-result-naming-convention
    const InputEditComponent = render(
      <InputEdit value="Hello" status="idle" />
    );

    const textElement = screen.getByText('Hello');
    expect(textElement).toBeInTheDocument();
    expect(InputEditComponent).toMatchSnapshot();
  });

  it('renders the input when editable', () => {
    render(<InputEdit value="" status="accepted" />);
    const InputEditComponent = screen.getByPlaceholderText('');
    expect(InputEditComponent).toBeInTheDocument();
  });

  it('calls the onChange callback with the new value', () => {
    render(<InputEdit value="Hello" status="accepted" onChange={onChange} />);
    const inputElement = screen.getByPlaceholderText('');
    fireEvent.change(inputElement, { target: { value: 'World' } });
    const applyButton = screen.getByTitle('сохранить');
    fireEvent.click(applyButton);
    expect(onChange).toHaveBeenCalledWith('World');
  });

  it('resets the text when cancel is clicked', () => {
    render(<InputEdit value="Hello" status="accepted" onChange={onChange} />);
    const inputElement = screen.getByPlaceholderText('');
    fireEvent.change(inputElement, { target: { value: 'World' } });
    const cancelButton = screen.getByTitle('отмена');
    fireEvent.click(cancelButton);
    expect(onChange).not.toHaveBeenCalled();
    expect(inputElement).toHaveValue('Hello');
  });

  it('resets the text when status is rejected', () => {
    render(<InputEdit value="Hello" status="rejected" />);
    const inputElement = screen.getByPlaceholderText('');
    expect(inputElement).toHaveValue('Hello');
  });

  test('clicking edit button toggles editable state', () => {
    render(<InputEdit value="Some text" status="success" />);
    const editButton = screen.getByText('edit');
    const input = screen.getByTestId('input-edit-input');
    const closeBtn = screen.getByText('close');

    expect(editButton).toBeInTheDocument();
    expect(input).toHaveAttribute('disabled');

    fireEvent.click(editButton);

    expect(closeBtn).toBeInTheDocument();
    expect(input).not.toHaveAttribute('disabled');

    fireEvent.click(closeBtn);

    expect(input).toHaveAttribute('disabled');
  });
});
