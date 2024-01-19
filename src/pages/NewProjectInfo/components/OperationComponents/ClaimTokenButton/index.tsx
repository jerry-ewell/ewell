import { useState } from 'react';
import { Modal, Flex } from 'antd';
import { Button } from 'aelf-design';
import SuccessModal from '../SuccessModal';
import './styles.less';

export default function ClaimTokenButtonButton() {
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
        wrapClassName="claim-token-submit-modal-wrapper"
        title="Claim Token"
        footer={null}
        open={isSubmitModalOpen}
        onCancel={() => {
          setIsSubmitModalOpen(false);
        }}>
        <Flex vertical gap={24}>
          <span>After clicking “Submit”, EWELL transfer ELF to the designated account.</span>
          <Flex className="token-wrapper" justify="center" align="baseline" gap={8}>
            <span className="amount">300</span>
            <span className="symbol">PIGE</span>
          </Flex>
          <Flex className="box-data" justify="space-between">
            <span>Address</span>
            <span>ELF_0x00…14dC_AELF</span>
          </Flex>
          <Flex className="error-text" justify="space-between">
            <span>Estimated Transaction Fee</span>
            <Flex gap={8}>
              <span>0.3604 ELF</span>
              <span>$ 0.19</span>
            </Flex>
          </Flex>
          <span className="error-text text-center">Not enough token in the wallet</span>
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
