import { useState } from 'react';
import { Flex } from 'antd';
import { Button, Modal, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import { success } from 'assets/images';
import { emitLoading } from 'utils/events';
import './styles.less';

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
        className="cancel-project-modal"
        title="Claim Token"
        footer={null}
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
          <Flex className="box-data-wrapper" justify="space-between" align="center">
            <Text className="box-data-label">Address</Text>
            <HashAddress
              className="box-data-value"
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
            <Button className="submit-button" type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <Modal
        className="cancel-project-success-modal"
        title="Closure and Claim Success"
        footer={null}
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}>
        <Flex vertical gap={24}>
          <Flex vertical gap={8}>
            <Flex justify="center">
              <img className="success-icon" src={success} alt="success" />
            </Flex>
            <Flex gap={8} justify="center" align="baseline">
              <Title level={4} fontWeight={FontWeightEnum.Medium}>
                80
              </Title>
              <Title fontWeight={FontWeightEnum.Medium}>PIGE</Title>
            </Flex>
            <Text className="text-center" fontWeight={FontWeightEnum.Medium}>
              Congratulations, transfer success!
            </Text>
          </Flex>
          <Flex className="box-data-wrapper" justify="space-between" align="center">
            <Text className="box-data-label">Transaction ID</Text>
            <HashAddress
              className="box-data-value"
              preLen={8}
              endLen={9}
              address="ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF"
            />
          </Flex>
          <Flex justify="center">
            <Button className="ok-button" type="primary" onClick={() => setIsSuccessModalOpen(false)}>
              OK
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
