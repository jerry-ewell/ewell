import { useState } from 'react';
import { Flex } from 'antd';
import { Button, IButtonProps, Modal, Typography } from 'aelf-design';
import UpdateModal from './UpdateModal';
import AddressValidationModal from './AddressValidationModal';
import { emitLoading } from 'utils/events';
import { success } from 'assets/images';
import { UpdateType } from './types';
import './styles.less';

const { Text } = Typography;

interface IUpdateWhitelistUsersButtonProps {
  buttonProps: IButtonProps;
  updateType: UpdateType;
}

export default function UpdateWhitelistUsers({ buttonProps, updateType }: IUpdateWhitelistUsersButtonProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddressValidationModalOpen, setIsAddressValidationModalOpen] = useState(false);
  const [isUpdateSuccessModalOpen, setIsUpdateSuccessModalOpen] = useState(false);

  return (
    <>
      <Button {...buttonProps} onClick={() => setIsUpdateModalOpen(true)} />
      <UpdateModal
        updateType={updateType}
        modalOpen={isUpdateModalOpen}
        onModalCancel={() => setIsUpdateModalOpen(false)}
        onModalSubmit={() => {
          setIsUpdateModalOpen(false);
          emitLoading(true);
          setTimeout(() => {
            emitLoading(false);
            setIsAddressValidationModalOpen(true);
          }, 1000);
        }}
      />
      <AddressValidationModal
        updateType={updateType}
        modalOpen={isAddressValidationModalOpen}
        onModalCancel={() => setIsAddressValidationModalOpen(false)}
        onModalConfirm={() => {
          setIsAddressValidationModalOpen(false);
          setIsUpdateSuccessModalOpen(true);
        }}
      />
      <Modal
        wrapClassName="whitelist-users-update-success-modal"
        title={`${updateType === UpdateType.ADD ? 'Added' : 'Removed'} Successfully`}
        footer={null}
        centered
        open={isUpdateSuccessModalOpen}>
        <Flex vertical gap={24} align="center">
          <Flex vertical gap={8} align="center">
            <img className="success-icon" src={success} alt="success" />
            <Text className="text-center">
              Successfully {updateType === UpdateType.ADD ? 'added' : 'removed'} 90 users to the whitelist
            </Text>
          </Flex>
          <Button className="modal-single-button" type="primary" onClick={() => setIsUpdateSuccessModalOpen(false)}>
            OK
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
