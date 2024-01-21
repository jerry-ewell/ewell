import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { Flex } from 'antd';
import { Button, Modal, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import SuccessModal from '../SuccessModal';
import { IProjectInfo } from 'types/project';
import { divDecimalsStr } from 'utils/calculate';
import { useWallet } from 'contexts/useWallet/hooks';
import { useBalances } from 'hooks/useBalances';
import { emitLoading } from 'utils/events';
import { NETWORK_CONFIG } from 'constants/network';

const { Title, Text } = Typography;

interface ICreatorClaimTokenButtonProps {
  projectInfo?: IProjectInfo;
}

// TODO: get estimatedTransactionFee
const estimatedTransactionFee = '366';

// TODO: convert to USD

export default function CreatorClaimTokenButton({ projectInfo }: ICreatorClaimTokenButtonProps) {
  const { projectId } = useParams();

  const { wallet, checkManagerSyncState } = useWallet();

  const [balances] = useBalances(projectInfo?.toRaiseToken?.symbol);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const notEnoughTokens = useMemo(() => {
    return new BigNumber(balances?.[0] ?? 0).lt(estimatedTransactionFee);
  }, [balances]);

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
        methodName: 'Claim',
        args: {
          projectId,
          user: wallet?.walletInfo.address,
        },
      });
      console.log('Claim result', result);
      // TODO: polling get Transaction ID
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.log('Claim error', error);
    } finally {
      emitLoading(false);
    }
  };

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
              {/* TODO: check fieldName */}
              <Title className="half-width text-right" fontWeight={FontWeightEnum.Medium} level={4}>
                3
              </Title>
              <Title className="half-width" fontWeight={FontWeightEnum.Medium}>
                {projectInfo?.toRaiseToken?.symbol || '--'}
              </Title>
            </Flex>
            <Flex align="baseline" gap={8}>
              <Title className="half-width text-right" fontWeight={FontWeightEnum.Medium} level={4}>
                80
              </Title>
              <Title className="half-width" fontWeight={FontWeightEnum.Medium}>
                {projectInfo?.crowdFundingIssueToken?.symbol || '--'}
              </Title>
            </Flex>
          </Flex>
          <Flex className="modal-box-data-wrapper" justify="space-between">
            <Text>Address</Text>
            <HashAddress
              className="hash-address-small"
              preLen={8}
              endLen={9}
              address={wallet?.walletInfo.address || ''}
            />
          </Flex>
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
          <Flex justify="center">
            <Button className="modal-single-button" type="primary" onClick={handleSubmit}>
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
