import { useState } from 'react';
import { Flex } from 'antd';
import { Button, Typography, FontWeightEnum, Modal, HashAddress } from 'aelf-design';
import SuccessModal from '../SuccessModal';
import './styles.less';

const { Text } = Typography;

export default function RevokeInvestmentButton() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  return (
    <>
      <Text
        className="revoke-investment-button cursor-pointer"
        fontWeight={FontWeightEnum.Medium}
        onClick={() => setIsConfirmModalOpen(true)}>
        Revoke Investment
      </Text>
      <Modal
        title="Revoke Investment"
        footer={null}
        centered
        open={isConfirmModalOpen}
        onCancel={() => {
          setIsConfirmModalOpen(false);
        }}>
        <Flex vertical gap={24}>
          <Text>
            Are you sure you want to cancel your investment? Withdrawal of investment will be charged 10% of your ELF as
            liquidated damages and the remaining ELF will be refunded after deduction of Gas.
          </Text>
          <Flex gap={16}>
            <Button className="flex-1" onClick={() => setIsConfirmModalOpen(false)}>
              Back
            </Button>
            <Button
              className="flex-1"
              type="primary"
              onClick={() => {
                setIsConfirmModalOpen(false);
                setIsSubmitModalOpen(true);
              }}>
              Revoke Investment
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <Modal
        title="Revoke Investment"
        footer={null}
        centered
        open={isSubmitModalOpen}
        onCancel={() => {
          setIsSubmitModalOpen(false);
        }}>
        <Flex vertical gap={24}>
          <Text>After clicking “Submit”, EWELL transfer ELF to the designated account.</Text>
          <Flex justify="space-between">
            <Text>Address</Text>
            <HashAddress
              className="hash-address-small"
              preLen={8}
              endLen={9}
              address="ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF"
            />
          </Flex>
          <Flex className="modal-box-data-wrapper error-border" justify="space-between">
            <Text className="error-text" fontWeight={FontWeightEnum.Medium}>
              Revoke
            </Text>
            <Flex gap={8} align="baseline">
              <Text className="error-text" fontWeight={FontWeightEnum.Medium}>
                3 ELF
              </Text>
              <Text className="error-text" fontWeight={FontWeightEnum.Medium} size="small">
                $ 1.86
              </Text>
            </Flex>
          </Flex>
          <Flex vertical gap={8}>
            <Flex justify="space-between">
              <Text>Estimated Transaction Fee</Text>
              <Flex gap={8} align="baseline">
                <Text>0.3604 ELF</Text>
                <Text size="small">$ 0.19</Text>
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <Text>Purchase Quantity</Text>
              <Flex gap={8} align="baseline">
                <Text>0.3604 ELF</Text>
                <Text size="small">$ 0.19</Text>
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <Text>Final</Text>
              <Flex gap={8} align="baseline">
                <Text>3.3604 ELF</Text>
                <Text size="small">$ 2.04</Text>
              </Flex>
            </Flex>
          </Flex>
          <Text className="error-text text-center" fontWeight={FontWeightEnum.Medium}>
            Not enough tokens to pay for the Gas!
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
          title: 'Revoke Successfully',
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
              amount: '3.3604',
              symbol: 'ELF',
            },
          ],
          description: 'Congratulations, your token has been revoked successfully!',
          boxData: {
            label: 'Transaction ID',
            value: 'ELF_0x00…14dC_AELF',
          },
        }}
      />
    </>
  );
}
