import { Flex } from 'antd';
import { Button } from 'aelf-design';
import JoinCard from '../JoinCard';
import ProjectManagementCard from '../ProjectManagementCard';
import { edit, login as loginIcon } from 'assets/images';
import { useWallet } from 'contexts/useWallet/hooks';
import { IProjectInfo } from 'types/project';
import { tempInfo } from '../temp';
import './styles.less';

interface IActionCardProps {
  projectInfo: IProjectInfo;
}

export default function ActionCard({ projectInfo }: IActionCardProps) {
  const { login, wallet } = useWallet();
  const isLogin = !!wallet;

  return (
    <Flex className="action-card-wrapper flex-1" vertical gap={24}>
      <Button className="edit-button" icon={<img src={edit} alt="edit" />}>
        Edit Project Information
      </Button>
      <JoinCard projectInfo={projectInfo} />
      {!isLogin && (
        <Button
          className="login-button"
          type="primary"
          icon={<img src={loginIcon} alt="login" />}
          onClick={() => login()}>
          Log in to view details
        </Button>
      )}
      {!!isLogin && tempInfo.isCreator && <ProjectManagementCard />}
    </Flex>
  );
}
