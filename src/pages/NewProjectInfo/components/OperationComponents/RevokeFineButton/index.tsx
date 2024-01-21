// TODO: check whether the operation is automatic
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from 'antd';
import { Button, Typography, FontWeightEnum, Modal, HashAddress } from 'aelf-design';
import SuccessModal from '../SuccessModal';
import { IProjectInfo } from 'types/project';
import { divDecimalsStr } from 'utils/calculate';
import { useWallet } from 'contexts/useWallet/hooks';
import { emitLoading } from 'utils/events';
import { NETWORK_CONFIG } from 'constants/network';

const { Text, Title } = Typography;

interface IClaimTokenButtonProps {
  projectInfo?: IProjectInfo;
}

// TODO: get estimatedTransactionFee
const estimatedTransactionFee = '366';

// TODO: convert to USD

export default function RevokeFineButton({ projectInfo }: IClaimTokenButtonProps) {
  const { projectId } = useParams();

  const { wallet, checkManagerSyncState } = useWallet();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitModalOpen(false);
    emitLoading(true, { text: 'Processing on the blockchain...' });
    const isManagerSynced = await checkManagerSyncState();
    if (!isManagerSynced) {
      emitLoading(false);
      // TODO: show tips modal
      return;
    }
    try {
      const result = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.ewellContractAddress,
        methodName: 'ClaimLiquidatedDamage',
        args: {
          projectId,
        },
      });
      console.log('ClaimLiquidatedDamage result', result);
      // TODO: polling get Transaction ID
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.log('ClaimLiquidatedDamage error', error);
    } finally {
      emitLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsConfirmModalOpen(true)}>
        Revoke Token
      </Button>
      <Modal
        title="Revoke Token"
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
              Revoke Token
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <Modal
        title="Revoke Token"
        footer={null}
        centered
        open={isSubmitModalOpen}
        onCancel={() => {
          setIsSubmitModalOpen(false);
        }}>
        <Flex vertical gap={24}>
          <Text>After clicking “Submit”, EWELL transfer ELF to the designated account.</Text>
          <Flex gap={8} justify="center" align="baseline">
            <Title fontWeight={FontWeightEnum.Medium} level={4}>
              {/* TODO: check fieldName */}
              3.3604
            </Title>
            <Title fontWeight={FontWeightEnum.Medium}>{projectInfo?.toRaiseToken?.symbol || '--'}</Title>
          </Flex>
          <Flex className="modal-box-data-wrapper" justify="space-between">
            <Text fontWeight={FontWeightEnum.Medium}>Address</Text>
            <HashAddress
              className="hash-address-small"
              preLen={8}
              endLen={9}
              address={wallet?.walletInfo.address || ''}
            />
          </Flex>
          <Flex vertical gap={8}>
            <Flex justify="space-between">
              <Text>Estimated Transaction Fee</Text>
              <Flex gap={8} align="baseline">
                <Text>
                  {divDecimalsStr(estimatedTransactionFee, projectInfo?.toRaiseToken?.decimals)}{' '}
                  {projectInfo?.toRaiseToken?.symbol ?? '--'}
                </Text>
                <Text size="small">$ 0.19</Text>
              </Flex>
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
