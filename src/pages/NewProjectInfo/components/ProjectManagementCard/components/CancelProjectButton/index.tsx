import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from 'antd';
import { Button, Modal, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import SuccessModal from '../../../OperationComponents/SuccessModal';
import { emitLoading } from 'utils/events';
import { useWallet } from 'contexts/useWallet/hooks';
import { IProjectInfo } from 'types/project';
import { divDecimalsStr } from 'utils/calculate';
import { NETWORK_CONFIG } from 'constants/network';

const { Text, Title } = Typography;

interface ICancelProjectButtonProps {
  projectInfo?: IProjectInfo;
}

// TODO: get estimatedTransactionFee
const estimatedTransactionFee = '366';

// TODO: convert to USD

export default function CancelProjectButton({ projectInfo }: ICancelProjectButtonProps) {
  const { wallet, checkManagerSyncState } = useWallet();

  const { projectId } = useParams();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
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
      const result = await wallet?.callContract<any, any>({
        contractAddress: NETWORK_CONFIG.ewellContractAddress,
        methodName: 'Cancel',
        // TODO: check args
        args: projectId,
      });
      console.log('result', result);
      // TODO: polling get Transaction ID
      emitLoading(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.log('error', error);
      emitLoading(false);
    }
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
            You are closing project{' '}
            <Text fontWeight={FontWeightEnum.Medium}>“{projectInfo?.additionalInfo?.projectName}”</Text>. After the
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
              {divDecimalsStr(projectInfo?.crowdFundingIssueAmount, projectInfo?.crowdFundingIssueToken?.decimals)}
            </Title>
            <Title fontWeight={FontWeightEnum.Medium}>{projectInfo?.crowdFundingIssueToken?.symbol || '--'}</Title>
          </Flex>
          <Flex className="modal-box-data-wrapper" justify="space-between" align="center">
            <Text className="half-width">Address</Text>
            <HashAddress
              className="half-width hash-address-small"
              preLen={8}
              endLen={9}
              address={wallet?.walletInfo.address || ''}
            />
          </Flex>
          <Flex justify="space-between" align="center">
            <Text>Estimated Transaction Fee</Text>
            <Flex gap={8} justify="flex-end" align="baseline">
              <Text>
                {divDecimalsStr(estimatedTransactionFee, projectInfo?.toRaiseToken?.decimals)}{' '}
                {projectInfo?.toRaiseToken?.symbol ?? '--'}
              </Text>
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
              amount: divDecimalsStr(
                projectInfo?.crowdFundingIssueAmount,
                projectInfo?.crowdFundingIssueToken?.decimals,
              ),
              symbol: projectInfo?.crowdFundingIssueToken?.symbol || '--',
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
