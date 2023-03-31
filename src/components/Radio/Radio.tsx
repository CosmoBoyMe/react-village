import { FC } from 'react';

import './Radio.scss';

type Props = {
  text: string;
  name: string;
  value: string;
  isChecked: boolean;
  onChange?: (value: string) => void;
};

const Radio: FC<Props> = ({ text, name, value, isChecked, onChange }) => {
  return (
    <label data-testid="radio" className="radio">
      <input
        data-testid="radio-input"
        type="radio"
        name={name}
        checked={isChecked}
        className="radio__input"
        value={value}
        onChange={() => onChange?.(value)}
      />
      <span className="radio__bullet" />
      <span className="radio__text">{text}</span>
    </label>
  );
};

export { Radio };
