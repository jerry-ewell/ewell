import ActionCard from './components/ActionCard';
import InfoWrapper from './components/InfoWrapper';
import BaseBreadcrumb from 'components/BaseBreadcrumb';
import { useMobile } from 'contexts/useStore/hooks';
import './styles.less';

export default function ProjectInfo() {
  const isMobile = useMobile();

  return (
    <div className="common-page-1360 min-height-container project-info-wrapper">
      <BaseBreadcrumb />
      <div className="flex project-info-content">
        <InfoWrapper />
        {!isMobile && <ActionCard />}
      </div>
    </div>
  );
}
