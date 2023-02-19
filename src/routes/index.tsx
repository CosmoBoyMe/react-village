import { Route, Routes } from 'react-router-dom';

import { Layout } from '../components/Layout/Layout';
import { LandingPage } from '../pages/LandingPage/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';
import { Room } from '../pages/Room/Room';
import { SearchRooms } from '../pages/SearchRooms/SearchRooms';
import { SignIn } from '../pages/SignIn/SignIn';

import { SCREENS } from './endpoints';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path={SCREENS.LANDING} element={<LandingPage />} />
        <Route path={SCREENS.SEARCH_ROOMS} element={<SearchRooms />} />
        <Route path={SCREENS.NOT_FOUND} element={<NotFoundPage />} />
        <Route path={`${SCREENS.ROOM}:id`} element={<Room />} />
        <Route path={SCREENS.SIGN_IN} element={<SignIn />} />
      </Route>
    </Routes>
  );
};

export { AppRoutes };
