import CommonCard from 'components/CommonCard';
import { arrow } from 'assets/images';
import './styles.less';

export default function ProjectManagementCard() {
  return (
    <CommonCard
      className="project-management-card-wrapper"
      title="Project Management"
      extra={<div className="more cursor-pointer">More...</div>}>
      <div className="management-list-item flex-between-center cursor-pointer">
        <span className="label">Add Allowlist Users</span>
        <img alt="arrow" src={arrow} />
      </div>
      <div className="management-list-item flex-between-center cursor-pointer">
        <span className="label">Participants List</span>
        <img alt="arrow" src={arrow} />
      </div>
    </CommonCard>
  );
}
