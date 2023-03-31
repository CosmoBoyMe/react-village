import { FC } from 'react';

import './Loader.scss';

const Loader: FC = () => (
  <div title="ожидание загрузки" className="loader" data-testid="loader" />
);

export { Loader };
