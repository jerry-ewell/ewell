import BaseCountdown from 'components/BaseCountdown';
import { Button, Input, message } from 'antd';
import clsx from 'clsx';
import { isEffectiveNumber, REQ_CODE, ZERO } from 'constants/misc';
import { useProjectInfo } from 'contexts/useProjectInfo';
import { basicProjectInfoView } from 'contexts/useProjectInfo/actions';
import { useProjectInfoDispatch } from 'contexts/useProjectInfo/hooks';
import { useActiveWeb3React } from 'hooks/web3';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PROGRESS_RATE } from 'types/project';
import { parseInputNumberChange } from 'utils/input';
import './styles.less';
import { useWhiteList, useWhiteListView } from 'components/WhitelistService';
import { useMobile } from 'contexts/useStore/hooks';
import { showModal } from 'utils/modal';
import { messageHTML } from 'utils/aelfUtils';
import { divDecimals, divDecimalsStr, timesDecimals } from 'utils/calculate';
import { checkApprove } from 'contracts';
import { getPriceDecimal } from 'utils';
import { useBalances } from 'hooks/useBalances';
import BigNumber from 'bignumber.js';

enum ActionType {
  Withdraw,
  Invest,
  UnInvest,
  Claim,
}

const getClaimed = (listingInfo: any, userProfit: any) => {
  let claimed = ZERO;
  let toBeClaimed = ZERO;
  let disabled = true;
  if (!userProfit || !listingInfo)
    return {
      claimed: ZERO,
      toBeClaimed: ZERO,
      disabled: true,
    };
  const currentPeriod = listingInfo?.latestPeriod ?? 0;
  const { latestPeriod, amountsMap } = userProfit ?? {};

  Object.entries(amountsMap ?? {})?.forEach(([k, v]) => {
    if (latestPeriod >= k) {
      claimed = claimed.plus(v as string);
    } else {
      if (currentPeriod >= +k && latestPeriod < +k) {
        toBeClaimed = toBeClaimed.plus(v as string);
      }
    }
  });

  disabled =
    (listingInfo?.latestPeriod ?? 0) < 1 ||
    latestPeriod === listingInfo?.latestPeriod ||
    !isEffectiveNumber(toBeClaimed);
  console.log(claimed.toFixed(), toBeClaimed.toFixed(), disabled, 'getClaimed===info===');
  return {
    claimed,
    toBeClaimed,
    disabled,
  };
};

