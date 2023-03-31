enum TabsProfileId {
  ALL = 'all',
  CURRENT = 'current',
  PAST = 'past',
  FUTURE = 'future',
}

const TABS_BUTTONS_DATA = [
  { name: 'все', id: TabsProfileId.ALL },
  { name: 'прошедшие', id: TabsProfileId.PAST },
  { name: 'текущие', id: TabsProfileId.CURRENT },
  { name: 'будущие', id: TabsProfileId.FUTURE },
];

export { TABS_BUTTONS_DATA, TabsProfileId };
