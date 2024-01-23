import { Flex } from 'antd';
import { Button } from 'aelf-design';
import JoinCard from '../JoinCard';
import ProjectManagementCard from '../ProjectManagementCard';
import { edit, login as loginIcon } from 'assets/images';
import { useWallet } from 'contexts/useWallet/hooks';
import { IProjectInfo } from 'types/project';
import './styles.less';
import { useMemo } from 'react';

interface IActionCardProps {
  projectInfo: IProjectInfo;
  isPreview?: boolean;
  handleRefresh?: () => void;
}

export default function ActionCard({ projectInfo, isPreview, handleRefresh }: IActionCardProps) {
  const { login, wallet } = useWallet();
  const isLogin = useMemo(() => !!wallet, [wallet]);
  const canEdit = useMemo(() => {
    return !!isLogin && projectInfo?.isCreator && !isPreview;
  }, [isLogin, isPreview, projectInfo?.isCreator]);

  return (
    <Flex className="action-card-wrapper flex-1" vertical gap={24}>
      {canEdit && (
        <Button className="edit-button" icon={<img src={edit} alt="edit" />}>
          Edit Project Information
        </Button>
      )}
      <JoinCard projectInfo={projectInfo} isPreview={isPreview} handleRefresh={handleRefresh} />
      {!isLogin && (
        <Button
          className="login-button"
          type="primary"
          icon={<img src={loginIcon} alt="login" />}
          onClick={() => login()}>
          Log in to view details
        </Button>
      )}
      {canEdit && <ProjectManagementCard projectInfo={projectInfo} />}
    </Flex>
  );
}
