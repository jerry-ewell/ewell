import { useState } from 'react';
import { Flex } from 'antd';
import { Button, Modal, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import SuccessModal from '../SuccessModal';

const { Title, Text } = Typography;

export default function CreatorClaimTokenButton() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setIsSubmitModalOpen(true);
        }}>
        Claim
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
          <Text>
            Click to extract ELF from EWELL contract. If you have any token left, it will be withdrawn as well.
          </Text>
          <Flex vertical>
            <Flex align="baseline" gap={8}>
              <Title className="half-width text-right" fontWeight={FontWeightEnum.Medium} level={4}>
                3
              </Title>
              <Title className="half-width" fontWeight={FontWeightEnum.Medium}>
                ELF
              </Title>
            </Flex>
            <Flex align="baseline" gap={8}>
              <Title className="half-width text-right" fontWeight={FontWeightEnum.Medium} level={4}>
                80
              </Title>
              <Title className="half-width" fontWeight={FontWeightEnum.Medium}>
                PIGE
              </Title>
            </Flex>
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
            <Text>Estimated Transaction Fee</Text>
            <Flex gap={8} align="baseline">
              <Text>0.3604 ELF</Text>
              <Text size="small">$ 0.19</Text>
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
          title: 'Claim Token Success',
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
              amount: '30',
              symbol: 'ELF',
            },
            {
              amount: '30,000',
              symbol: 'PIGE',
            },
          ],
          description: 'Congratulations, transfer success!',
          boxData: {
            label: 'Transaction ID',
            value: 'ELF_0x00…14dC_AELF',
          },
        }}
      />
    </>
  );
}
