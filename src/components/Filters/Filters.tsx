import { FC, useCallback, useState } from 'react';
import classnames from 'classnames';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { FURNITURE_DECLENSIONS } from '../../shared/constants/dropdownDeclensions';
import { filterSelect } from '../../store/slices/filters/selectors';
import { filtersActions } from '../../store/slices/filters/slice';
import {
  DropdownGuestsItemData,
  DropdownItemData,
} from '../../types/DropdownItemData';
import { Button } from '../Button/Button';
import { CheckList } from '../CheckList/CheckList';
import { DateDropdown } from '../DateDropdown/DateDropdown';
import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownGuests } from '../DropdownGuests/DropdownGuests';
import { RangeSlider } from '../RangeSlider/RangeSlider';

import './Filters.scss';

const Filters: FC = () => {
  const [visibleFilters, setVisibleFilters] = useState(false);
  const {
    rules,
    price,
    convenience,
    availability,
    selectedDates,
    furniture,
    capacity,
  } = useAppSelector(filterSelect);
  const dispatch = useAppDispatch();

  const handleRulesCheckboxChange = (name: string) => {
    dispatch(filtersActions.toggleRule(name));
  };

  const handleAvailabilityCheckBoxChange = (name: string) => {
    dispatch(filtersActions.toggleAvailability(name));
  };

  const handleConvenienceCheckboxChange = (name: string) => {
    dispatch(filtersActions.toggleConvenience(name));
  };

  const handleRangeSliderChange = useCallback(
    (values: number[]) => {
      dispatch(filtersActions.updatePrice(values));
    },
    [dispatch]
  );

  const handleDateDropdownSelect = useCallback(
    (date: Date[]) => {
      dispatch(filtersActions.updateSelectedDate(date));
    },
    [dispatch]
  );

  const handleFurnitureDropdownChange = (items: DropdownItemData[]) => {
    dispatch(filtersActions.updateFurniture(items));
  };

  const handleGuestDropdownChange = (items: DropdownGuestsItemData[]) => {
    dispatch(filtersActions.updateCapacity(items));
  };

  return (
    <aside className="filters">
      <div className="filters__button">
        <Button
          text="открыть фильтры"
          onClick={() => setVisibleFilters(true)}
        />
      </div>
      <div
        className={classnames('filters__content', {
          filters__content_visible: visibleFilters,
        })}
      >
        <div className="filters__content-wrapper">
          <button
            className="filters__content-button-close"
            type="button"
            aria-label="close"
            onClick={() => setVisibleFilters(false)}
          />
          <div className="filters__arrival-in-hotel">
            <DateDropdown
              isDatepickerSmall
              initialDates={selectedDates}
              onSelect={handleDateDropdownSelect}
            />
          </div>
          <div className="filters__guests-container">
            <DropdownGuests
              items={capacity.items}
              onChange={handleGuestDropdownChange}
              guestsLimit={capacity.guestsLimit}
              babiesLimit={capacity.babiesLimit}
            />
          </div>
          <div className="filters__price-hotel">
            {price && (
              <RangeSlider
                title="Диапазон цены"
                start={[price.from, price.to]}
                step={100}
                range={{ min: price.min, max: price.max }}
                text="Стоимость за сутки пребывания в номере"
                onChange={handleRangeSliderChange}
              />
            )}
          </div>
          <div className="filters__order-in-room">
            <CheckList
              labelName="правила дома"
              listItems={rules}
              onChange={handleRulesCheckboxChange}
            />
          </div>
          <div className="filters__availability">
            <CheckList
              labelName="доступность"
              isRich
              listItems={availability}
              onChange={handleAvailabilityCheckBoxChange}
            />
          </div>
          <div className="filters__furniture">
            <Dropdown
              declensions={FURNITURE_DECLENSIONS}
              items={furniture}
              placeholder="Выберете удобства"
              title="УДОБСТВА НОМЕРА"
              onChange={handleFurnitureDropdownChange}
            />
          </div>
          <div className="filters__convenience">
            <CheckList
              labelName="Дополнительные удобства"
              isToggleable
              listItems={convenience}
              onChange={handleConvenienceCheckboxChange}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export { Filters };
