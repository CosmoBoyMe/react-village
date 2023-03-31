import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import classnames from 'classnames';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { FURNITURE_DECLENSIONS } from '../../shared/constants/dropdownDeclensions';
import { WindowSizes } from '../../shared/constants/WindowSizes';
import { filterSelect } from '../../store/slices/filters/selectors';
import { filtersActions } from '../../store/slices/filters/slice';
import { roomsSelect } from '../../store/slices/rooms/selectors';
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

import { getNewSearchParams, getParsedParams } from './helpers';
import './Filters.scss';

const Filters: FC = () => {
  const [visibleFilters, setVisibleFilters] = useState(false);
  const filters = useAppSelector(filterSelect);
  const {
    rules,
    price,
    convenience,
    availability,
    selectedDates,
    furniture,
    capacity,
  } = filters;
  const [searchParams, setSearchParams] = useSearchParams();
  const rooms = useAppSelector(roomsSelect);
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

  const handleRangeSliderChange = (values: number[]) => {
    dispatch(filtersActions.updatePrice(values));
  };

  const handleDateDropdownSelect = (date: Date[]) => {
    dispatch(filtersActions.updateSelectedDate(date));
  };

  const handleFurnitureDropdownChange = (items: DropdownItemData[]) => {
    dispatch(filtersActions.updateFurniture(items));
  };

  const handleGuestDropdownChange = (items: DropdownGuestsItemData[]) => {
    dispatch(filtersActions.updateCapacity(items));
  };

  const handleClickOpenFilters = () => {
    setVisibleFilters(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseFilters = () => {
    setVisibleFilters(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.screen.width > WindowSizes.ExtraLarge && visibleFilters) {
        handleCloseFilters();
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [visibleFilters]);

  useEffect(() => {
    dispatch(filtersActions.syncFilters(rooms));
  }, [rooms, dispatch]);

  useEffect(() => {
    dispatch(filtersActions.syncFiltersWithUrl(getParsedParams(searchParams)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => setSearchParams(getNewSearchParams(filters)),
      250
    );

    return () => clearTimeout(timer);
  }, [filters, setSearchParams]);

  return (
    <aside className="filters">
      <div className="filters__button" data-testid="filters__button">
        <Button text="открыть фильтры" onClick={handleClickOpenFilters} />
      </div>
      <div
        data-testid="filters-content"
        className={classnames('filters__content', {
          filters__content_visible: visibleFilters,
        })}
      >
        <div className="filters__content-wrapper">
          <button
            className="filters__content-button-close"
            type="button"
            aria-label="close"
            onClick={handleCloseFilters}
          />
          <div className="filters__arrival-in-hotel">
            <DateDropdown
              isDatepickerSmall
              selectedDates={selectedDates}
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
                range={price}
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
