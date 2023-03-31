import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Radio } from '../Radio';

describe('Radio', () => {
  let handleChange: jest.Mock;

  beforeAll(() => {
    handleChange = jest.fn();
  });

  it('should have been in the document', () => {
    render(
      <Radio name="gender" text="мужчина" value="man" onChange={handleChange} />
    );
    const radio = screen.getByTestId('radio');
    expect(radio).toBeInTheDocument();
  });

  it('should have been checked', () => {
    render(
      <Radio
        name="gender"
        text="мужчина"
        value="man"
        isChecked
        onChange={handleChange}
      />
    );
    const input = screen.getByTestId('radio-input');
    expect(input).toHaveAttribute('checked');
  });

  it('when radio is changed should be called the onChange callback', () => {
    render(
      <Radio
        name="gender"
        text="женщина"
        value="woman"
        onChange={handleChange}
      />
    );
    const input = screen.getByTestId('radio-input');

    userEvent.click(input);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

export {};
