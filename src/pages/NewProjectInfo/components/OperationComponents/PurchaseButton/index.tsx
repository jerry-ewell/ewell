import { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useParams } from 'react-router-dom';
import { Flex } from 'antd';
import { Button, FontWeightEnum, HashAddress, Modal, Typography } from 'aelf-design';
import ProjectLogo from 'components/ProjectLogo';
import SuccessModal from '../SuccessModal';
import { wallet as walletIcon } from 'assets/images';
import { IProjectInfo } from 'types/project';
import { tempInfo } from '../../temp';
import { NETWORK_CONFIG } from 'constants/network';
import { divDecimals, divDecimalsStr } from 'utils/calculate';
import { getPriceDecimal } from 'utils';
import { useViewContract } from 'contexts/useViewContract/hooks';
import { useWallet } from 'contexts/useWallet/hooks';
import { emitLoading } from 'utils/events';
import { timesDecimals } from 'utils/calculate';
import './styles.less';

const { Title, Text } = Typography;

export interface IPurchaseButtonProps {
  buttonDisabled?: boolean;
  projectInfo: IProjectInfo;
  purchaseAmount?: string;
  info: typeof tempInfo;
}

export default function PurchaseButton({ buttonDisabled, projectInfo, purchaseAmount, info }: IPurchaseButtonProps) {
  const { projectId } = useParams();
  const { additionalInfo } = projectInfo || {};
  const { wallet, checkManagerSyncState } = useWallet();
  const { getTokenContract } = useViewContract();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [balance, setBalance] = useState('0');

  // TODO: get estimatedTransactionFee
  const estimatedTransactionFee = '3604';

  const getBalance = useCallback(async () => {
    const tokenContract = await getTokenContract();
    const result = await tokenContract.GetBalance.call({
      symbol: projectInfo?.crowdFundingIssueToken?.symbol,
      owner: wallet?.walletInfo.address,
    });
    setBalance(result.balance);
  }, [getTokenContract, projectInfo?.crowdFundingIssueToken?.symbol, wallet?.walletInfo.address]);

  useEffect(() => {
    if (isSubmitModalOpen) {
      getBalance();
    }
  }, [getBalance, isSubmitModalOpen]);

  const allocationAmount = useMemo(() => {
    return timesDecimals(purchaseAmount, projectInfo?.toRaiseToken?.decimals);
  }, [projectInfo?.toRaiseToken?.decimals, purchaseAmount]);

  const totalAllocationAmount = useMemo(() => {
    return new BigNumber(projectInfo?.investAmount ?? 0).plus(allocationAmount);
  }, [allocationAmount, projectInfo?.investAmount]);

  const handleSubmit = async () => {
    setIsSubmitModalOpen(false);
    const isManagerSynced = await checkManagerSyncState();
    if (!isManagerSynced) {
      // TODO: show tips modal
      return;
    }
    emitLoading(true, { text: 'Processing on the blockchain...' });
    const amount = allocationAmount.toFixed();

    try {
      const approveResult = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.sideChainInfo.tokenContractAddress,
        methodName: 'Approve',
        args: {
          spender: NETWORK_CONFIG.ewellContractAddress,
          symbol: projectInfo?.toRaiseToken?.symbol,
          amount,
        },
      });
      console.log('approveResult', approveResult);
    } catch (error) {
      console.log('error', error);
      emitLoading(false);
    }

    try {
      const investResult = await wallet?.callContract<any, any>({
        contractAddress: NETWORK_CONFIG.ewellContractAddress,
        methodName: 'Invest',
        args: {
          projectId,
          currency: 'ELF',
          investAmount: amount,
        },
      });
      console.log('investResult', investResult);
      // TODO: polling get Transaction ID
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.log('error', error);
    } finally {
      emitLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        disabled={buttonDisabled}
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
            <ProjectLogo key={additionalInfo?.logoUrl} src={info.logoUrl} alt="logo" />
            <Title fontWeight={FontWeightEnum.Medium}>{additionalInfo?.projectName}</Title>
          </Flex>
          <Flex vertical gap={8}>
            <Flex justify="space-between">
              <Text>Contract Address</Text>
              <HashAddress
                className="hash-address-small"
                preLen={8}
                endLen={9}
                address={NETWORK_CONFIG.ewellContractAddress}
              />
            </Flex>
            <Flex justify="space-between">
              <Text>My Allocation</Text>
              <Text>
                {projectInfo?.investAmount
                  ? divDecimalsStr(totalAllocationAmount, projectInfo?.toRaiseToken?.decimals ?? 8)
                  : 0}{' '}
                {projectInfo?.toRaiseToken?.symbol ?? '--'}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text>To Receive</Text>
              <Text>
                {projectInfo?.investAmount
                  ? divDecimals(totalAllocationAmount, projectInfo?.toRaiseToken?.decimals)
                      .times(
                        divDecimals(
                          projectInfo?.preSalePrice ?? 0,
                          getPriceDecimal(projectInfo?.crowdFundingIssueToken, projectInfo?.toRaiseToken),
                        ),
                      )
                      .toFormat()
                  : 0}{' '}
                {projectInfo?.crowdFundingIssueToken?.symbol ?? '--'}
              </Text>
            </Flex>
          </Flex>
          <Flex className="modal-box-data-wrapper" justify="space-between">
            <Flex align="center" gap={8}>
              <img src={walletIcon} alt="wallet" />
              <Text fontWeight={FontWeightEnum.Medium}>Balance</Text>
            </Flex>
            <Text fontWeight={FontWeightEnum.Medium}>
              {divDecimalsStr(balance, projectInfo?.toRaiseToken?.decimals ?? 8)}{' '}
              {projectInfo?.toRaiseToken?.symbol ?? '--'}
            </Text>
          </Flex>
          <Flex vertical gap={8}>
            {/* TODO: check its meaning */}
            <Flex justify="space-between">
              <Text>Allocation</Text>
              <Flex gap={8} align="baseline">
                <Text>
                  {purchaseAmount} {projectInfo?.toRaiseToken?.symbol ?? '--'}
                </Text>
                <Text size="small">$ 1.86</Text>
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <Text>Estimated Transaction Fee</Text>
              <Flex gap={8} align="baseline">
                <Text>
                  {divDecimalsStr(estimatedTransactionFee, projectInfo?.toRaiseToken?.decimals ?? 8)}{' '}
                  {projectInfo?.toRaiseToken?.symbol ?? '--'}
                </Text>
                <Text size="small">$ 0.19</Text>
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <Text>Total</Text>
              <Flex gap={8} align="baseline">
                <Text>
                  {new BigNumber(purchaseAmount || 0)
                    .plus(divDecimals(estimatedTransactionFee, projectInfo?.toRaiseToken?.decimals ?? 8))
                    .toFormat()}{' '}
                  {projectInfo?.toRaiseToken?.symbol ?? '--'}
                </Text>
                <Text fontWeight={FontWeightEnum.Medium} size="small">
                  $ 2.04
                </Text>
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
              amount: new BigNumber(purchaseAmount || 0)
                .plus(divDecimals(estimatedTransactionFee, projectInfo?.toRaiseToken?.decimals ?? 8))
                .toFormat(),
              symbol: projectInfo?.toRaiseToken?.symbol ?? '--',
            },
          ],
          description: 'Congratulations, payment success!',
          boxData: {
            // TODO: Transaction ID ?
            label: 'Contract Address',
            value: 'ELF_2Pew…W28l_AELF',
          },
        }}
      />
    </>
  );
}
