import { useState } from 'react';
import { Flex } from 'antd';
import { Button, Modal, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import SuccessModal from '../../../OperationComponents/SuccessModal';
import { emitLoading } from 'utils/events';

const { Text, Title } = Typography;

export default function CancelProjectButton() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = () => {
    setIsSubmitModalOpen(false);
    emitLoading(true, { text: 'Processing on the blockchain...' });
    setTimeout(() => {
      emitLoading(false);
      setIsSuccessModalOpen(true);
    }, 1000);
  };

  return (
    <>
      <Button danger onClick={() => setIsConfirmModalOpen(true)}>
        Closure Of Project
      </Button>
      <Modal
        title="Closure of Project"
        footer={null}
        centered
        open={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}>
        <Flex vertical gap={24}>
          <Text className="text-center">
            You are closing project <Text fontWeight={FontWeightEnum.Medium}>“Citizen Conflict”</Text>. After the
            project is closed, you will not receive the funds raised, but only the full amount of Token.
          </Text>
          <Flex gap={16}>
            <Button className="flex-1" onClick={() => setIsConfirmModalOpen(false)}>
              Back
            </Button>
            <Button
              className="flex-1"
              type="primary"
              danger
              onClick={() => {
                setIsConfirmModalOpen(false);
                setIsSubmitModalOpen(true);
              }}>
              Closure and Claim
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <Modal
        title="Claim Token"
        footer={null}
        centered
        open={isSubmitModalOpen}
        onCancel={() => setIsSubmitModalOpen(false)}>
        <Flex vertical gap={24}>
          <Text>
            Click to extract ELF from EWELL contract. If you have any token left, it will be withdrawn as well.
          </Text>
          <Flex gap={8} justify="center" align="baseline">
            <Title level={4} fontWeight={FontWeightEnum.Medium}>
              80
            </Title>
            <Title fontWeight={FontWeightEnum.Medium}>PIGE</Title>
          </Flex>
          <Flex className="modal-box-data-wrapper" justify="space-between" align="center">
            <Text className="half-width">Address</Text>
            <HashAddress
              className="half-width hash-address-small"
              preLen={8}
              endLen={9}
              address="ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF"
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <Text>Estimated Transaction Fee</Text>
            <Flex gap={8} justify="flex-end" align="baseline">
              <Text>0.3604 ELF</Text>
              <Text size="small">$ 0.19</Text>
            </Flex>
          </Flex>
          <Flex justify="center">
            <Button className="modal-single-button" type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <SuccessModal
        modalProps={{
          title: 'Closure and Claim Success',
          open: isSuccessModalOpen,
          onCancel: () => {
            setIsSuccessModalOpen(false);
          },
          onOk: () => {
            setIsSuccessModalOpen(false);
          },
        }}
        data={{
          amountList: [
            {
              amount: '80',
              symbol: 'PIGE',
            },
          ],
          description: 'Congratulations, transfer success!',
          boxData: {
            label: 'Transaction ID',
            value: 'ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF',
          },
        }}
      />
    </>
  );
}
