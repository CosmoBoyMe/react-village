import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { SCREENS } from '../../routes/endpoints';
import { WindowSizes } from '../../shared/constants/WindowSizes';
import {
  isAuthSelect,
  userNameSelect,
  userSurnameSelect,
} from '../../store/slices/auth/selectors';
import { ButtonLink } from '../ButtonLink/ButtonLink';
import { Logo } from '../Logo/Logo';

import { navigationItems } from './constants';
import './Header.scss';

const Header: FC = () => {
  const navigationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isAuth = useSelector(isAuthSelect);
  const userName = useSelector(userNameSelect);
  const userSurname = useSelector(userSurnameSelect);

  const [isBurgerMenuActive, setIsBurgerMenuActive] = useState(false);

  const handleNavBurgerClick = () => {
    setIsBurgerMenuActive(!isBurgerMenuActive);

    if (window.innerWidth <= WindowSizes.Medium) {
      document.body.style.overflow = isBurgerMenuActive ? '' : 'hidden';
    }
  };

  const handleLinkClick = () => {
    setIsBurgerMenuActive(false);
  };

  const handleBodyClick = ({ currentTarget, target }: MouseEvent) => {
    if (
      currentTarget instanceof HTMLElement &&
      target instanceof HTMLElement &&
      navigationRef.current !== null
    ) {
      if (
        window.innerWidth > WindowSizes.Medium &&
        window.innerWidth <= WindowSizes.Large
      ) {
        if (!navigationRef.current.contains(target)) {
          setIsBurgerMenuActive(false);
        }
      }
    }
  };

  const handleUserNavProfileClick = () => {
    navigate(SCREENS.PROFILE);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      if (
        window.innerWidth > WindowSizes.Medium &&
        window.innerWidth <= WindowSizes.Large
      ) {
        if (isBurgerMenuActive) {
          document.body.style.overflow = '';
        }
        document.body.addEventListener('click', handleBodyClick);
      } else if (window.innerWidth <= WindowSizes.Medium) {
        if (isBurgerMenuActive) {
          document.body.style.overflow = 'hidden';
        }
        document.body.removeEventListener('click', handleBodyClick);
      } else if (window.innerWidth > WindowSizes.Large) {
        if (isBurgerMenuActive) {
          document.body.style.overflow = '';
        }
        setIsBurgerMenuActive(false);
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [isBurgerMenuActive]);

  useEffect(() => {
    if (
      window.innerWidth > WindowSizes.Medium &&
      window.innerWidth <= WindowSizes.Large
    ) {
      document.body.addEventListener('click', handleBodyClick);
    }
    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__inner">
          <Link
            onClick={handleLinkClick}
            to={SCREENS.LANDING}
            className="header__logo-link"
          >
            <Logo />
          </Link>
          <nav
            ref={navigationRef}
            className={classNames('header__nav', {
              header__nav_active: isBurgerMenuActive,
            })}
          >
            <button
              title="главное меню"
              type="button"
              onClick={handleNavBurgerClick}
              className={classNames('header__nav-burger', {
                'header__nav-burger_active': isBurgerMenuActive,
              })}
            >
              <span className="header__nav-burger-line" />
            </button>
            <div className="header__nav-content">
              <ul className="header__nav-list">
                {navigationItems.map((item) => (
                  <li key={item.text} className="header__nav-item">
                    <NavLink
                      onClick={handleLinkClick}
                      to={item.to}
                      className={({ isActive }) =>
                        classNames('header__nav-link', {
                          'header__nav-link_active':
                            isActive && item.to !== '/mock-address/change-me',
                          'header__nav-link_sign_arrow': item.isNested,
                        })
                      }
                    >
                      {item.text}
                    </NavLink>
                  </li>
                ))}
              </ul>
              {isAuth && userName && userSurname ? (
                <button
                  type="button"
                  onClick={handleUserNavProfileClick}
                  className="header__nav-profile"
                >
                  {`${userName} ${userSurname}`}
                </button>
              ) : (
                <div className="header__nav-auth-user">
                  <ButtonLink
                    onClick={handleLinkClick}
                    text="войти"
                    href={SCREENS.SIGN_IN}
                    withBorder
                    isSmall
                  />
                  <ButtonLink
                    onClick={handleLinkClick}
                    text="зарегистрироваться"
                    href={SCREENS.SIGN_UP}
                    isSmall
                  />
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export { Header };
