import { FC, KeyboardEvent } from 'react';

import '../../../styles/DropdownItem.scss';

type Props = {
  name: string;
  amount: number;
  maxValue?: number;
  onChangeCounter: (name: string, amount: number) => void;
};

const DropdownItem: FC<Props> = ({
  name,
  amount,
  maxValue = 10,
  onChangeCounter,
}) => {
  const counter = amount;

  const handleIncrementPointerDown = () => {
    const newAmount = counter + 1;

    if (newAmount <= maxValue) {
      onChangeCounter(name, newAmount);
    }
  };

  const handleDecrementPointerDown = () => {
    const newAmount = counter - 1;

    if (newAmount >= 0) {
      onChangeCounter(name, newAmount);
    }
  };

  const handleIncrementKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      const newAmount = counter + 1;

      if (newAmount <= maxValue) {
        onChangeCounter(name, newAmount);
      }
    }
  };

  const handleDecrementKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      const newAmount = counter - 1;

      if (newAmount >= 0) {
        onChangeCounter(name, newAmount);
      }
    }
  };

  return (
    <li className="dropdown-item">
      <p className="dropdown-item__name">{name}</p>
      <div className="dropdown-item__controls">
        <button
          className="dropdown-item__button"
          type="button"
          onPointerDown={handleDecrementPointerDown}
          onKeyDown={handleDecrementKeyDown}
          disabled={amount <= 0}
        >
          -
        </button>
        <p className="dropdown-item__counter">{amount}</p>
        <button
          className="dropdown-item__button"
          type="button"
          onPointerDown={handleIncrementPointerDown}
          onKeyDown={handleIncrementKeyDown}
          disabled={amount >= maxValue}
        >
          +
        </button>
      </div>
    </li>
  );
};

export { DropdownItem };
