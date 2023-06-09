import { FC } from 'react';

import logo from '../../assets/svg/logo.svg';

import './Logo.scss';

const Logo: FC = () => (
  <div className="logo">
    <img src={logo} alt="company logo" className="logo__img" />
  </div>
);

export { Logo };
