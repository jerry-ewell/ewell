import { Tabs, TabsProps } from 'antd';
import CommonCard from 'components/CommonCard';
import './styles.less';

enum ProjectTabsLabel {
  DESCRIPTION = 'Description',
  IDO_INFORMATION = 'IDO Information',
}

export default function ProjectTabs({ description }: { description?: string; IDOInformation?: {} }) {
  const items: TabsProps['items'] = [
    {
      key: ProjectTabsLabel.DESCRIPTION,
      label: ProjectTabsLabel.DESCRIPTION,
      children: (
        <div className="tabs-description-wrapper">
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
        </div>
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
              ].map(({ label, value }, index) => (
                <div key={index} className="ido-information-card-line flex-between-center">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </CommonCard>
          <CommonCard className="ido-information-card-wrapper flex-1" title="Schedule">
            <div className="ido-information-card-content-wrapper">
              {[
                {
                  label: 'IDO Starts At',
                  value: '23-11-2023 3:00 UTC',
                },
                {
                  label: 'IDO Ends At',
                  value: '23-11-2023 20:00 UTC',
                },
                {
                  label: 'Token Distribution Time',
                  value: '23-11-2023 8:00 UTC',
                },
              ].map(({ label, value }, index) => (
                <div key={index} className="ido-information-card-line flex-between-center">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </CommonCard>
        </div>
      ),
    },
  ];

  return <Tabs items={items} />;
}
