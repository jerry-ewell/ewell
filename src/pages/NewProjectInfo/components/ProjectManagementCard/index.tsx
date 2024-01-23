import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Flex, Switch, message } from 'antd';
import { Button, Typography, FontWeightEnum } from 'aelf-design';
import CommonCard from 'components/CommonCard';
import WhitelistTasksButton from './components/WhitelistTasksButton';
import CancelProjectButton from './components/CancelProjectButton';
import CreatorClaimTokenButton from '../OperationComponents/CreatorClaimTokenButton';
import { useWallet } from 'contexts/useWallet/hooks';
import { IProjectInfo, ProjectStatus } from 'types/project';
import { NETWORK_CONFIG } from 'constants/network';
import UpdateWhitelistUsersButton from 'components/UpdateWhitelistUsersButton';
import { UpdateType } from 'components/UpdateWhitelistUsersButton/types';
import './styles.less';
import { emitSyncTipsModal } from 'utils/events';

const { Text } = Typography;

interface IProjectManagementCardProps {
  projectInfo?: IProjectInfo;
}

export default function ProjectManagementCard({ projectInfo }: IProjectManagementCardProps) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { wallet, checkManagerSyncState } = useWallet();
  const [messageApi, contextHolder] = message.useMessage();

  const [isWhitelistSwitchLoading, setIsWhitelistSwitchLoading] = useState(false);

  const canEdit = useMemo(() => {
    return projectInfo?.status === ProjectStatus.UPCOMING || projectInfo?.status === ProjectStatus.PARTICIPATORY;
  }, [projectInfo?.status]);

  const showCancelProjectButton = useMemo(() => {
    return (
      projectInfo?.status === ProjectStatus.UPCOMING ||
      projectInfo?.status === ProjectStatus.PARTICIPATORY ||
      projectInfo?.status === ProjectStatus.UNLOCKED
    );
  }, [projectInfo?.status]);

  const showCreatorClaimTokenButton = useMemo(() => {
    return projectInfo?.status === ProjectStatus.ENDED && !projectInfo?.isWithdraw;
  }, [projectInfo?.status, projectInfo?.isWithdraw]);

  const handleWhitelistSwitchChange = async (checked: boolean) => {
    setIsWhitelistSwitchLoading(true);
    const isManagerSynced = await checkManagerSyncState();
    if (!isManagerSynced) {
      setIsWhitelistSwitchLoading(false);
      emitSyncTipsModal(true);
      return;
    }
    try {
      const result = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.whitelistContractAddress,
        methodName: checked ? 'DisableWhitelist' : 'EnableWhitelist',
        args: projectInfo?.whitelistId,
      });
      console.log('whitelist result', result);
      messageApi.open({
        type: 'success',
        content: checked ? 'Disable whitelist successfully' : 'Enable whitelist successfully',
      });
    } catch (error: any) {
      console.log('error', error);
      messageApi.open({
        type: 'error',
        content: error?.message || (checked ? 'Disable whitelist failed' : 'Enable whitelist failed'),
      });
    } finally {
      setIsWhitelistSwitchLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <CommonCard
        className="project-management-card-wrapper"
        contentClassName="project-management-card-content"
        title="Project Management">
        <Flex vertical gap={12}>
          <Text fontWeight={FontWeightEnum.Medium}>Participants</Text>
          <Button
            onClick={() => {
              navigate(`/participant-list/${projectId}`);
            }}>
            View Participants List
          </Button>
        </Flex>
        <div className="divider" />
        <Flex vertical gap={12}>
          <Flex gap={8} justify="space-between">
            <Text fontWeight={FontWeightEnum.Medium}>Whitelist</Text>
            <Flex gap={8} align="center">
              <Text>{projectInfo?.isEnableWhitelist ? 'Enable' : 'Disable'}</Text>
              <Switch
                size="small"
                loading={isWhitelistSwitchLoading}
                disabled={!canEdit}
                checked={projectInfo?.isEnableWhitelist}
                onChange={handleWhitelistSwitchChange}
              />
            </Flex>
          </Flex>
          {projectInfo?.isEnableWhitelist && (
            <>
              <WhitelistTasksButton
                whitelistId={projectInfo?.whitelistId}
                whitelistTasksUrl={projectInfo?.whitelistInfo?.url}
                disabled={!canEdit}
              />
              <Button
                onClick={() => {
                  navigate(`/whitelist-users/${projectInfo?.whitelistId}`);
                }}>
                Whitelist Users
              </Button>
              <UpdateWhitelistUsersButton
                buttonProps={{
                  children: 'Add Whitelisted Users',
                  disabled: !canEdit,
                }}
                updateType={UpdateType.ADD}
                whitelistId={projectInfo?.whitelistId}
                onSuccess={() => {}}
              />
              <UpdateWhitelistUsersButton
                buttonProps={{
                  children: 'Remove Whitelisted Users',
                  disabled: !canEdit,
                }}
                updateType={UpdateType.REMOVE}
                whitelistId={projectInfo?.whitelistId}
                onSuccess={() => {}}
              />
            </>
          )}
        </Flex>
        {(showCancelProjectButton || showCreatorClaimTokenButton) && (
          <>
            <div className="divider" />
            <Flex vertical gap={12}>
              <Text fontWeight={FontWeightEnum.Medium}>Project</Text>
              {showCancelProjectButton && <CancelProjectButton projectInfo={projectInfo} />}
              {showCreatorClaimTokenButton && <CreatorClaimTokenButton projectInfo={projectInfo} />}
            </Flex>
          </>
        )}
      </CommonCard>
    </>
  );
}
