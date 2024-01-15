import { useMemo } from 'react';
import ProjectLogo from 'components/ProjectLogo';
import CommonLink from 'components/CommonLink';
import IconFont from 'components/IconFont';
import ProjectTabs from '../ProjectTabs';
import { InfoIcons } from 'constants/iconfont';
import { useProjectInfo } from 'contexts/useProjectInfo';
import { getHref } from 'utils';
import './styles.less';

export default function InfoWrapper() {
  const [{ idoInfo }] = useProjectInfo();

  const additionalInfo = useMemo(() => idoInfo?.additionalInfo, [idoInfo?.additionalInfo]);

  return (
    <div className="info-wrapper flex flex-1">
      <ProjectLogo
        key={additionalInfo?.logoUrl}
        src={additionalInfo?.logoUrl}
        alt={idoInfo?.crowdFundingIssueToken?.symbol}
      />
      <div className="info flex-1 flex-column">
        <div className="info-header flex-column">
          <div className="project-name">{idoInfo?.crowdFundingIssueToken?.name ?? '--'}</div>
          <div className="media-wrapper flex-row-center flex-wrap">
            {Object.entries(additionalInfo ?? {}).map(([key, value]) => {
              const type = InfoIcons[key as keyof typeof InfoIcons];
              if (type) {
                return (
                  <CommonLink
                    className="media-item"
                    href={getHref(value as string)}
                    key={type as string}
                    showIcon={false}>
                    <IconFont type={type} />
                  </CommonLink>
                );
              }
            })}
          </div>
          {!!additionalInfo?.description && <div className="project-summary">{additionalInfo.description}</div>}
        </div>
        <div className="swiper-wrapper">swiper</div>
        <ProjectTabs />
      </div>
    </div>
  );
}
