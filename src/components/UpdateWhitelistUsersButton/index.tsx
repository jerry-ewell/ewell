import { useState } from 'react';
import { Flex } from 'antd';
import { Button, IButtonProps, Modal } from 'aelf-design';
import UpdateModal from './UpdateModal';
import { emitLoading } from 'utils/events';
import { success } from 'assets/images';
import './styles.less';

interface IUpdateWhitelistUsersButtonProps {
  buttonProps: IButtonProps;
  modalTitle: string;
}

export default function UpdateWhitelistUsers({ buttonProps, modalTitle }: IUpdateWhitelistUsersButtonProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdateSuccessModalOpen, setIsUpdateSuccessModalOpen] = useState(false);

  return (
    <>
      <Button {...buttonProps} onClick={() => setIsUpdateModalOpen(true)} />
      <UpdateModal
        modalTitle={modalTitle}
        modalOpen={isUpdateModalOpen}
        onModalCancel={() => setIsUpdateModalOpen(false)}
        onModalSubmit={() => {
          setIsUpdateModalOpen(false);
          emitLoading(true);
          setTimeout(() => {
            emitLoading(false);
            setIsUpdateSuccessModalOpen(true);
          }, 1000);
        }}
      />
      <Modal
        wrapClassName="whitelist-users-update-success-modal"
        title={modalTitle}
        footer={null}
        open={isUpdateSuccessModalOpen}>
        <Flex vertical gap={24} align="center">
          <Flex vertical gap={8} align="center">
            <img className="success-icon" src={success} alt="success" />
            <span>Successfully removed 521 users to the whitelist</span>
          </Flex>
          <Button className="ok-button" onClick={() => setIsUpdateSuccessModalOpen(false)}>
            OK
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
