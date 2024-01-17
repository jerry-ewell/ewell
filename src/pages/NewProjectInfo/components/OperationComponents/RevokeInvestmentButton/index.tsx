import { useState } from 'react';
import { Button, Modal, Flex } from 'antd';
import SuccessModal from '../SuccessModal';
import './styles.less';

export default function RevokeInvestmentButton() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          Modal.confirm({
            title: 'Revoke Investment',
            icon: null,
            content: (
              <Flex vertical gap={24}>
                <span>
                  Are you sure you want to cancel your investment? Withdrawal of investment will be charged 10% of your
                  ELF as liquidated damages and the remaining ELF will be refunded after deduction of Gas.
                </span>
                <Flex gap={16}>
                  <Button
                    onClick={() => {
                      Modal.destroyAll();
                    }}>
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      Modal.destroyAll();
                      setIsSubmitModalOpen(true);
                    }}>
                    Revoke Investment
                  </Button>
                </Flex>
              </Flex>
            ),
            footer: null,
            onOk() {
              setIsSubmitModalOpen(true);
            },
          });
        }}>
        Revoke Investment
      </Button>
      <Modal
        wrapClassName="revoke-investment-modal-wrapper"
        title="Confirm Payment"
        footer={null}
        open={isSubmitModalOpen}
        onCancel={() => {
          setIsSubmitModalOpen(false);
        }}>
        <Flex vertical gap={24}>
          <span>After clicking “Submit”, EWELL transfer ELF to the designated account.</span>
          <Flex justify="space-between">
            <span>Address</span>
            <span>ELF_2Pew…W28l_AELF</span>
          </Flex>
          <Flex className="box-data error" justify="space-between">
            <span>Revoke</span>
            <Flex gap={8}>
              <span>3 ELF</span>
              <span>$ 1.86</span>
            </Flex>
          </Flex>
          <Flex vertical gap={8}>
            <Flex justify="space-between">
              <span>Estimated Transaction Fee</span>
              <Flex gap={8}>
                <span>0.3604 ELF</span>
                <span>$ 0.19</span>
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <span>Purchase Quantity</span>
              <Flex gap={8}>
                <span>0.3604 ELF</span>
                <span>$ 0.19</span>
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <span>Final</span>
              <Flex gap={8}>
                <span>3.3604 ELF</span>
                <span>$ 2.04</span>
              </Flex>
            </Flex>
          </Flex>
          <span className="error-message text-center">Not enough tokens to pay for the Gas!</span>
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
