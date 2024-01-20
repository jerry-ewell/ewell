import { useState, useEffect } from 'react';
import { Flex } from 'antd';
import { Button, Modal, Typography, Input } from 'aelf-design';
import { success } from 'assets/images';
import './styles.less';

interface IWhitelistTasksButtonProps {
  isEdit?: boolean;
  whitelistTasksUrl?: string;
}

const { Text } = Typography;

export default function WhitelistTasksButton({ isEdit, whitelistTasksUrl }: IWhitelistTasksButtonProps) {
  const [isWhitelistTasksModalOpen, setIsWhitelistTasksModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');

  useEffect(() => {
    if (whitelistTasksUrl) {
      setUrlInputValue(whitelistTasksUrl);
    }
  }, [whitelistTasksUrl]);

  return (
    <>
      <Button onClick={() => setIsWhitelistTasksModalOpen(true)}>Whitelist Tasks</Button>
      <Modal
        title={`${isEdit ? 'Edit' : 'Open'} Whitelist Tasks`}
        footer={null}
        centered
        open={isWhitelistTasksModalOpen}
        onCancel={() => setIsWhitelistTasksModalOpen(false)}>
        <Flex vertical gap={24}>
          <Flex vertical gap={12}>
            <Text className="text-center">
              Please enter an accessible link that users can click on to view project whitelisting tasks.
            </Text>
            <Input placeholder="placeholder" value={urlInputValue} onChange={(e) => setUrlInputValue(e.target.value)} />
          </Flex>
          <Flex gap={16}>
            <Button className="flex-1" onClick={() => setIsWhitelistTasksModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              type="primary"
              disabled={!urlInputValue}
              onClick={() => {
                setIsWhitelistTasksModalOpen(false);
                setIsSuccessModalOpen(true);
              }}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <Modal
        title={`${isEdit ? 'Edited' : 'Opened'} Successfully`}
        footer={null}
        centered
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}>
        <Flex vertical gap={24} align="center">
          <Flex vertical gap={8} align="center">
            <img className="success-icon" src={success} alt="success" />
            <Text>Whitelist tasks opened successfully</Text>
          </Flex>
          <Button
            className="whitelist-tasks-update-success-button"
            type="primary"
            onClick={() => setIsSuccessModalOpen(false)}>
            OK
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
