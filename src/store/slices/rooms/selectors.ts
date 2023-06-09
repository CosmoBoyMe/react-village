import { RootState } from '../../index';

const roomsSelect = (state: RootState) => state.rooms.rooms;
const activePageNumberSelect = (state: RootState) =>
  state.rooms.activePageNumber;
const statusSelect = (state: RootState) => state.rooms.status;

export { activePageNumberSelect, roomsSelect, statusSelect };
