import { FC, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';

import { WindowSizes } from '../../shared/constants/WindowSizes';
import { throttle } from '../../shared/helpers/throttle/throttle';
import { CheckBox } from '../CheckBox/CheckBox';

import './CheckList.scss';

type Props = {
  labelName: string;
  listItems: {
    label: string;
    name: string;
    description?: string;
    isChecked?: boolean;
  }[];
  isToggleable?: boolean;
  isRich?: boolean;
  onChange?: (name: string) => void;
};

const CheckList: FC<Props> = ({
  labelName,
  listItems,
  isToggleable = false,
  isRich = false,
  onChange,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isTemporaryToggleable, setIsTemporaryToggleable] =
    useState<boolean>(false);

  useEffect(() => {
    const handleWindowResize = () => {
      if (!isToggleable) {
        setIsTemporaryToggleable(window.innerWidth < WindowSizes.Medium);
      }
    };

    const throttledHandleWindowResize = throttle(handleWindowResize, 250);
    window.addEventListener('resize', throttledHandleWindowResize);

    return () => window.removeEventListener('resize', handleWindowResize);
  }, [isToggleable]);

  const ref = useRef<HTMLFieldSetElement>(null);

  useEffect(() => {
    const handleDocumentClick = (event: PointerEvent) => {
      const targetElement = event.target;
      const currentInstance = ref.current;
      if (!(targetElement instanceof Node) || !currentInstance) {
        return;
      }
      if (currentInstance.contains(targetElement)) {
        return;
      }
      setIsExpanded(false);
    };

    document.addEventListener('pointerdown', handleDocumentClick);
    return () =>
      document.removeEventListener('pointerdown', handleDocumentClick);
  }, []);

  const handleButtonClick = () => {
    if (isToggleable || isTemporaryToggleable) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <fieldset
      className={classnames('check-list', {
        'check-list_expanded': isExpanded,
        'check-list_toggleable': isToggleable,
        'check-list_temporary-toggleable': isTemporaryToggleable,
      })}
      ref={ref}
    >
      <legend className="check-list__legend">
        <button
          type="button"
          className="check-list__label"
          tabIndex={isToggleable || isTemporaryToggleable ? 0 : -1}
          onClick={handleButtonClick}
        >
          {labelName}
        </button>
      </legend>
      <ul className="check-list__list-wrapper">
        {listItems.map(({ label, description, isChecked, name }) => (
          <CheckBox
            key={name}
            isRich={isRich}
            label={label}
            name={name}
            description={description}
            isChecked={!!isChecked}
            onChange={onChange}
          />
        ))}
      </ul>
    </fieldset>
  );
};

export { CheckList };
