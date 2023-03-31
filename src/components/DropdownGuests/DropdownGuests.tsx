import { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { getUniqueArray } from '../../shared/helpers/getUniqueArray/getUniqueArray';
import { DropdownGuestsItemData } from '../../types/DropdownItemData';
import { Button } from '../Button/Button';

import { DropdownGuestsItem } from './DropdownGuestsItem/DropdownGuestsItem';
import { DROPDOWN_GUESTS_DECLENSIONS } from './constant';
import { getCorrectDropdownGuestsValue } from './helpers';
import '../../styles/Dropdown.scss';

type Props = {
  items: DropdownGuestsItemData[];
  guestsLimit?: number;
  babiesLimit?: number;
  onChange?: (dropdownItems: DropdownGuestsItemData[]) => void;
};

const DropdownGuests: FC<Props> = ({
  items,
  guestsLimit = 15,
  babiesLimit = 10,
  onChange,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownItems = getUniqueArray(items, 'id');

  const totalAmount = dropdownItems.reduce((acc, item) => acc + item.amount, 0);

  const guestsAmount = dropdownItems
    .filter((item) => item.id !== 'babies')
    .reduce((acc, item) => acc + item.amount, 0);

  const babiesAmount = Number(
    dropdownItems.find((item) => item.id === 'babies')?.amount
  );
  const adultsAmount = Number(
    dropdownItems.find((item) => item.id === 'adults')?.amount
  );

  const setBabiesToZero = (currentItems: DropdownGuestsItemData[]) => {
    const newItems = currentItems.map((item) => {
      if (item.id === 'babies') {
        return {
          ...item,
          amount: 0,
        };
      }

      return item;
    });

    onChange?.(newItems);
  };

  const hasCurrentItemMaxValue = (id: string) => {
    if (id === 'babies') {
      return adultsAmount <= 0 || babiesAmount >= babiesLimit;
    }

    return guestsAmount >= guestsLimit;
  };

  const clear = () => {
    const newItems = dropdownItems.map((item) => {
      return {
        ...item,
        amount: 0,
      };
    });

    onChange?.(newItems);
  };

  const handleCounterChange = (name: string, amount: number) => {
    const newItems = dropdownItems.map((item) => {
      let currentItem = item;

      if (item.name === name) {
        currentItem = {
          ...item,
          amount,
        };
      }

      return currentItem;
    });

    const currentAdultsAmount = Number(
      newItems.find((item) => item.id === 'adults')?.amount
    );

    if (currentAdultsAmount <= 0) {
      setBabiesToZero(newItems);
      return;
    }

    onChange?.(newItems);
  };

  useEffect(() => {
    const handleDocumentPointerDown = ({ target }: PointerEvent) => {
      const dropdown = dropdownRef.current;
      const dropdownContainsTarget =
        target instanceof Node && dropdown && dropdown.contains(target);

      if (!dropdownContainsTarget) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleDocumentPointerDown);

    return () =>
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
  }, []);

  const handleDropdownPointerDown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleClearButtonPointerDown = () => {
    clear();
  };

  const handleApplyButtonPointerDown = () => {
    setIsOpen(false);
  };

  return (
    <div
      data-testid="guest-dropdown"
      ref={dropdownRef}
      className={classNames('dropdown', {
        dropdown_opened: isOpen,
      })}
    >
      <h3 className="dropdown__heading">Гости</h3>
      <div className="dropdown__wrapper">
        <input
          className="dropdown__input"
          type="text"
          placeholder="Сколько гостей"
          value={getCorrectDropdownGuestsValue(
            DROPDOWN_GUESTS_DECLENSIONS,
            guestsAmount,
            babiesAmount
          ).join(', ')}
          onClick={handleDropdownPointerDown}
          readOnly
        />
        <button
          className={classNames('dropdown__arrow-button', 'material-icons', {
            'dropdown__arrow-button_rotate': isOpen,
          })}
          type="button"
          onClick={handleDropdownPointerDown}
        >
          expand_more
        </button>
        <div className="dropdown__drop">
          <ul className="dropdown__list">
            {dropdownItems.map(({ id, name, amount }) => (
              <DropdownGuestsItem
                key={id}
                name={name}
                amount={amount}
                onChangeCounter={handleCounterChange}
                incrementDisabled={hasCurrentItemMaxValue(id)}
              />
            ))}
          </ul>
          <div className="dropdown__buttons">
            <div
              className={classNames('dropdown__button-clear', {
                dropdown__button_hidden: totalAmount <= 0,
              })}
            >
              <Button text="Очистить" onClick={handleClearButtonPointerDown} />
            </div>
            <div className="dropdown__button-apply">
              <Button text="Применить" onClick={handleApplyButtonPointerDown} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { DropdownGuests };
