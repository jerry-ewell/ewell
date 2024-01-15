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
      children: <div className="tabs-description-wrapper">{description}</div>,
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
