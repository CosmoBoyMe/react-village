import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CheckBox } from '../CheckBox';

describe('CheckBox', () => {
  it('should render the component with the default props', () => {
    render(
      <CheckBox
        label="Example checkbox"
        name="exampleCheckbox"
        isChecked={false}
      />
    );
    expect(screen).toMatchSnapshot();
  });

  it(`should render the component 
  with the rich style if "isRich" is true`, () => {
    render(
      <CheckBox
        label="Example checkbox"
        name="exampleCheckbox"
        isChecked={false}
        isRich
      />
    );
    const label = screen.getByTestId('check-box__category');
    expect(label).toHaveClass('check-box__category_rich');
  });

  it(`should render the component with the
   "label" and "description" props`, () => {
    const props = {
      label: 'Example checkbox',
      description: 'This is an example description',
      name: 'exampleCheckbox',
    };

    render(
      <CheckBox
        isChecked={false}
        name={props.name}
        label={props.label}
        description={props.description}
      />
    );
    const nameLabel = screen.getByText(props.label);
    const descriptionLabel = screen.getByText(props.description);
    expect(nameLabel).toBeInTheDocument();
    expect(descriptionLabel).toBeInTheDocument();
  });

  it('should call the "onChange" prop when the checkbox is clicked', () => {
    const props = {
      label: 'Example checkbox',
      description: 'This is an example description',
      name: 'exampleCheckbox',
      onChange: jest.fn(),
    };

    render(
      <CheckBox
        isChecked={false}
        name={props.name}
        label={props.label}
        description={props.description}
        onChange={props.onChange}
      />
    );
    const checkbox = screen.getByRole('checkbox');
    userEvent.click(checkbox);
    expect(props.onChange).toHaveBeenCalledWith(props.name, true);
  });

  it('should not call the "onChange" prop if it is not defined', () => {
    const onChange = jest.fn();
    render(
      <CheckBox
        isChecked={false}
        label="Example checkbox"
        name="exampleCheckbox"
      />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.change(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not render description when not provided', () => {
    render(
      <CheckBox
        isChecked={false}
        label="Example checkbox"
        name="exampleCheckbox"
      />
    );

    const descriptionElement = screen.queryByTestId('check-box__description');
    expect(descriptionElement).not.toBeInTheDocument();
  });
});
