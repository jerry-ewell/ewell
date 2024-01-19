import { Button } from 'antd';
import JoinCard from '../JoinCard';
import ProjectManagementCard from '../ProjectManagementCard';
import { tempInfo } from '../temp';
import './styles.less';

export default function ActionCard() {
  return (
    <div className="action-card-wrapper flex-column">
      <JoinCard info={tempInfo} />
      {!tempInfo.isLogin && <Button className="login-button">Log in to view details</Button>}
      {/* undetermined */}
      <ProjectManagementCard />
    </div>
  );
}
