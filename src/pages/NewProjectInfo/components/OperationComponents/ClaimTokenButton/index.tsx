import { useState } from 'react';
import { Flex } from 'antd';
import { Button, Modal, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import SuccessModal from '../SuccessModal';

const { Title, Text } = Typography;

export default function ClaimTokenButton() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setIsSubmitModalOpen(true);
        }}>
        Claim Token
      </Button>
      <Modal
        title="Claim Token"
        footer={null}
        centered
        open={isSubmitModalOpen}
        onCancel={() => {
          setIsSubmitModalOpen(false);
        }}>
        <Flex vertical gap={24}>
          <Text>After clicking “Submit”, EWELL transfer ELF to the designated account.</Text>
          <Flex justify="center" align="baseline" gap={8}>
            <Title fontWeight={FontWeightEnum.Medium} level={4}>
              300
            </Title>
            <Title fontWeight={FontWeightEnum.Medium}>PIGE</Title>
          </Flex>
          <Flex className="modal-box-data-wrapper" justify="space-between">
            <Text>Address</Text>
            <HashAddress
              className="hash-address-small"
              preLen={8}
              endLen={9}
              address="ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF"
            />
          </Flex>
          <Flex justify="space-between">
            <Text className="error-text">Estimated Transaction Fee</Text>
            <Flex gap={8} align="baseline">
              <Text className="error-text">0.3604 ELF</Text>
              <Text className="error-text" size="small">
                $ 0.19
              </Text>
            </Flex>
          </Flex>
          <Text className="error-text text-center" fontWeight={FontWeightEnum.Medium}>
            Not enough token in the wallet
          </Text>
          <Flex justify="center">
            <Button
              className="modal-single-button"
              type="primary"
              onClick={() => {
                setIsSubmitModalOpen(false);
                setIsSuccessModalOpen(true);
              }}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <SuccessModal
        modalProps={{
          title: 'Claimed Successfully',
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
              amount: '30,000',
              symbol: 'PIGE',
            },
          ],
          description: 'Congratulations, claimed successfully!',
          boxData: {
            label: 'Transaction ID',
            value: 'ELF_0x00…14dC_AELF',
          },
        }}
      />
    </>
  );
}
