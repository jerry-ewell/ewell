import ActionCard from './newComponents/ActionCard';
import InfoWrapper from './newComponents/InfoWrapper';
import './styles.less';
import { ProjectInfoUpdater } from './hooks/Updater';
import BaseBreadcrumb from 'components/BaseBreadcrumb';
import { useMobile } from 'contexts/useStore/hooks';

export default function ProjectInfo() {
  const isMobile = useMobile();

  return (
    <>
      <ProjectInfoUpdater />
      <div className="common-page1 min-height-container project-info-wrapper">
        <BaseBreadcrumb />
        <div className="flex project-info-content">
          <InfoWrapper />
          {!isMobile && <ActionCard />}
        </div>
      </div>
    </>
  );
}
