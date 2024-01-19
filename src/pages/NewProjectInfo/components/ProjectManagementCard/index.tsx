import { useState } from 'react';
import { Flex, Switch } from 'antd';
import { Button, Typography, FontWeightEnum } from 'aelf-design';
import CommonCard from 'components/CommonCard';
import WhitelistTasksButton from './components/WhitelistTasksButton';
import CancelProjectButton from './components/CancelProjectButton';
import './styles.less';

const { Text } = Typography;

export default function ProjectManagementCard() {
  const [isEnableWhitelist, setIsEnableWhitelist] = useState(true);

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
            <Text>{isEnableWhitelist ? 'Enable' : 'Disable'}</Text>
            <Switch size="small" checked={isEnableWhitelist} onChange={(checked) => setIsEnableWhitelist(checked)} />
          </Flex>
        </Flex>
        {isEnableWhitelist && (
          <>
            <WhitelistTasksButton />
            <Button>Whitelist Users</Button>
            <Button>Add Whitelisted Users</Button>
            <Button>Remove Whitelisted Users</Button>
          </>
        )}
      </Flex>
      <div className="divider" />
      <Flex vertical gap={12}>
        <Text fontWeight={FontWeightEnum.Medium}>Project</Text>
        <CancelProjectButton />
      </Flex>
    </CommonCard>
  );
}
