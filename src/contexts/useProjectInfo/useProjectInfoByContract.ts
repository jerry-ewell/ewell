import { getProjectProgress } from 'contexts/useProjectInfo/utils';
import { useActiveWeb3React } from 'hooks/web3';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PBTimestamp } from 'types/aelf';
import { PROGRESS_RATE } from 'types/project';
import { ContractBasic } from 'utils/contract';

interface ProjectInfo {
  projectId: string;
  acceptedCurrency: string;
  projectCurrency: string;
  crowdFundingType: string;
  crowdFundingIssueAmount: number;
  preSalePrice: number;
  startTime: PBTimestamp;
  endTime: PBTimestamp;
  minSubscription: number;
  maxSubscription: number;
  isEnableWhitelist: boolean;
  isBurnRestToken: boolean;
  additionalInfo: { data: { [x: string]: string } };
  creator: string;
  toRaisedAmount: number;
  currentRaisedAmount: number;
  enabled: boolean;
  progressRate?: PROGRESS_RATE;
}

export interface InvestDetail {
  investSymbol: string;
  amount: number;
  isUnInvest: boolean;
}

export interface ProfitDetail {
  latestPeriod: number;
  symbol: string;
  totalProfit: number;
  amountsMap: { [x: string]: string };
}

export interface ListMarket {
  market: string;
  weight: number;
}

export interface ListMarketInfo {
  data: ListMarket[];
}

export interface ProjectListInfo {
  projectId: string;
  publicSalePrice: number;
  listMarketInfo: ListMarketInfo;
  liquidityLockProportion: number;
  unlockTime: PBTimestamp;
  latestPeriod: number;
  totalPeriod: number;
  firstDistributeProportion: number;
  restDistributeProportion: number;
  periodDuration: number;
  isListed: boolean;
}

export interface UserProjectInfo {
  projectInfo?: ProjectInfo;
  userInvest?: InvestDetail;
  listingInfo?: ProjectListInfo;
  userProfit?: ProfitDetail;
}

export function useProjectInfoByContract(contract?: ContractBasic | null, refresh?: number) {
  const { projectId } = useParams();
  const [info, setInfo] = useState<UserProjectInfo>();
  const { account } = useActiveWeb3React();
  const fetch = useCallback(async () => {
    if (!contract || !projectId) return;
    const [info, userInvest, userProfit, listingInfo] = await Promise.all([
      contract?.callViewMethod('GetProjectInfo', projectId),
      contract?.callViewMethod('GetInvestDetail', [projectId, account]),
      contract?.callViewMethod('GetProfitDetail', [projectId, account]),
      contract?.callViewMethod('GetProjectListInfo', projectId),
    ]);
    console.log(info, 'info===', userProfit, listingInfo);
    const progressRate = getProjectProgress(
      (info as ProjectInfo)?.startTime?.seconds,
      (info as ProjectInfo)?.endTime?.seconds,
      !info?.enabled,
    );

    setInfo({
      projectInfo: info?.error ? undefined : { ...info, progressRate },
      userInvest: userInvest?.error ? undefined : userInvest,
      listingInfo: listingInfo?.error ? undefined : listingInfo,
      userProfit: userProfit?.error ? undefined : userProfit,
    });
  }, [account, contract, projectId]);

  useEffect(() => {
    fetch();
  }, [fetch, refresh]);
  return info;
}
