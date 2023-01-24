import { Route, Routes } from 'react-router-dom';

import Layout from '../components/Layout/Layout';
import Main from '../pages/Main';
import SearchRooms from '../pages/SearchRooms';

import SCREENS from './endpoints';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path={SCREENS.MAIN} element={<Main />} />
        <Route path={SCREENS.SEARCH_ROOMS} element={<SearchRooms />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;