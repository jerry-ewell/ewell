import { Progress, InputNumber, Button } from 'antd';
import PurchaseButton from '../OperationComponents/PurchaseButton';
import RevokeInvestmentButton from '../OperationComponents/RevokeInvestmentButton';
import ClaimTokenButtonButton from '../OperationComponents/ClaimTokenButton';
import { ProjectStatus } from 'types/project';
import { PROJECT_STATUS_TEXT_MAP } from 'constants/project';
import { tempInfo } from '../temp';
import './styles.less';

export default function JoinCard({ info }: { info: typeof tempInfo }) {
  return (
    <div className="join-card-wrapper">
      <div className="swap-progress-wrapper">
        <div className="flex-between-center">
          <span className="title">Swap Progress</span>
          <span
            className={`status ${
              info.projectStatus === ProjectStatus.UNLOCKED || info.projectStatus === ProjectStatus.PARTICIPATORY
                ? 'purple'
                : ''
            }`}>
            {PROJECT_STATUS_TEXT_MAP[info.projectStatus]}
          </span>
        </div>
        <Progress
          className="progress"
          percent={30}
          showInfo={false}
          strokeColor={info.projectStatus === ProjectStatus.PARTICIPATORY ? '#131631' : '#C1C2C9'}
          trailColor="#F5F5F6"
        />
        <div className="flex-between-center">
          <span className="percent">50%</span>
          <span className="amount">250,000/500,000 ELF</span>
        </div>
      </div>
      <div className="divider" />
      <div className="project-info-wrapper flex-column">
        <div className="flex-between-center">
          <span>Remainder</span>
          <span>00:13:43</span>
        </div>
        <div className="flex-between-center">
          <span>Sale Price</span>
          <span>1 ELF = 1 PIGE</span>
        </div>
        <div className="flex-between-center">
          <span>Purchase Quantity</span>
          <span>10 ELF - 10,000 ELF</span>
        </div>
      </div>
      <div className="divider" />
      <div className="join-info-wrapper flex-column">
        {info.isEnableWhitelist && !info.isFinishWhitelist && (
          <>
            {(info.projectStatus === ProjectStatus.UPCOMING || info.projectStatus === ProjectStatus.PARTICIPATORY) && (
              <span className="whitelist-tasks-prompt">
                The project is whitelisted. Investment projects need to complete Whitelist Tasks first.
              </span>
            )}
            <div className="whitelist-tasks-link-button-wrapper flex">
              <span
                className="purple-text cursor-pointer"
                onClick={() => {
                  window.open(info.whitelistTasksLink, '_blank');
                }}>
                View Whitelist Tasks
              </span>
            </div>
          </>
        )}
        {info.isEnableWhitelist && info.isFinishWhitelist && (
          <div className="flex-between-center">
            <span>Whitelist</span>
            <span className="purple-text">Joined</span>
          </div>
        )}
        {info.isLogin && (!info.isEnableWhitelist || info.isFinishWhitelist) && (
          <>
            {(info.projectStatus === ProjectStatus.PARTICIPATORY ||
              info.projectStatus === ProjectStatus.UNLOCKED ||
              info.projectStatus === ProjectStatus.ENDED ||
              (info.projectStatus === ProjectStatus.CANCELED && info.myAllocation.amount > 0)) && (
              <div className="flex-between-center">
                <span>My Allocation</span>
                <span>
                  {info.myAllocation.amount} {info.myAllocation.symbol}
                </span>
              </div>
            )}
            {(info.projectStatus === ProjectStatus.PARTICIPATORY ||
              info.projectStatus === ProjectStatus.UNLOCKED ||
              info.projectStatus === ProjectStatus.ENDED) && (
              <div className="flex-between-center">
                <span>
                  {info.projectStatus === ProjectStatus.ENDED && info.hasClaimedToken ? 'Receive' : 'To Receive'}
                </span>
                <span>
                  {info.myAllocation.amount} {info.myAllocation.symbol}
                </span>
              </div>
            )}
            {info.projectStatus === ProjectStatus.PARTICIPATORY && (
              <>
                <InputNumber
                  className="purchase-input-number"
                  value={1}
                  addonAfter={<div className="purple-text cursor-pointer">MAX</div>}
                />
                <PurchaseButton info={info} />
              </>
            )}
            {(info.projectStatus === ProjectStatus.PARTICIPATORY || info.projectStatus === ProjectStatus.CANCELED) &&
              info.myAllocation.amount > 0 && <RevokeInvestmentButton />}
            {info.projectStatus === ProjectStatus.UNLOCKED && info.myAllocation.amount > 0 && (
              <span className="text-center">{"Claim Token when it's time to unlock!"}</span>
            )}
            {info.projectStatus === ProjectStatus.ENDED && info.myAllocation.amount > 0 && !info.hasClaimedToken && (
              <ClaimTokenButtonButton />
            )}
            {info.projectStatus === ProjectStatus.CANCELED && info.hasNotRedeemedDefault && (
              <Button>Redemption Default</Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
