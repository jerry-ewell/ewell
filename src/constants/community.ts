import mediumSvg from 'assets/images/communityLogo/mediumLogo.svg';
import xSvg from 'assets/images/communityLogo/xLogo.svg';
import telegramSvg from 'assets/images/communityLogo/telegramLogo.svg';

export type TCommunityItem = {
  name: string;
  icon: string;
  content: string;
  link: string;
};
export const COMMUNITY_LIST: TCommunityItem[] = [
  {
    name: 'Medium',
    icon: mediumSvg,
    content: 'Join this open space for discussion news, and announcements.',
    link: '',
  },
  {
    name: 'X',
    icon: xSvg,
    content: `Stay up-to-date with Ewell's new features and projects.`,
    link: '',
  },
  {
    name: 'Telegram',
    icon: telegramSvg,
    content: 'Meet the community and get live support.',
    link: '',
  },
];
