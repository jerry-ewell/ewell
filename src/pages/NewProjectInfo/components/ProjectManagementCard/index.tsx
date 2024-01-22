import { useState } from 'react';
import { Flex, Switch } from 'antd';
import { Button, Typography, FontWeightEnum } from 'aelf-design';
import CommonCard from 'components/CommonCard';
import WhitelistTasksButton from './components/WhitelistTasksButton';
import CancelProjectButton from './components/CancelProjectButton';
import CreatorClaimTokenButton from '../OperationComponents/CreatorClaimTokenButton';
import { useWallet } from 'contexts/useWallet/hooks';
import { IProjectInfo } from 'types/project';
import { NETWORK_CONFIG } from 'constants/network';
import UpdateWhitelistUsersButton from 'components/UpdateWhitelistUsersButton';
import { UpdateType } from 'components/UpdateWhitelistUsersButton/types';
import './styles.less';

const { Text } = Typography;

interface IProjectManagementCardProps {
  projectInfo?: IProjectInfo;
}

export default function ProjectManagementCard({ projectInfo }: IProjectManagementCardProps) {
  const { wallet, checkManagerSyncState } = useWallet();

  const [isWhitelistSwitchLoading, setIsWhitelistSwitchLoading] = useState(false);

  const handleWhitelistSwitchChange = async (checked: boolean) => {
    setIsWhitelistSwitchLoading(true);
    const isManagerSynced = await checkManagerSyncState();
    if (!isManagerSynced) {
      setIsWhitelistSwitchLoading(false);
      // TODO: show tips modal
      return;
    }
    try {
      const txResult = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.whitelistContractAddress,
        methodName: projectInfo?.isEnableWhitelist ? 'DisableWhitelist' : 'EnableWhitelist',
        args: projectInfo?.whitelistId,
      });
      console.log('txResult', txResult);
      // TODO: refresh isEnableWhitelist
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsWhitelistSwitchLoading(false);
    }
  };

  return (
    <CommonCard
      className="project-management-card-wrapper"
      contentClassName="project-management-card-content"
      title="Project Management">
      <Flex vertical gap={12}>
        <Text fontWeight={FontWeightEnum.Medium}>Participants</Text>
        <Button>View Participants List</Button>
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
            />
            <Button>Whitelist Users</Button>
            <UpdateWhitelistUsersButton
              buttonProps={{
                children: 'Add Whitelisted Users',
              }}
              updateType={UpdateType.ADD}
              whitelistId={projectInfo?.whitelistId}
              onSuccess={() => {}}
            />
            <UpdateWhitelistUsersButton
              buttonProps={{
                children: 'Remove Whitelisted Users',
              }}
              updateType={UpdateType.REMOVE}
              whitelistId={projectInfo?.whitelistId}
              onSuccess={() => {}}
            />
          </>
        )}
      </Flex>
      <div className="divider" />
      <Flex vertical gap={12}>
        <Text fontWeight={FontWeightEnum.Medium}>Project</Text>
        <CancelProjectButton projectInfo={projectInfo} />
        <CreatorClaimTokenButton projectInfo={projectInfo} />
      </Flex>
    </CommonCard>
  );
}
