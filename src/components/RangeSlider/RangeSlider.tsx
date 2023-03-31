import { FC, useCallback, useEffect, useRef } from 'react';
import noUiSlider, { API } from 'nouislider';

import { moneyFormat } from '../../shared/helpers/moneyFormat/moneyFormat';

import './RangeSlider.scss';

type Props = {
  title: string;
  start: number[];
  step: number;
  range: { min: number; max: number; from: number; to: number };
  text?: string;
  onChange?: (values: number[]) => void;
};

interface SliderRef extends HTMLDivElement {
  noUiSlider?: API;
}

const RangeSlider: FC<Props> = ({
  title,
  start,
  step,
  range,
  text = '',
  onChange,
}) => {
  const sliderElementRef = useRef<SliderRef>(null);

  const handleSliderUpdate = useCallback(
    (values: (string | number)[]) => {
      const formattedValues = values.map((item) =>
        moneyFormat.from(String(item))
      );
      onChange?.(formattedValues);
    },
    [onChange]
  );

  useEffect(() => {
    const sliderCurrent = sliderElementRef.current;
    if (sliderCurrent !== null) {
      noUiSlider.create(sliderCurrent, {
        start,
        step,
        range: { min: range.min, max: range.max },
        connect: true,
        format: moneyFormat,
      });
      sliderCurrent.noUiSlider?.on('update', handleSliderUpdate);
    }

    return () => {
      if (sliderCurrent !== null) {
        sliderCurrent.noUiSlider?.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sliderElementRef.current) {
      sliderElementRef.current.noUiSlider?.updateOptions(
        {
          start,
          step,
          range: { min: range.min, max: range.max },
        },
        false
      );
      sliderElementRef.current.noUiSlider?.on('update', handleSliderUpdate);
    }
  }, [range, step, start, handleSliderUpdate]);

  return (
    <div className="range-slider">
      <div className="range-slider__info">
        <h3 className="range-slider__title">{title}</h3>
        <div className="range-slider__price">
          {`${range.from} - ${range.to}`}
        </div>
      </div>
      <div ref={sliderElementRef} className="range-slider__slider" />
      {text && <p className="range-slider__note-text">{text}</p>}
    </div>
  );
};

export { RangeSlider };
