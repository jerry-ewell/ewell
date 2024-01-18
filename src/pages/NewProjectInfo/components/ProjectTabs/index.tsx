import dayjs from 'dayjs';
import { Tabs, TabsProps, Flex } from 'antd';
import { Typography, FontWeightEnum } from 'aelf-design';
import CommonCard from 'components/CommonCard';
import './styles.less';

const { Text } = Typography;

enum ProjectTabsLabel {
  DESCRIPTION = 'Description',
  IDO_INFORMATION = 'IDO Information',
}

export default function ProjectTabs() {
  const renderCardRow = ({
    key,
    label,
    value,
    isTime = false,
  }: {
    key: string | number;
    label: string;
    value: string;
    isTime?: boolean;
  }) => (
    <Flex key={key} className="card-row" justify="space-between" align="self-start" gap={16}>
      <Text>{label}</Text>
      <Text className="text-right white-space-pre-wrap" fontWeight={FontWeightEnum.Medium}>
        {isTime ? dayjs(value).format('DD-MM-YYYY\nH:mm [UTC] Z') : value}
      </Text>
    </Flex>
  );

  const items: TabsProps['items'] = [
    {
      key: ProjectTabsLabel.DESCRIPTION,
      label: ProjectTabsLabel.DESCRIPTION,
      children: (
        <Text className="white-space-pre-wrap">
          The DEFY team believes that in order to make P&E sustainable for the long term, it is critical to wrap the
          earning mechanics in a fun, highly engaging game which is rewarding beyond just playing to earn. Using a rich
          narrative and introducing novel new features into the game, DEFY is built for the long term. Furthermore, the
          DEFY game economy has been built to harness the creativity of the community, via the upcoming creators
          platform which will allow users to burn $DEFY tokens in order to forge and create new NFT game assets which
          may be sold via a native marketplace. By doing this, DEFY is creating a platform that has the ability to
          absorb and distribute value in multiple ways. Location based play and earn game DEFY fuses hyper casual code
          breaking gameplay, real world exploration and AR adventures The mobile game immerses players in a metaverse
          that bridges the virtual and physical worlds, DEFY fuses hyper casual code-breaking gameplay, with real world
          exploration and Augmented Reality (AR) adventures. DEFY Labs is proud to announce the completion of their
          US$3.5m seed round led by Animoca Brands, liveXThe Spartan Group, GameFi Ventures, BIXIN, Polygon Studios,
          Unanimous Capital, PathDAO andPlay It Forward DAO DEFY’s in-game economy has been designed with scale and
          longevity in mind. A dual currency model is combined with an extensive set of customisable tradable game
          assets as well as multiple active and passive earning mechanisms that can be leveraged by the players. A
          creators platform will be added for content creators to collaborate with DEFY and bring NFTs into Augmented
          Reality. DEFY intends to bring PvP into DEFY which creates huge longevity.
        </Text>
      ),
    },
    {
      key: ProjectTabsLabel.IDO_INFORMATION,
      label: ProjectTabsLabel.IDO_INFORMATION,
      children: (
        <div className="tabs-ido-information-wrapper flex">
          <CommonCard className="flex-1" title="Information">
            <div className="ido-information-card-content-wrapper">
              {[
                {
                  label: 'Sale Price',
                  value: '1 ELF = 1 PIGE',
                },
                {
                  label: 'Supply',
                  value: '5,000,000 PIGE',
                },
                {
                  label: 'Goal',
                  value: '500,000 ELF',
                },
                {
                  label: 'Token Unsold',
                  value: 'Return',
                },
              ].map(({ label, value }, index) =>
                renderCardRow({
                  key: index,
                  label,
                  value,
                }),
              )}
            </div>
          </CommonCard>
          <CommonCard className="ido-information-card-wrapper flex-1" title="Schedule">
            <div className="ido-information-card-content-wrapper">
              {[
                {
                  label: 'IDO Starts At',
                  value: '2024-01-12T07:05:57.7204243Z',
                },
                {
                  label: 'IDO Ends At',
                  value: '2024-01-12T07:05:57.7204243Z',
                },
                {
                  label: 'Token Distribution Time',
                  value: '2024-01-12T07:05:57.7204243Z',
                },
              ].map(({ label, value }, index) =>
                renderCardRow({
                  key: index,
                  label,
                  value,
                  isTime: true,
                }),
              )}
            </div>
          </CommonCard>
        </div>
      ),
    },
  ];

  return <Tabs size="small" items={items} />;
}
