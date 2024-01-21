export enum ProjectStatus {
  UPCOMING = 2,
  PARTICIPATORY = 3,
  UNLOCKED = 4,
  ENDED = 5,
  CANCELED = 6,
}

export enum PROGRESS_RATE {
  comingSoon = 'coming-soon',
  onGoing = 'on-going',
  over = 'progress-over',
  cancelled = 'progress-cancelled',
}

export interface TokenInfo {
  id: string;
  address: string;
  symbol: string;
  name?: string;
  decimals: number;
}

export interface IProjectInfo {
  additionalInfo?: {
    projectName: string;
    projectSummary: string;
    projectDescription: string;
    x: string;
    telegram: string;
    medium: string;
    logoUrl: string;
    projectImgs: string;
  };
  creator?: string;
  crowdFundingIssueAmount?: string;
  crowdFundingIssueToken?: TokenInfo & {
    name: string;
  };
  crowdFundingType?: string;
  currentCrowdfundingTokenAmount?: string;
  currentPeriod?: number;
  currentRaisedAmount?: string;
  endTime?: string;
  firstDistributeProportion?: string;
  hash?: string;
  id?: string;
  investAmount?: string;
  isBurnRestToken?: boolean;
  isCanceled?: boolean;
  lastModificationTime?: string;
  liquidityLockProportion?: number;
  listMarketInfo?: ListMarketInfo[];
  maxSubscription?: string;
  minSubscription?: string;
  participantCount?: number;
  periodDuration?: number;
  preSalePrice?: string;
  publicSalePrice?: string;
  restDistributeProportion?: number;
  startTime?: string;
  toClaimAmount?: string;
  toRaiseToken?: TokenInfo;
  toRaisedAmount?: string;
  totalPeriod?: number;
  unlockTime?: string;
  whitelistId?: string;
  isEnableWhitelist?: boolean;
  status?: ProjectStatus;
  cancelTime?: string;
  whitelistInfo?: {
    url?: string;
  };
}

export interface ProjectItem {
  additionalInfo: { [key: string]: any };
  creator?: string;
  crowdFundingIssueAmount?: number;
  crowdFundingIssueToken?: TokenInfo & {
    name: string;
  };
  crowdFundingType?: string;
  currentCrowdfundingTokenAmount?: number;
  currentPeriod?: number;
  currentRaisedAmount?: number;
  endTime: number;
  firstDistributeProportion?: number;
  hash?: string;
  id?: string;
  investAmount?: number;
  isBurnRestToken?: boolean;
  isCanceled?: boolean;
  lastModificationTime: string;
  liquidityLockProportion?: number;
  listMarketInfo?: ListMarketInfo[];
  maxSubscription?: number;
  minSubscription?: number;
  participantCount?: number;
  periodDuration?: number;
  preSalePrice?: number;
  publicSalePrice?: number;
  restDistributeProportion?: number;
  startTime?: number;
  toClaimAmount?: number;
  toRaiseToken?: TokenInfo;
  toRaisedAmount?: number;
  totalPeriod?: number;
  unlockTime?: number;
  whitelistId?: string;
  isEnableWhitelist?: boolean;
}

export interface ListMarketInfo {
  market?: string;
  weight?: number;
}
