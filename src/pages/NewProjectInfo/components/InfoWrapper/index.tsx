import ProjectLogo from 'components/ProjectLogo';
import CommonLink from 'components/CommonLink';
import IconFont from 'components/IconFont';
import ProjectTabs from '../ProjectTabs';
import { InfoIcons } from 'constants/iconfont';
import { getHref } from 'utils';
import './styles.less';

export default function InfoWrapper() {
  return (
    <div className="info-wrapper flex flex-1">
      <ProjectLogo src="" alt="logo" />
      <div className="info flex-1 flex-column">
        <div className="info-header flex-column">
          <div className="project-name">Citizen Conflict</div>
          <div className="media-wrapper flex-row-center flex-wrap">
            {[].map(([key, value]) => {
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
          <div className="project-summary">
            The mobile game immerses players in a metaverse that bridges the virtual and physical worlds, DEFY fuses
            hyper casual code-breaking gameplay, with real world exploration and Augmented Reality (AR) adventures.
          </div>
        </div>
        <div className="swiper-wrapper">swiper</div>
        <ProjectTabs />
      </div>
    </div>
  );
}
