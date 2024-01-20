import { useState } from 'react';
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
import { useBalances } from 'hooks/useBalances';
import { useWallet } from 'contexts/useWallet/hooks';
import { emitLoading } from 'utils/events';
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
  const [balances] = useBalances(projectInfo?.toRaiseToken?.symbol);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // TODO: get estimatedTransactionFee
  const estimatedTransactionFee = '0.3604';

  console.log('projectInfo?.investAmount: ', projectInfo?.investAmount);
  const handleSubmit = async () => {
    setIsSubmitModalOpen(false);
    const isManagerSynced = await checkManagerSyncState();
    if (!isManagerSynced) {
      // TODO: show tips modal
      return;
    }
    emitLoading(true, { text: 'Processing on the blockchain...' });
    const amount = new BigNumber(purchaseAmount || '')
      .multipliedBy(new BigNumber(10).pow(projectInfo?.toRaiseToken?.symbol ?? 8))
      .toFixed();

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
    } catch (error) {
      console.log('error', error);
    }

    // TODO: polling get Transaction ID

    setIsSuccessModalOpen(true);
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
                  ? divDecimalsStr(projectInfo?.investAmount, projectInfo?.toRaiseToken?.decimals ?? 8)
                  : 0}{' '}
                {projectInfo?.toRaiseToken?.symbol ?? '--'}
              </Text>
            </Flex>
            <Flex justify="space-between">
              <Text>To Receive</Text>
              <Text>
                {projectInfo?.investAmount
                  ? divDecimals(projectInfo?.investAmount, projectInfo?.toRaiseToken?.decimals)
                      .times(
                        divDecimals(
                          projectInfo?.preSalePrice ?? 0,
                          getPriceDecimal(projectInfo?.crowdFundingIssueToken, projectInfo?.toRaiseToken),
                        ),
                      )
                      .toFixed()
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
              {new BigNumber(balances?.[0])
                .dividedBy(new BigNumber(10).pow(projectInfo?.toRaiseToken?.decimals || 8))
                .toFixed()}{' '}
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
                  {estimatedTransactionFee} {projectInfo?.toRaiseToken?.symbol ?? '--'}
                </Text>
                <Text size="small">$ 0.19</Text>
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <Text>Total</Text>
              <Flex gap={8} align="baseline">
                <Text fontWeight={FontWeightEnum.Medium}>
                  {new BigNumber(purchaseAmount ?? '').plus(estimatedTransactionFee).toFixed()}{' '}
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
              amount: new BigNumber(purchaseAmount ?? '').plus(estimatedTransactionFee).toFixed(),
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
