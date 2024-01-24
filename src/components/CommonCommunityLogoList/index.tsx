import React from 'react';
import clsx from 'clsx';
import { Flex, FlexProps } from 'antd';
import communityLogo from 'assets/images/communityLogo';

enum CommunityLogoType {
  WEBSITE = 'website',
  FACEBOOK = 'facebook',
  TELEGRAM = 'telegram',
  X = 'x',
  GITHUB = 'github',
  DISCORD = 'discord',
  REDDIT = 'reddit',
}

interface ICommonCommunityLogoListProps {
  flexProps?: FlexProps;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  communityLink: { [key in CommunityLogoType]?: string };
}

export const COMMUNITY_LOGO_LIST = [
  CommunityLogoType.WEBSITE,
  CommunityLogoType.FACEBOOK,
  CommunityLogoType.TELEGRAM,
  CommunityLogoType.X,
  CommunityLogoType.GITHUB,
  CommunityLogoType.DISCORD,
  CommunityLogoType.REDDIT,
];

export default function CommonCommunityLogoList({ flexProps, imgProps, communityLink }: ICommonCommunityLogoListProps) {
  const communityLogoList = COMMUNITY_LOGO_LIST.map((type) => ({
    type,
    logo: communityLogo[type],
    link: communityLink[type],
  }));
  return (
    <Flex gap={12} align="center" {...flexProps}>
      {communityLogoList
        .filter((item) => !!item.link)
        .map((item, index) => {
          return (
            <img
              {...imgProps}
              key={index}
              className={clsx('cursor-pointer', imgProps?.className)}
              src={item.logo}
              alt="community"
              onClick={() => {
                window.open(item.link, '_blank');
              }}
            />
          );
        })}
    </Flex>
  );
}
