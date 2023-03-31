import { FC, memo, useEffect, useRef } from 'react';
import AirDatepicker from 'air-datepicker';
import { AirDatepickerOptions } from 'air-datepicker/air-datepicker';

import { getCorrectReservedDates, setReservedDates } from './helpers';
import './DatePicker.scss';

type DatepickerOnSelect = {
  date: Date | Date[];
  formattedDate: string | string[];
  datepicker: AirDatepicker;
};

type Props = {
  selectedDates?: (Date | string)[];
  reservedDates?: { from: string; to: string }[];
  isDatepickerSmall?: boolean;
  dateFormatWithYear?: boolean;
  onSelect?: (selectedDate: Date[], formattedDate: string[]) => void;
  onClickClose?: () => void;
};

type DatepickerView = 'days' | 'months' | 'years';

const DatePicker: FC<Props> = memo(
  ({
    selectedDates = [],
    reservedDates = [],
    isDatepickerSmall = false,
    dateFormatWithYear = false,
    onSelect,
    onClickClose,
  }) => {
    const datePickerRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement | null>(null);

    const onChangeView = (view: DatepickerView) => {
      if (buttonsRef.current !== null) {
        if (view !== 'days') {
          buttonsRef.current?.classList.add('air-datepicker--buttons_hidden');
        } else {
          buttonsRef.current?.classList.remove(
            'air-datepicker--buttons_hidden'
          );
        }
      }
    };

    useEffect(() => {
      const { current } = datePickerRef;

      const correctReservedDates = getCorrectReservedDates(reservedDates);

      const handleAirDatepickerSelect = ({
        date,
        formattedDate,
      }: DatepickerOnSelect): void => {
        if (Array.isArray(date) && Array.isArray(formattedDate)) {
          onSelect?.(date, formattedDate);
        }
      };

      if (current !== null) {
        const options: Partial<AirDatepickerOptions> = {
          minDate: new Date(),
          navTitles: {
            days: 'MMMM yyyy',
          },
          multipleDatesSeparator: ' - ',
          dateFormat: dateFormatWithYear ? 'dd.MM.yyyy' : 'dd MMM',
          range: true,
          selectedDates,
          onSelect: handleAirDatepickerSelect,
          onRenderCell: (params) =>
            setReservedDates(params, correctReservedDates),
          prevHtml: `<span class="material-icons air-datepicker-arrow">
          arrow_back</span>`,
          nextHtml: `<span class="material-icons air-datepicker-arrow">
        arrow_forward</span>`,
          onChangeView,
          buttons: [
            {
              content: 'Очистить',
              attrs: {
                type: 'button',
                tabindex: '-1',
              },
              onClick: (datepicker: AirDatepicker) => datepicker.clear(),
            },
            {
              content: 'Применить',
              attrs: {
                type: 'button',
                tabindex: '-1',
              },
              onClick: () => onClickClose?.(),
            },
          ],
        };

        const datepicker: AirDatepicker<HTMLElement> = new AirDatepicker(
          current,
          options
        );

        buttonsRef.current = current.querySelector('.air-datepicker-buttons');
        if (isDatepickerSmall)
          current.classList.add('air-datepicker--size-small');
        return () => {
          datepicker.destroy();
        };
      }
      return () => {};
    }, [
      selectedDates,
      reservedDates,
      dateFormatWithYear,
      isDatepickerSmall,
      onClickClose,
      onSelect,
    ]);

    return <div className="date-picker" ref={datePickerRef} />;
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
