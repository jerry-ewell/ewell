import { Flex } from 'antd';
import { Button } from 'aelf-design';
import JoinCard from '../JoinCard';
import ProjectManagementCard from '../ProjectManagementCard';
import { edit, login } from 'assets/images';
import { tempInfo } from '../temp';
import './styles.less';

export default function ActionCard() {
  return (
    <Flex className="action-card-wrapper flex-1" vertical gap={24}>
      <Button className="edit-button" icon={<img src={edit} alt="edit" />}>
        Edit Project Information
      </Button>
      <JoinCard info={tempInfo} />
      {!tempInfo.isLogin && (
        <Button className="login-button" type="primary" icon={<img src={login} alt="login" />}>
          Log in to view details
        </Button>
      )}
      {/* undetermined */}
      <ProjectManagementCard />
    </Flex>
  );
}