export default function JoinCard() {
  const [{ idoInfo, idoContract: contract }] = useProjectInfo();
  const { account, library } = useActiveWeb3React();
  const dispatch = useProjectInfoDispatch();
  const [inputVal, setInputVal] = useState<string>();
  const [btnLoading, setBtnLoading] = useState<ActionType | undefined>();
  const [{ whitelistInfo: whitelist, refresh }] = useWhiteList();
  const isMobile = useMobile();
  const { accountInWhitelist } = useWhiteListView();
  const [inWhitelist, setInWhitelist] = useState<boolean>(false);
  const [balance] = useBalances(idoInfo?.toRaiseToken?.symbol);

  useEffect(() => {
    if (!account) return;
    if (!whitelist?.isAvailable) return;
    accountInWhitelist(account)
      .then((bool) => {
        setInWhitelist(bool);
      })
      .catch((e) => {
        console.log(e, 'accountInWhitelist===error');
        e?.error?.message && message.error(e?.error?.message);
      });
  }, [account, accountInWhitelist, whitelist?.isAvailable, refresh]);

  const idoProgressRate = useMemo(() => idoInfo?.progressRate, [idoInfo]);

  const title = useMemo(() => {
    switch (idoProgressRate) {
      case PROGRESS_RATE.comingSoon:
        return 'IDO starts at';
      case PROGRESS_RATE.onGoing:
        return 'IDO ends at';
      case PROGRESS_RATE.over:
        return 'IDO ended';
      case PROGRESS_RATE.cancelled:
        return 'This IDO has been cancelled';
    }
  }, [idoProgressRate]);

  const successBack = useCallback(() => {
    dispatch(basicProjectInfoView.updateRefresh.actions());
    setBtnLoading(undefined);
  }, [dispatch]);

  const InvestClick = useCallback(async () => {
    if (
      !idoInfo?.projectId ||
      !inputVal ||
      !account ||
      !contract ||
      !contract?.address ||
      !idoInfo?.toRaiseToken?.symbol
    )
      return message.error('invalid parameter');
    const amount = timesDecimals(inputVal, idoInfo?.toRaiseToken?.decimals ?? 8).toFixed();
    setBtnLoading(ActionType.Invest);
    const approve = await checkApprove(
      library ?? null,
      idoInfo?.toRaiseToken?.symbol,
      account,
      contract?.address,
      amount,
    );
    if (approve !== REQ_CODE.Success) {
      setBtnLoading(undefined);
      return;
    }
    const res = await contract?.callSendMethod('Invest', account, [
      idoInfo?.projectId,
      idoInfo?.toRaiseToken?.symbol,
      amount,
    ]);
    setBtnLoading(undefined);
    if (res?.error) return message.error(res?.error?.message || 'Invest error');
    res?.TransactionId && messageHTML(res?.TransactionId);
    setInputVal('');
    successBack();
  }, [idoInfo, inputVal, account, contract, library, successBack]);

  const ClaimClick = useCallback(async () => {
    if (!account || !contract || !idoInfo?.hash) return message.error('invalid parameter');
    setBtnLoading(ActionType.Claim);
    const res = await contract?.callSendMethod('Claim', account, [idoInfo?.hash, account]);
    setBtnLoading(undefined);
    if (res?.error) return message.error(res?.error?.message || 'Invest error');
    res?.TransactionId && messageHTML(res?.TransactionId);
    successBack();
  }, [account, contract, idoInfo?.hash, successBack]);

  const UnInvestClick = useCallback(async () => {
    if (!account || !contract || !idoInfo?.projectId) {
      message.error('invalid parameter');
      return Promise.reject('');
    }
    setBtnLoading(ActionType.UnInvest);
    const res = await contract?.callSendMethod('UnInvest', account, idoInfo?.projectId);
    setBtnLoading(undefined);
    if (res?.error) {
      message.error(res?.error?.message || 'UnInvest error');
      return Promise.reject('');
    }
    successBack();
    res?.TransactionId && messageHTML(res?.TransactionId);
    return Promise.resolve('');
  }, [account, contract, idoInfo?.projectId, successBack]);

  const canInvest = useMemo(() => {
    if (idoInfo?.isCanceled) return true;
    if (whitelist?.isAvailable && !inWhitelist) return true;
    if (!isEffectiveNumber(inputVal)) return true;
    if (divDecimals(idoInfo?.minSubscription ?? 0, idoInfo?.toRaiseToken?.decimals ?? 8).gt(inputVal ?? 0)) return true;
    if (divDecimals(idoInfo?.maxSubscription ?? 0, idoInfo?.toRaiseToken?.decimals ?? 8).lt(inputVal ?? 0)) return true;
    return idoProgressRate === PROGRESS_RATE.comingSoon;
  }, [idoInfo, idoProgressRate, inWhitelist, inputVal, whitelist?.isAvailable]);

  const maxInvest = useMemo(() => {
    const maxInvest = ZERO.plus(idoInfo?.toRaisedAmount ?? 0).minus(idoInfo?.currentRaisedAmount ?? 0);
    const canInput = ZERO.plus(idoInfo?.maxSubscription ?? 0).minus(idoInfo?.userInvest?.amount ?? 0);
    const arr = [maxInvest, canInput, balance?.[0]];
    return BigNumber.min.apply(null, arr);
  }, [idoInfo, balance]);

  // const toBeClaimed = useMemo(() => {
  //   const { listingInfo, userProfit } = idoInfo ?? {};
  //   if (!userProfit || !listingInfo) return ZERO;
  //   const currentPeriod = listingInfo?.latestPeriod ?? 0;
  //   const { latestPeriod, amountsMap } = userProfit ?? {};

  //   if (currentPeriod <= latestPeriod) {
  //     return ZERO;
  //   } else {
  //     return Object.entries(amountsMap ?? {}).reduce((prev, [k, v]) => {
  //       if (currentPeriod >= +k && latestPeriod < +k) {
  //         return prev.plus(v as any);
  //       }
  //       return prev;
  //     }, ZERO);
  //   }
  // }, [idoInfo]);

  const claimInfo = useMemo(() => {
    const { listingInfo, userProfit } = idoInfo ?? {};
    return getClaimed(listingInfo, userProfit);
  }, [idoInfo]);

  return (
    <>
      <div className="common-card join-card-wrapper">
        <div className="title-wrapper">
          <h3
            className={clsx(
              'font-size-2',
              PROGRESS_RATE.onGoing !== idoProgressRate && idoProgressRate !== PROGRESS_RATE.comingSoon
                ? 'ido-title-ending'
                : 'ido-title-normal',
            )}>
            {title}
          </h3>
          {idoProgressRate === PROGRESS_RATE.comingSoon && (
            <BaseCountdown
              value={moment((idoInfo?.startTime ?? 0) * 1000).valueOf()}
              format="DD/HH/mm/ss"
              delimiter=":"
              onFinish={successBack}
            />
          )}
          {idoProgressRate === PROGRESS_RATE.onGoing && (
            <BaseCountdown
              value={moment((idoInfo?.endTime ?? 0) * 1000).valueOf()}
              format="DD/HH/mm/ss"
              delimiter=":"
              onFinish={successBack}
            />
          )}
        </div>

        {/* TODO JOIN IDO */}
        <>
          <div className="part-wrapper join-info-wrapper">
            {idoProgressRate !== PROGRESS_RATE.over && (
              <>
                <div className="flex-between-center" key="max">
                  <span>Maximum allocation</span>
                  <span>
                    {divDecimalsStr(idoInfo?.maxSubscription, idoInfo?.toRaiseToken?.decimals)}&nbsp;
                    {idoInfo?.toRaiseToken?.symbol ?? '--'}
                  </span>
                </div>
                <div className="flex-between-center" key="min">
                  <span>Minimum allocation</span>
                  <span>
                    {divDecimalsStr(idoInfo?.minSubscription, idoInfo?.toRaiseToken?.decimals)}&nbsp;
                    {idoInfo?.toRaiseToken?.symbol ?? '--'}{' '}
                  </span>
                </div>
              </>
            )}
            <div className="flex-between-center" key="myShare">
              <span>My allocation</span>
              <span className="font-weight-500">
                {divDecimalsStr(idoInfo?.userInvest?.amount, idoInfo?.toRaiseToken?.decimals)}&nbsp;
                {idoInfo?.toRaiseToken?.symbol ?? '--'}
              </span>
            </div>
            <div className="flex-between-center" key="willGet">
              <span>To receive</span>
              <span className="font-weight-500">
                {idoInfo?.userInvest?.amount
                  ? divDecimals(idoInfo?.userInvest?.amount, idoInfo?.toRaiseToken?.decimals)
                      .times(
                        divDecimals(
                          idoInfo?.preSalePrice ?? 0,
                          getPriceDecimal(idoInfo?.crowdFundingIssueToken, idoInfo?.toRaiseToken),
                        ),
                      )
                      .toFixed()
                  : '--'}
                &nbsp;{idoInfo?.crowdFundingIssueToken?.symbol ?? '--'}{' '}
              </span>
            </div>
            {idoProgressRate === PROGRESS_RATE.over && (idoInfo?.totalPeriod ?? 1) > 1 && (
              <>
                <div className="flex-between-center" key="willClaim">
                  <span>Unlocked</span>
                  <span>
                    {isEffectiveNumber(claimInfo.toBeClaimed.plus(claimInfo.claimed))
                      ? divDecimalsStr(
                          claimInfo.toBeClaimed.plus(claimInfo.claimed),
                          idoInfo?.crowdFundingIssueToken?.decimals,
                        )
                      : '--'}
                    &nbsp;
                    {idoInfo?.crowdFundingIssueToken?.symbol ?? '--'}
                  </span>
                </div>
                <div className="flex-between-center" key="Claimed">
                  <span>Received</span>
                  <span>
                    {isEffectiveNumber(claimInfo.claimed)
                      ? divDecimalsStr(claimInfo.claimed, idoInfo?.crowdFundingIssueToken?.decimals)
                      : '--'}
                    &nbsp;
                    {idoInfo?.crowdFundingIssueToken?.symbol ?? '--'}
                  </span>
                </div>
                {/* <div className="flex-between-center" key="willClaim">
                  <span>To be claimed</span>
                  <span>
                    {isEffectiveNumber(claimInfo.toBeClaimed)
                      ? divDecimalsStr(claimInfo.toBeClaimed, idoInfo?.crowdFundingIssueToken?.decimals)
                      : '--'}
                    &nbsp;
                    {idoInfo?.crowdFundingIssueToken?.symbol ?? '--'}
                  </span>
                </div> */}
              </>
            )}
          </div>
          <div className="join-action-wrapper">
            {(idoProgressRate === PROGRESS_RATE.comingSoon || idoProgressRate === PROGRESS_RATE.onGoing) && (
              <div className="input-wrapper">
                <Input.Group compact>
                  <Input
                    value={inputVal}
                    suffix={
                      <Button
                        type="primary"
                        disabled={idoProgressRate !== PROGRESS_RATE.onGoing}
                        onClick={() =>
                          setInputVal(
                            maxInvest
                              .div(10 ** (idoInfo?.toRaiseToken?.decimals ?? 8))
                              .dp(idoInfo?.toRaiseToken?.decimals ?? 8)
                              .toFixed(),
                          )
                        }>
                        Max
                      </Button>
                    }
                    onChange={(e) =>
                      setInputVal(
                        parseInputNumberChange(
                          e.target.value,
                          divDecimals(maxInvest, idoInfo?.toRaiseToken?.decimals ?? 8),
                          idoInfo?.toRaiseToken?.decimals,
                        ),
                      )
                    }
                  />
                </Input.Group>
                <div className="flex-between-center balance-wrapper">
                  <span>Balance:</span>
                  <span>
                    {divDecimalsStr(balance?.[0], idoInfo?.toRaiseToken?.decimals ?? 8)}
                    {idoInfo?.toRaiseToken?.symbol ?? '--'}
                  </span>
                </div>
                <Button
                  type="primary"
                  className="invest-btn"
                  loading={btnLoading === ActionType.Invest}
                  disabled={canInvest}
                  onClick={InvestClick}>
                  {`Purchase with ${idoInfo?.toRaiseToken?.symbol ?? '--'}`}
                </Button>
                {whitelist?.isAvailable && idoProgressRate === PROGRESS_RATE.onGoing && (
                  <>
                    {inWhitelist && (
                      <p className="tip-wrapper primary-tip">
                        Whitelist is enabled for this project and you are listed.
                      </p>
                    )}
                    {!inWhitelist && (
                      <p className="tip-wrapper error-tip">
                        Whitelist is enabled for this project and you are not listed. Please contact the project team.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
            {!!idoInfo?.userInvest?.amount && idoProgressRate !== PROGRESS_RATE.over && (
              <Button
                className="withdraw-btn"
                type="link"
                loading={btnLoading === ActionType.UnInvest}
                onClick={() => {
                  showModal({
                    title: 'Investment redemption',
                    width: isMobile ? '22.8571rem' : 600,
                    className: 'project-manner-modal',
                    content: (
                      <>
                        <span className="warning-tip">A 10% breach fine </span>
                        will be deducted if you redeem your investments early.
                        <br />
                        Do you want to continue?
                      </>
                    ),
                    closeIcon: () => null,
                    onOk: UnInvestClick,
                  });
                }}
                danger>
                Investment redemption
              </Button>
            )}
            {idoProgressRate === PROGRESS_RATE.over && (
              <>
                <Button
                  type="primary"
                  className="claim-btn"
                  loading={btnLoading === ActionType.Claim}
                  disabled={claimInfo.disabled}
                  onClick={ClaimClick}>
                  Claim the tokens
                </Button>
                {/* <Button
                  type="primary"
                  className="claim-btn"
                  onClick={async () => {
                    if (!account || !contract) return;
                    if (!idoInfo?.hash) return;
                    const res = await contract?.callSendMethod('NextPeriod', account, idoInfo?.hash);
                    if (res?.error) return message.error(res?.error?.message || 'Invest error');
                    res?.TransactionId && messageHTML(res?.TransactionId);
                    successBack();
                  }}>
                  NextPeriod
                </Button> */}
              </>
            )}
          </div>
        </>
        {/* TODO team get */}
        {/* {idoProgressRate === PROGRESS_RATE.over && (
          <>
            <div className="part-wrapper team-claim-wrapper">
              <div className="flex-between-center" key="myShare">
                <span>团队所得</span>
                <span className="font-weight-500">
                  {projectInfo?.userInvest?.amount ?? '--'}&nbsp;
                  {projectInfo?.userInvest?.investSymbol ?? idoInfo?.toRaiseToken?.symbol ?? '--'}
                </span>
              </div>
              <div className="flex-between-center" key="myShare1">
                <span>My allocation</span>
                <span className="font-weight-500">
                  {projectInfo?.userInvest?.amount ?? '--'}&nbsp;
                  {projectInfo?.userInvest?.investSymbol ?? idoInfo?.toRaiseToken?.symbol ?? '--'}
                </span>
              </div>
            </div>
            <Button className="claim-team-btn" type="primary">
              领取团队所得
            </Button>
          </>
        )} */}
      </div>
      {/* {idoProgressRate === PROGRESS_RATE.over && (
        <div className="common-card unlock-btn-wrapper">
          <h5 className="action-card-title">Unlock liquidity</h5>
          <Button className="unlock-btn" type="primary" onClick={() => navigate(`/liquidity-unlock/${idoInfo?.id}`)}>
            Confirm
          </Button>
        </div>
      )} */}
    </>
  );
}
