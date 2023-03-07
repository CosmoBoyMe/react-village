import { FC } from 'react';
import classNames from 'classnames';

import { TabsProfileId } from '../BookingRooms/constants';

import './Tabs.scss';

type Props = {
  items: { name: string; id: TabsProfileId }[];
  activeItem: TabsProfileId;
  onChange: (id: TabsProfileId) => void;
};

const Tabs: FC<Props> = ({ items, activeItem, onChange }) => {
  const handleButtonPointerDown = (id: TabsProfileId) => {
    onChange(id);
  };

  return (
    <div className="tabs">
      {items.map(({ name, id }) => (
        <button
          className={classNames('tabs__item', {
            tabs__item_active: id === activeItem,
          })}
          key={id}
          type="button"
          onPointerDown={() => handleButtonPointerDown(id)}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export { Tabs };
