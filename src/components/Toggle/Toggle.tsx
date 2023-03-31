import { ChangeEvent, FC } from 'react';

import './Toggle.scss';

type Props = {
  text: string;
  isChecked: boolean;
  name: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Toggle: FC<Props> = ({ text, isChecked, name, onChange }) => {
  return (
    <label data-testid="toggle" className="toggle">
      <input
        data-testid="toggle-input"
        onChange={onChange}
        type="checkbox"
        name={name}
        checked={isChecked}
        className="toggle__input"
      />
      <span className="toggle__slider" />
      <span className="toggle__text">{text}</span>
    </label>
  );
};

export { Toggle };
