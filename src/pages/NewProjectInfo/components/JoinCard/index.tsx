import { useMemo, useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { InputNumber, Flex, Form } from 'antd';
import { Typography, FontWeightEnum, Progress } from 'aelf-design';
import CommonCard from 'components/CommonCard';
import NewBaseCountdown from 'components/NewBaseCountdown';
import PurchaseButton from '../OperationComponents/PurchaseButton';
import RevokeInvestmentButton from '../OperationComponents/RevokeInvestmentButton';
import ClaimTokenButton from '../OperationComponents/ClaimTokenButton';
import RevokeFineButton from '../OperationComponents/RevokeFineButton';
import { IProjectInfo, ProjectStatus } from 'types/project';
import { PROJECT_STATUS_TEXT_MAP } from 'constants/project';
import { useWallet } from 'contexts/useWallet/hooks';
import { ZERO } from 'constants/misc';
import { divDecimals, divDecimalsStr } from 'utils/calculate';
import { getPriceDecimal } from 'utils';
import { parseInputNumberChange } from 'utils/input';
import { useBalances } from 'hooks/useBalances';
import { tempInfo } from '../temp';
import './styles.less';

const { Title, Text } = Typography;

interface IJoinCardProps {
  projectInfo?: IProjectInfo;
}

export default function JoinCard({ projectInfo }: IJoinCardProps) {
  const info = tempInfo;
  const { wallet } = useWallet();
  const isLogin = !!wallet;

  const [balances] = useBalances(projectInfo?.toRaiseToken?.symbol);
  console.log('balance: ', balances[0].toNumber());

  const [purchaseInputValue, setPurchaseInputValue] = useState('1');
  const [purchaseInputErrorMessage, setPurchaseInputErrorMessage] = useState('');

  const maxCanInvestAmount = useMemo(() => {
    const maxInvest = ZERO.plus(projectInfo?.toRaisedAmount ?? 0).minus(projectInfo?.currentRaisedAmount ?? 0);
    const canInput = ZERO.plus(projectInfo?.maxSubscription ?? 0).minus(projectInfo?.investAmount ?? 0);
    const arr = [maxInvest, canInput, balances?.[0]];
    return BigNumber.min.apply(null, arr);
  }, [projectInfo, balances]);

  const progressPercent = useMemo(() => {
    const percent = ZERO.plus(projectInfo?.currentRaisedAmount ?? 0)
      .div(projectInfo?.toRaisedAmount ?? 0)
      .times(1e2);
    return percent.isNaN() ? ZERO : percent;
  }, [projectInfo?.currentRaisedAmount, projectInfo?.toRaisedAmount]);

  const renderRemainder = () => {
    if (projectInfo?.status === ProjectStatus.ENDED) {
      return (
        <Text fontWeight={FontWeightEnum.Medium}>
          {projectInfo?.endTime ? dayjs(projectInfo?.endTime).format('DD-MM-YYYY\nH:mm [UTC] Z') : '-'}
        </Text>
      );
    } else if (projectInfo?.status === ProjectStatus.CANCELED) {
      return (
        <Text fontWeight={FontWeightEnum.Medium}>
          {projectInfo?.cancelTime ? dayjs(projectInfo?.cancelTime).format('DD-MM-YYYY\nH:mm [UTC] Z') : '-'}
        </Text>
      );
    } else if (projectInfo?.status === ProjectStatus.UPCOMING) {
      return (
        <NewBaseCountdown
          value={projectInfo?.startTime ? dayjs(projectInfo.startTime).valueOf() : 0}
          format="HH/mm/ss"
          // TODO: refresh
          onFinish={() => {}}
        />
      );
    } else if (projectInfo?.status === ProjectStatus.PARTICIPATORY) {
      return (
        <NewBaseCountdown
          value={projectInfo?.endTime ? dayjs(projectInfo.endTime).valueOf() : 0}
          format="HH/mm/ss"
          // TODO: refresh
          onFinish={() => {}}
        />
      );
    } else if (projectInfo?.status === ProjectStatus.UNLOCKED) {
      return (
        <NewBaseCountdown
          value={projectInfo?.unlockTime ? dayjs(projectInfo.unlockTime).valueOf() : 0}
          format="HH/mm/ss"
          // TODO: refresh
          onFinish={() => {}}
        />
      );
    } else {
      return '--';
    }
  };

  return (
    <CommonCard className="join-card-wrapper">
      <div className="swap-progress-wrapper">
        <Flex align="center" justify="space-between">
          <Title fontWeight={FontWeightEnum.Medium}>Swap Progress</Title>
          {!!projectInfo?.status && (
            <div
              className={clsx('status', {
                'purple-status':
                  projectInfo?.status === ProjectStatus.UNLOCKED || projectInfo?.status === ProjectStatus.PARTICIPATORY,
              })}>
              <Text size="small">{PROJECT_STATUS_TEXT_MAP[projectInfo?.status]}</Text>
            </div>
          )}
        </Flex>
        {/* TODO: adjust the height */}
        <Progress
          size={['100%', 12]}
          percent={progressPercent.toNumber()}
          strokeColor={projectInfo?.status === ProjectStatus.PARTICIPATORY ? '#131631' : '#C1C2C9'}
          trailColor="#F5F5F6"
        />
        <div className="flex-between-center">
          <Title fontWeight={FontWeightEnum.Medium}>{progressPercent.toNumber()}%</Title>
          <Title fontWeight={FontWeightEnum.Medium}>
            {divDecimalsStr(projectInfo?.currentRaisedAmount ?? 0, projectInfo?.toRaiseToken?.decimals)}/
            {divDecimalsStr(projectInfo?.toRaisedAmount, projectInfo?.toRaiseToken?.decimals)}{' '}
            {projectInfo?.toRaiseToken?.symbol || '--'}
          </Title>
        </div>
      </div>
      <div className="divider" />
      <Flex vertical gap={12}>
        <div className="flex-between-center">
          <Text>Remainder</Text>
          {renderRemainder()}
        </div>
        <div className="flex-between-center">
          <Text>Sale Price</Text>
          <Text fontWeight={FontWeightEnum.Medium}>
            {projectInfo?.preSalePrice
              ? `1 ${projectInfo?.toRaiseToken?.symbol ?? '--'} = ${
                  divDecimals(
                    projectInfo?.preSalePrice ?? 0,
                    getPriceDecimal(projectInfo?.crowdFundingIssueToken, projectInfo?.toRaiseToken),
                  ).toFixed() ?? '--'
                } ${projectInfo?.crowdFundingIssueToken?.symbol ?? '--'}`
              : '--'}
          </Text>
        </div>
        <div className="flex-between-center">
          <Text>Purchase Quantity</Text>
          <Text fontWeight={FontWeightEnum.Medium}>{`${divDecimalsStr(
            projectInfo?.minSubscription,
            projectInfo?.toRaiseToken?.decimals ?? 8,
          )} ${projectInfo?.toRaiseToken?.symbol ?? '--'} - ${divDecimalsStr(
            projectInfo?.maxSubscription,
            projectInfo?.toRaiseToken?.decimals ?? 8,
          )} ${projectInfo?.toRaiseToken?.symbol ?? '--'}`}</Text>
        </div>
      </Flex>
      <div className="divider" />
      <Flex vertical gap={12}>
        {projectInfo?.isEnableWhitelist && projectInfo?.whitelistInfo?.url && !projectInfo?.isInWhitelist && (
          <>
            {(projectInfo?.status === ProjectStatus.UPCOMING ||
              projectInfo?.status === ProjectStatus.PARTICIPATORY) && (
              <Text>The project is whitelisted. Investment projects need to complete Whitelist Tasks first.</Text>
            )}
            <Flex justify="flex-end">
              <Text
                className="purple-text cursor-pointer"
                fontWeight={FontWeightEnum.Medium}
                onClick={() => {
                  window.open(projectInfo?.whitelistInfo?.url, '_blank');
                }}>
                View Whitelist Tasks
              </Text>
            </Flex>
          </>
        )}
        {projectInfo?.isEnableWhitelist && projectInfo?.isInWhitelist && (
          <div className="flex-between-center">
            <Text>Whitelist</Text>
            <Text className="purple-text" fontWeight={FontWeightEnum.Medium}>
              Joined
            </Text>
          </div>
        )}
        {isLogin && (!projectInfo?.isEnableWhitelist || projectInfo?.isInWhitelist) && (
          <>
            {(projectInfo?.status === ProjectStatus.PARTICIPATORY ||
              projectInfo?.status === ProjectStatus.UNLOCKED ||
              projectInfo?.status === ProjectStatus.ENDED) && (
              <div className="flex-between-center">
                <Text>My Allocation</Text>
                <Text fontWeight={FontWeightEnum.Medium}>
                  {projectInfo?.investAmount
                    ? divDecimalsStr(projectInfo?.investAmount, projectInfo?.toRaiseToken?.decimals ?? 8)
                    : 0}{' '}
                  {projectInfo?.toRaiseToken?.symbol ?? '--'}
                </Text>
              </div>
            )}
            {(projectInfo?.status === ProjectStatus.PARTICIPATORY ||
              projectInfo?.status === ProjectStatus.UNLOCKED ||
              projectInfo?.status === ProjectStatus.ENDED) && (
              <div className="flex-between-center">
                <Text>
                  {projectInfo?.status === ProjectStatus.ENDED && info.hasClaimedToken ? 'Receive' : 'To Receive'}
                </Text>
                <Text fontWeight={FontWeightEnum.Medium}>
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
              </div>
            )}
            {projectInfo?.status === ProjectStatus.PARTICIPATORY && (
              <>
                <Form.Item
                  className="purchase-input-number-wrapper"
                  validateStatus={purchaseInputErrorMessage && 'error'}
                  help={purchaseInputErrorMessage}>
                  <InputNumber
                    className="purchase-input-number"
                    placeholder="placeholder"
                    controls={false}
                    stringMode
                    addonAfter={
                      <div className="max-operation-wrapper">
                        <Title className="max-operation purple-text cursor-pointer" fontWeight={FontWeightEnum.Medium}>
                          MAX
                        </Title>
                      </div>
                    }
                    value={purchaseInputValue}
                    onChange={(value) => {
                      setPurchaseInputValue(parseInputNumberChange(value || '', projectInfo?.toRaiseToken?.decimals));
                    }}
                    onBlur={() => {
                      // TODO: validate
                    }}
                  />
                </Form.Item>
                <PurchaseButton
                  buttonDisabled={!!purchaseInputErrorMessage}
                  projectInfo={projectInfo}
                  purchaseAmount={purchaseInputValue}
                  info={info}
                />
              </>
            )}
            {projectInfo?.status === ProjectStatus.PARTICIPATORY &&
              new BigNumber(projectInfo?.investAmount || '').gt(0) && (
                <RevokeInvestmentButton projectInfo={projectInfo} />
              )}
            {projectInfo?.status === ProjectStatus.UNLOCKED && new BigNumber(projectInfo?.investAmount || '').gt(0) && (
              <Text className="text-center" fontWeight={FontWeightEnum.Medium}>
                Claim Token when it's time to unlock!
              </Text>
            )}
            {projectInfo?.status === ProjectStatus.ENDED &&
              new BigNumber(projectInfo?.investAmount || '').gt(0) &&
              !info.hasClaimedToken && <ClaimTokenButton projectInfo={projectInfo} />}
            {projectInfo?.status === ProjectStatus.CANCELED && info.hasNotRedeemedDefault && (
              <RevokeFineButton projectInfo={projectInfo} />
            )}
          </>
        )}
      </Flex>
    </CommonCard>
  );
}
