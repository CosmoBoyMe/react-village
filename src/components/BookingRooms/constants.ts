enum TabsProfileId {
  ALL = 'all',
  CURRENT = 'current',
  PAST = 'past',
}

const TABS_BUTTONS_DATA = [
  { name: 'все', id: TabsProfileId.ALL },
  { name: 'текущие', id: TabsProfileId.CURRENT },
  { name: 'прошедшие', id: TabsProfileId.PAST },
];

export { TABS_BUTTONS_DATA, TabsProfileId };
