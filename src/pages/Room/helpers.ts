import { RateData } from '../../types/RateData';

import { defaultRule, informationList, rulesList } from './constants';

type Rules = { text: string; id: number }[];
type Details = {
  withGuests?: boolean;
  withPets?: boolean;
  canSmoke?: boolean;
};
type RulesKeyType = keyof typeof rulesList;

type Info = {
  comfort?: boolean;
  convenience?: boolean;
  cosiness?: boolean;
  freeBreakfast?: boolean;
  laundry?: boolean;
};
type ListInfo = {
  label: string;
  description: string;
  imageName: string;
  id: number;
}[];
type InfoKeyType = keyof typeof informationList;

const convertInformation = (info: Info) => {
  return Object.entries(info).reduce((acc: ListInfo, [key], index) => {
    if (Object.hasOwn(informationList, key)) {
      const information = informationList[key as InfoKeyType];

      const newItem = {
        label: information.label,
        description: information.description,
        imageName: information.imageName,
        id: index,
      };

      return [...acc, newItem];
    }
    return acc;
  }, []);
};

const convertRules = (rules: Details) => {
  const resultRulesList: Rules = [];
  let index = 0;

  for (const [key, value] of Object.entries(rulesList)) {
    const rule = rulesList[key as RulesKeyType];

    if (Object.hasOwn(rules, key)) {
      if (value) {
        resultRulesList.push({
          text: rule.can,
          id: (index += 1),
        });
      }
    } else {
      resultRulesList.push({
        text: rule.canNot,
        id: (index += 1),
      });
    }
  }

  resultRulesList.push({
    text: defaultRule,
    id: (index += 1),
  });

  return resultRulesList;
};

const prepareUrl = (path: string, type: 'feedback' | 'like' = 'feedback') => {
  let url = `feedback${path
    .split('/')
    .reduce(
      (accumulator, element) =>
        element ? `${accumulator}/${element}/feedback` : '',
      ''
    )}`;

  url =
    type === 'like'
      ? `${url.slice(0, url.length - '/feedback'.length)}/likes`
      : url;

  return url;
};

const getVotes = (votesEntries: RateData[]) => {
  const votesObject = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  if (votesEntries.length) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= votesEntries.length; i++) {
      if (votesEntries[i]) {
        switch (votesEntries[i].rate) {
          case 1:
            votesObject[1] += 1;
            break;

          case 2:
            votesObject[2] += 1;
            break;

          case 3:
            votesObject[3] += 1;
            break;

          case 4:
            votesObject[4] += 1;
            break;

          default:
            votesObject[5] += 1;
        }
      }
    }
  }

  return Object.entries(votesObject).map((item) => {
    return { count: item[1], rating: Number(item[0]) };
  });
};

export { convertInformation, convertRules, getVotes, prepareUrl };
