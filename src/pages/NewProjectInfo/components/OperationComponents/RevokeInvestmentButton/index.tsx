import { useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { Flex } from 'antd';
import { Button, Typography, FontWeightEnum, Modal, HashAddress } from 'aelf-design';
import SuccessModal from '../SuccessModal';
import { useWallet } from 'contexts/useWallet/hooks';
import { useBalances } from 'hooks/useBalances';
import { IProjectInfo } from 'types/project';
import { divDecimalsStr } from 'utils/calculate';
import { ZERO } from 'constants/misc';
import { emitLoading } from 'utils/events';
import { NETWORK_CONFIG } from 'constants/network';

import './styles.less';

const { Text } = Typography;

interface IRevokeInvestmentButtonProps {
  projectInfo?: IProjectInfo;
}
// TODO: get estimatedTransactionFee
const estimatedTransactionFee = '0';

// TODO: convert to USD

export default function RevokeInvestmentButton({ projectInfo }: IRevokeInvestmentButtonProps) {
  const { wallet, checkManagerSyncState } = useWallet();

  const [balances] = useBalances(projectInfo?.toRaiseToken?.symbol);

  const { projectId } = useParams();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const revokeAmount = useMemo(() => {
    return new BigNumber(projectInfo?.investAmount ?? 0).times(0.9);
  }, [projectInfo?.investAmount]);

  const finalAmount = useMemo(() => {
    const amount = revokeAmount.minus(estimatedTransactionFee);
    if (amount.lt(0)) {
      return ZERO;
    } else {
      return amount;
    }
  }, [revokeAmount]);

  const notEnoughTokens = useMemo(() => {
    // TODO: check logic
    const isRevokeNotEnough = revokeAmount.lt(estimatedTransactionFee);
    return isRevokeNotEnough;
    // const isBalanceNotEnough = new BigNumber(balances?.[0] ?? 0).lt(estimatedTransactionFee);
    // return isRevokeNotEnough || isBalanceNotEnough;
  }, [revokeAmount]);

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
      const unInvestResult = await wallet?.callContract<any, any>({
        contractAddress: NETWORK_CONFIG.ewellContractAddress,
        methodName: 'UnInvest',
        args: {
          // TODO: check args
          projectId,
        },
      });
      console.log('unInvestResult', unInvestResult);
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
              address={wallet?.walletInfo.address || ''}
            />
          </Flex>
          <Flex
            className={clsx('modal-box-data-wrapper', { ['error-border']: notEnoughTokens })}
            justify="space-between">
            <Text className={clsx({ ['error-text']: notEnoughTokens })} fontWeight={FontWeightEnum.Medium}>
              Revoke
            </Text>
            <Flex gap={8} align="baseline">
              <Text className={clsx({ ['error-text']: notEnoughTokens })} fontWeight={FontWeightEnum.Medium}>
                {divDecimalsStr(revokeAmount, projectInfo?.toRaiseToken?.decimals)}{' '}
                {projectInfo?.toRaiseToken?.symbol ?? '--'}
              </Text>
              <Text
                className={clsx({ ['error-text']: notEnoughTokens })}
                fontWeight={FontWeightEnum.Medium}
                size="small">
                $ 1.86
              </Text>
            </Flex>
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
            <Flex justify="space-between">
              <Text>Final</Text>
              <Flex gap={8} align="baseline">
                <Text>
                  {divDecimalsStr(finalAmount, projectInfo?.toRaiseToken?.decimals)}{' '}
                  {projectInfo?.toRaiseToken?.symbol ?? '--'}
                </Text>
                <Text size="small">$ 2.04</Text>
              </Flex>
            </Flex>
          </Flex>
          <Text
            className={clsx('error-text', 'text-center', { ['display-none']: !notEnoughTokens })}
            fontWeight={FontWeightEnum.Medium}>
            Not enough tokens to pay for the Gas!
          </Text>
          <Flex justify="center">
            <Button className="modal-single-button" type="primary" disabled={notEnoughTokens} onClick={handleSubmit}>
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
              amount: divDecimalsStr(finalAmount, projectInfo?.toRaiseToken?.decimals),
              symbol: projectInfo?.toRaiseToken?.symbol || '--',
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
