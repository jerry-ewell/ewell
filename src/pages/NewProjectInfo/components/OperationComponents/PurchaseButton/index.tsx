import { useState } from 'react';
import { Button, Modal, Flex } from 'antd';
import ProjectLogo from 'components/ProjectLogo';
import SuccessModal from '../SuccessModal';
import { tempInfo } from '../../temp';
import './styles.less';

export interface IPurchaseButtonProps {
  info: typeof tempInfo;
}

export default function PurchaseButton({ info }: IPurchaseButtonProps) {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setIsSubmitModalOpen(true);
        }}>
        Purchase with ELF
      </Button>
      <Modal
        wrapClassName="purchase-submit-modal-wrapper"
        title="Confirm Payment"
        footer={null}
        open={isSubmitModalOpen}
        onCancel={() => {
          setIsSubmitModalOpen(false);
        }}>
        <Flex vertical gap={24}>
          <Flex align="center" gap={12}>
            <ProjectLogo key={info.logoUrl} src={info.logoUrl} alt="logo" />
            <span className="project-name">{info.projectName}</span>
          </Flex>
          <Flex vertical gap={8}>
            <Flex justify="space-between">
              <span>Contract Address</span>
              <span>{info.contractAddress}</span>
            </Flex>
            <Flex justify="space-between">
              <span>My Allocation</span>
              <span>
                {info.myAllocation.amount} {info.myAllocation.symbol}
              </span>
            </Flex>
            <Flex justify="space-between">
              <span>To Receive</span>
              <span>
                {info.myAllocation.amount} {info.myAllocation.symbol}
              </span>
            </Flex>
          </Flex>
          <Flex className="balance-wrapper" justify="space-between">
            <span>Balance</span>
            <span>10,000,000 ELF</span>
          </Flex>
          <Flex vertical gap={8}>
            <Flex justify="space-between">
              <span>Allocation</span>
              <Flex gap={8}>
                <span>3 ELF</span>
                <span>$ 1.86</span>
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <span>Estimated Transaction Fee</span>
              <Flex gap={8}>
                <span>0.3604 ELF</span>
                <span>$ 0.19</span>
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <span>Total</span>
              <Flex gap={8}>
                <span>3.3604 ELF</span>
                <span>$ 2.04</span>
              </Flex>
            </Flex>
          </Flex>
          <Button
            onClick={() => {
              setIsSubmitModalOpen(false);
              setIsSuccessModalOpen(true);
            }}>
            Submit
          </Button>
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
