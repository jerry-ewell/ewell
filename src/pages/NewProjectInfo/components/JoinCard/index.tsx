import clsx from 'clsx';
import { InputNumber, Flex } from 'antd';
import { Typography, FontWeightEnum, Progress, Button } from 'aelf-design';
import PurchaseButton from '../OperationComponents/PurchaseButton';
import RevokeInvestmentButton from '../OperationComponents/RevokeInvestmentButton';
import ClaimTokenButtonButton from '../OperationComponents/ClaimTokenButton';
import { ProjectStatus } from 'types/project';
import { PROJECT_STATUS_TEXT_MAP } from 'constants/project';
import { tempInfo } from '../temp';
import './styles.less';

const { Title, Text } = Typography;

export default function JoinCard({ info }: { info: typeof tempInfo }) {
  return (
    <div className="join-card-wrapper">
      <div className="swap-progress-wrapper">
        <Flex align="center" justify="space-between">
          <Title fontWeight={FontWeightEnum.Medium}>Swap Progress</Title>
          <div
            className={clsx('status', {
              'purple-status':
                info.projectStatus === ProjectStatus.UNLOCKED || info.projectStatus === ProjectStatus.PARTICIPATORY,
            })}>
            <Text size="small">{PROJECT_STATUS_TEXT_MAP[info.projectStatus]}</Text>
          </div>
        </Flex>
        {/* TODO: adjust the height */}
        <Progress
          size={['100%', 12]}
          percent={30}
          strokeColor={info.projectStatus === ProjectStatus.PARTICIPATORY ? '#131631' : '#C1C2C9'}
          trailColor="#F5F5F6"
        />
        <div className="flex-between-center">
          <Title fontWeight={FontWeightEnum.Medium}>50%</Title>
          <Title fontWeight={FontWeightEnum.Medium}>250,000/500,000 ELF</Title>
        </div>
      </div>
      <div className="divider" />
      <Flex vertical gap={12}>
        <div className="flex-between-center">
          <Text>Remainder</Text>
          <Text fontWeight={FontWeightEnum.Medium}>00:13:43</Text>
        </div>
        <div className="flex-between-center">
          <Text>Sale Price</Text>
          <Text fontWeight={FontWeightEnum.Medium}>1 ELF = 1 PIGE</Text>
        </div>
        <div className="flex-between-center">
          <Text>Purchase Quantity</Text>
          <Text fontWeight={FontWeightEnum.Medium}>10 ELF - 10,000 ELF</Text>
        </div>
      </Flex>
      <div className="divider" />
      <Flex vertical gap={12}>
        {info.isEnableWhitelist && info.hasWhitelistTasks && !info.isFinishWhitelist && (
          <>
            {(info.projectStatus === ProjectStatus.UPCOMING || info.projectStatus === ProjectStatus.PARTICIPATORY) && (
              <Text>The project is whitelisted. Investment projects need to complete Whitelist Tasks first.</Text>
            )}
            <Flex justify="flex-end">
              <Text
                className="purple-text cursor-pointer"
                fontWeight={FontWeightEnum.Medium}
                onClick={() => {
                  window.open(info.whitelistTasksLink, '_blank');
                }}>
                View Whitelist Tasks
              </Text>
            </Flex>
          </>
        )}
        {info.isEnableWhitelist && info.isFinishWhitelist && (
          <div className="flex-between-center">
            <Text>Whitelist</Text>
            <Text className="purple-text" fontWeight={FontWeightEnum.Medium}>
              Joined
            </Text>
          </div>
        )}
        {info.isLogin && (!info.isEnableWhitelist || info.isFinishWhitelist) && (
          <>
            {(info.projectStatus === ProjectStatus.PARTICIPATORY ||
              info.projectStatus === ProjectStatus.UNLOCKED ||
              info.projectStatus === ProjectStatus.ENDED) && (
              <div className="flex-between-center">
                <Text>My Allocation</Text>
                <Text fontWeight={FontWeightEnum.Medium}>
                  {info.myAllocation.amount} {info.myAllocation.symbol}
                </Text>
              </div>
            )}
            {(info.projectStatus === ProjectStatus.PARTICIPATORY ||
              info.projectStatus === ProjectStatus.UNLOCKED ||
              info.projectStatus === ProjectStatus.ENDED) && (
              <div className="flex-between-center">
                <Text>
                  {info.projectStatus === ProjectStatus.ENDED && info.hasClaimedToken ? 'Receive' : 'To Receive'}
                </Text>
                <Text fontWeight={FontWeightEnum.Medium}>
                  {info.myAllocation.amount} {info.myAllocation.symbol}
                </Text>
              </div>
            )}
            {info.projectStatus === ProjectStatus.PARTICIPATORY && (
              <>
                <InputNumber
                  className="purchase-input-number"
                  placeholder="placeholder"
                  controls={false}
                  addonAfter={
                    <div className="max-operation-wrapper">
                      <Title className="max-operation purple-text cursor-pointer" fontWeight={FontWeightEnum.Medium}>
                        MAX
                      </Title>
                    </div>
                  }
                />
                <PurchaseButton info={info} />
              </>
            )}
            {info.projectStatus === ProjectStatus.PARTICIPATORY && info.myAllocation.amount > 0 && (
              <RevokeInvestmentButton />
            )}
            {info.projectStatus === ProjectStatus.UNLOCKED && info.myAllocation.amount > 0 && (
              <Text className="text-center" fontWeight={FontWeightEnum.Medium}>
                Claim Token when it's time to unlock!
              </Text>
            )}
            {info.projectStatus === ProjectStatus.ENDED && info.myAllocation.amount > 0 && !info.hasClaimedToken && (
              <ClaimTokenButtonButton />
            )}
            {info.projectStatus === ProjectStatus.CANCELED && info.hasNotRedeemedDefault && (
              <Button type="primary">Revoke Token</Button>
            )}
          </>
        )}
      </Flex>
    </div>
  );
}
