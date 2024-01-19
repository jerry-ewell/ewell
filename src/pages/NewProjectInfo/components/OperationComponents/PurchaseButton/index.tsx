import { useState } from 'react';
import { Flex } from 'antd';
import { Button, FontWeightEnum, HashAddress, Modal, Typography } from 'aelf-design';
import ProjectLogo from 'components/ProjectLogo';
import SuccessModal from '../SuccessModal';
import { wallet } from 'assets/images';
import { tempInfo } from '../../temp';
import './styles.less';

const { Title, Text } = Typography;

export interface IPurchaseButtonProps {
  info: typeof tempInfo;
}

export default function PurchaseButton({ info }: IPurchaseButtonProps) {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setIsSubmitModalOpen(true);
        }}>
        Purchase with ELF
      </Button>
      <Modal
        wrapClassName="purchase-submit-modal-wrapper"
        title="Confirm Payment"
        footer={null}
        centered
        open={isSubmitModalOpen}
        onCancel={() => {
          setIsSubmitModalOpen(false);
        }}>
        <Flex vertical gap={24}>
          <Flex align="center" gap={12}>
            <ProjectLogo key={info.logoUrl} src={info.logoUrl} alt="logo" />
            <Title fontWeight={FontWeightEnum.Medium}>{info.projectName}</Title>
          </Flex>
          <Flex vertical gap={8}>
            <Flex justify="space-between">
              <Text>Contract Address</Text>
              <HashAddress
                className="hash-address-small"
                preLen={8}
                endLen={9}
                address="ELF_0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC_AELF"
              />
            </Flex>
            <Flex justify="space-between">
              <Text>My Allocation</Text>
              <Text>3 ELF</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>To Receive</Text>
              <Text>3 PIGE</Text>
            </Flex>
          </Flex>
          <Flex className="modal-box-data-wrapper" justify="space-between">
            <Flex align="center" gap={8}>
              <img src={wallet} alt="wallet" />
              <Text fontWeight={FontWeightEnum.Medium}>Balance</Text>
            </Flex>
            <Text fontWeight={FontWeightEnum.Medium}>10,000,000 ELF</Text>
          </Flex>
          <Flex vertical gap={8}>
            <Flex justify="space-between">
              <Text>Allocation</Text>
              <Flex gap={8} align="baseline">
                <Text>3 ELF</Text>
                <Text size="small">$ 1.86</Text>
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <Text>Estimated Transaction Fee</Text>
              <Flex gap={8} align="baseline">
                <Text>0.3604 ELF</Text>
                <Text size="small">$ 0.19</Text>
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <Text>Total</Text>
              <Flex gap={8} align="baseline">
                <Text fontWeight={FontWeightEnum.Medium}>3.3604 ELF</Text>
                <Text fontWeight={FontWeightEnum.Medium} size="small">
                  $ 2.04
                </Text>
              </Flex>
            </Flex>
          </Flex>
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
          title: 'Payment Success',
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
              amount: '3',
              symbol: 'ELF',
            },
          ],
          description: 'Congratulations, payment success!',
          boxData: {
            label: 'Contract Address',
            value: 'ELF_2Pew…W28l_AELF',
          },
        }}
      />
    </>
  );
}
